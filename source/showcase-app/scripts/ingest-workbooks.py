"""Converts the financial workbooks in ../documents/ into analysis-ready CSVs and Ask DeepGrid passages.

    npm run graph:workbooks      (uv run --with pandas --with openpyxl python scripts/ingest-workbooks.py)

Header detection is the /excel-ingest skill's own (skills/ai-analyst/excel-ingest/scripts/excel_ingest.py,
detect_header), applied per BLOCK rather than per sheet. These are hand-built model sheets that stack several
tables with blank rows between them; one header per sheet sits halfway down (Assumptions: row 23 of 46) and
silently drops every block above it, such as the deal terms or the TAM funnel. Here each blank-separated block
gets its own detection:
  - high confidence  -> a table: CSV at ../documents/csv/<workbook>__<sheet>__b<k>.csv, one passage per rows
  - otherwise        -> read against the sheet's last fiscal-year header when there is one (a table that
                        continues past blank rows), else kept as notes, so no commentary is lost
Merged cells are reported, never filled (the skill's rule). Values are the workbook's cached formula results.

Two workbooks, both indexed and each labelled: they disagree (FY2032 revenue Rs 1,128.45 Cr in the financial
model, Rs 1,387.95 Cr in the business plan) and the memorandum says so. EXCLUDE keeps salary-level payroll and
the ownership table off the public site. Divider sheets with no cells are skipped.
"""
import importlib.util
import json
import re
import sys
from pathlib import Path

import openpyxl
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT.parent / 'documents'
CSV_DIR = DOCS / 'csv'
SKILL = Path.home() / 'content-ideas/skills/ai-analyst/excel-ingest/scripts/excel_ingest.py'
WORKBOOKS = [
    ('Deepgrid_Semi_Financial_Model_Corrected_v3-sept.xlsx', 'fm', 'Financial Model v3 (corrected, Sept 2026)'),
    ('DeepGrid_Semi_Business_Plan_v2.xlsx', 'bp', 'Business Plan v2'),
]
EXCLUDE = {('bp', 'Payroll'), ('bp', 'Cap Table')}
MAX = 1200

spec = importlib.util.spec_from_file_location('excel_ingest', SKILL)
excel_ingest = importlib.util.module_from_spec(spec)
spec.loader.exec_module(excel_ingest)


def fmt(v):
    if isinstance(v, float):
        if v.is_integer():
            return f'{int(v):,}'
        return f'{v:,.2f}'.rstrip('0').rstrip('.')
    if isinstance(v, int) and not isinstance(v, bool):
        return f'{v:,}'
    return re.sub(r'\s+', ' ', str(v)).strip()


def slug(t):
    return re.sub(r'[^a-z0-9]+', '_', str(t).lower()).strip('_')


def blocks(raw):
    """Runs of rows separated by fully blank rows, as (first_row, frame). Columns keep their sheet
    positions, so a block without its own header can still be read against the sheet's last one."""
    out, start = [], None
    empty = raw.isna().all(axis=1).tolist() + [True]
    for i, e in enumerate(empty):
        if not e and start is None:
            start = i
        elif e and start is not None:
            out.append((start, raw.iloc[start:i]))
            start = None
    return out


def header_names(row):
    names, seen = {}, set()
    for col, c in row.items():
        if pd.isna(c):
            continue
        h = fmt(c)
        # a repeated year column starts the business plan's second block, the share of revenue
        names[col] = f'{h} (ratio)' if h in seen and h not in ('x', 'X') else h
        seen.add(h)
    return names


def row_line(row, names):
    cells = [(col, v) for col, v in row.items() if not pd.isna(v)]
    if not cells:
        return None
    label = fmt(cells[0][1]) if isinstance(cells[0][1], str) else ''
    parts = []
    for col, v in (cells[1:] if label else cells):
        h = (names or {}).get(col)
        parts.append(fmt(v) if h in (None, 'x', 'X', 'Item') or h == fmt(v) else f'{h} {fmt(v)}')
    return f"{label} — {'; '.join(parts)}" if label and parts else (label or '; '.join(parts))


