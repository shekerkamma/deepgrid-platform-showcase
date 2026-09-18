#!/usr/bin/env bash
# Extracts the knowledge graph from knowledge/corpus/ with graphify, routed through CLIProxyAPI to a
# subscription Gemini model (served by the antigravity provider), never the free AI Studio tier:
# that tier allows 5 requests a minute, and a 429 there silently leaves files with no nodes.
#
#   npm run graph:corpus && npm run graph:extract
#
# CLIProxyAPI runs Windows-side, so from WSL it is on the default-gateway IP, which changes on reboot.
# The key comes from CLIPROXY_API_KEY, else the cliproxyapi entry in ~/.dsh/.credentials.yaml.
set -euo pipefail
cd "$(dirname "$0")/.."
GW=${CLIPROXY_HOST:-$(ip route show default | awk '{print $3}')}
KEY=${CLIPROXY_API_KEY:-$(python3 - <<'PY'
import yaml, pathlib
d = yaml.safe_load(pathlib.Path('~/.dsh/.credentials.yaml').expanduser().read_text())
def walk(o, p=''):
    if isinstance(o, dict):
        for k, v in o.items(): yield from walk(v, f'{p}/{k}')
    elif isinstance(o, str) and 'cliproxy' in p.lower(): yield o
print(next(walk(d), ''))
PY
)}
[ -n "$KEY" ] || { echo "no CLIProxyAPI key: set CLIPROXY_API_KEY" >&2; exit 1; }
MODEL=${GRAPHIFY_MODEL:-gemini-3.8-flash-high}
# prove the route before spending a run on it: a listed model is not a routable one
curl -sf -m 60 "http://$GW:8317/v1/chat/completions" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d "{\"model\":\"$MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"Reply OK\"}]}" >/dev/null \
  || { echo "CLIProxyAPI at $GW:8317 did not serve $MODEL" >&2; exit 1; }
env -u GEMINI_API_KEY -u GOOGLE_API_KEY OPENAI_BASE_URL="http://$GW:8317/v1" OPENAI_API_KEY="$KEY" OPENAI_MODEL="$MODEL" \
  graphify extract knowledge/corpus --backend openai --out knowledge --token-budget 6000 --max-concurrency 2 "$@"
# name the communities (GRAPH_REPORT.md, graph.html) through the same route
env -u GEMINI_API_KEY -u GOOGLE_API_KEY OPENAI_BASE_URL="http://$GW:8317/v1" OPENAI_API_KEY="$KEY" OPENAI_MODEL="$MODEL" \
  graphify label knowledge --backend=openai --model="$MODEL" --max-concurrency=1