def pack(lines):
    out, buf = [], []
    for ln in lines:
        if buf and len(' '.join(buf)) + len(ln) > MAX:
            out.append(buf)
            buf = []
        buf.append(ln)
    return out + ([buf] if buf else [])


def main():
    CSV_DIR.mkdir(parents=True, exist_ok=True)
    units, report = [], []
    for fname, code, label in WORKBOOKS:
        path = DOCS / fname
        merged = {ws.title: [str(r) for r in ws.merged_cells.ranges] for ws in openpyxl.load_workbook(path).worksheets}
        for sheet, raw in pd.read_excel(path, sheet_name=None, header=None).items():
            name = sheet.strip()
            if (code, name) in EXCLUDE:
                report.append(f'  {label} / {name}: EXCLUDED (not published)')
                continue
            if raw.dropna(how='all').empty:
                continue
            lines, tables, names = [], 0, None
            for first, frame in blocks(raw):
                compact = frame.dropna(axis=1, how='all').reset_index(drop=True)
                hdr, conf = excel_ingest.detect_header(compact) if len(compact) > 1 else (0, 'low')
                if conf == 'high':
                    names = header_names(frame.iloc[hdr])
                    body = frame.iloc[hdr + 1:]
                    tables += 1
                    table = body.dropna(axis=1, how='all')
                    table.columns = [names.get(c, f'col{c}') for c in table.columns]
                    table.to_csv(CSV_DIR / f'{slug(Path(fname).stem)}__{slug(name)}__b{tables}.csv', index=False)
                    lines += [ln + ':' for ln in (row_line(r, None) for _, r in frame.iloc[:hdr].iterrows()) if ln]
                    lines += [ln for ln in (row_line(r, names) for _, r in body.iterrows()) if ln]
                    report.append(f'  {label} / {name} block {tables}: header row {first + hdr + 1}, {len(body)} data rows, '
                                  f'columns: {", ".join(v for v in names.values() if v not in ("x", "X"))[:90]}')
                else:
                    # no header of its own. Only a fiscal-year header carries over (the business plan's P&L
                    # continues past blank rows); a unit header like "$ | Rs Cr" does not: the tapeout sheet's
                    # next section would otherwise read "SoC2 die area (mm2) — $ 57".
                    years = names and sum(1 for v in names.values() if re.fullmatch(r'FY\s?20\d\d', v)) >= 3
                    if not years:
                        names = None
                    rows = [ln for ln in (row_line(r, names) for _, r in frame.iterrows()) if ln]
                    lines += rows
                    if names and any(pd.api.types.is_number(v) for v in frame.stack().tolist()):
                        report.append(f'  {label} / {name}: rows {first + 1}-{first + len(frame)} read against the header above')
            if merged.get(sheet):
                report.append(f'  {label} / {name}: {len(merged[sheet])} merged ranges reported, not filled')
            # one row per line, so Ask can quote the matching row rather than the sheet's banner
            for k, b in enumerate(pack(lines)):
                units.append({'id': f'wb:{code}:{slug(name)}:{k + 1}', 'title': f'{name} · {label}' + (f' (part {k + 1})' if k else ''),
                              'text': '\n'.join(b), 'source': {'kind': 'document', 'label': f'{label} · sheet “{name}”', 'docKind': 'Workbook'}})
    out = ROOT / 'knowledge/workbooks.json'
    out.write_text(json.dumps({'units': units}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print('\n'.join(report), file=sys.stderr)
    print(f'workbooks: {len(units)} passages -> knowledge/workbooks.json; CSVs in {CSV_DIR.relative_to(ROOT.parent.parent)}', file=sys.stderr)


if __name__ == '__main__':
    main()
