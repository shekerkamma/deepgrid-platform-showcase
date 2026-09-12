#!/usr/bin/env node
// Rebuild the Next.js/vinext showcase from source and stage it for a GitHub Pages base path.
//
//   node source/scripts/publish-showcase.mjs --base /deepgrid-platform-showcase --out .
//   node source/scripts/publish-showcase.mjs --base /content-ideas/deepgrid-platform --out ../content-ideas-gh-pages/deepgrid-platform
//
// The build emits every script and stylesheet under an absolute `/_next/` prefix.
// GitHub Pages serves a project site from a sub-path, so that prefix is rewritten
// to `<base>/_next/` after the build. Image and slide references are already
// relative (`./images/...`), so they need no rewrite.
//
// Pass --skip-build to stage an existing source/showcase-app/dist/client tree.

import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, '..', 'showcase-app');
const repoRoot = path.resolve(here, '..', '..');

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};
const base = (flag('--base', '/deepgrid-platform-showcase') || '').replace(/\/+$/, '');
const outArg = flag('--out', repoRoot);
const out = path.resolve(repoRoot, outArg);
const skipBuild = args.includes('--skip-build');

if (!base.startsWith('/')) throw new Error(`--base must start with "/" (got ${base})`);

const dist = path.join(app, 'dist', 'client');

if (!skipBuild) {
  if (!fs.existsSync(path.join(app, 'node_modules'))) {
    throw new Error(`Dependencies are not installed. Run "npm ci" in ${app} first.`);
  }
  console.log(`Building ${app} ...`);
  execFileSync(process.execPath, [path.join(app, 'scripts', 'build.mjs')], {cwd: app, stdio: 'inherit'});
}
if (!fs.existsSync(dist)) throw new Error(`Build output missing: ${dist}`);

// Replace only the generated artifact, never the hand-written repository files.
const generated = ['_next', 'images', 'slides', 'index.html', 'index.rsc', 'favicon.svg', 'vinext-client-entry-manifest.json'];
fs.mkdirSync(out, {recursive: true});
for (const name of generated) {
  const target = path.join(out, name);
  if (fs.existsSync(target)) fs.rmSync(target, {recursive: true, force: true});
  const source = path.join(dist, name);
  if (fs.existsSync(source)) fs.cpSync(source, target, {recursive: true});
}

const rewritable = /\.(html|js|rsc|json|css)$/;
let rewritten = 0;

// Only the files this script just copied are touched, so staging into the
// repository root never rewrites unrelated repository JSON or Markdown.
for (const name of generated) {
  const target = path.join(out, name);
  if (!fs.existsSync(target)) continue;
  const stack = [target];
  while (stack.length > 0) {
    const current = stack.pop();
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(current)) stack.push(path.join(current, entry));
      continue;
    }
    // A copy from a Windows mount under WSL arrives as 0755, which Git records
    // as a mode change on every otherwise unmodified image.
    fs.chmodSync(current, 0o644);
    if (!rewritable.test(current)) continue;
    const before = fs.readFileSync(current, 'utf8');
    const after = before.replaceAll('/_next/', `${base}/_next/`);
    if (after !== before) {
      fs.writeFileSync(current, after);
      rewritten += 1;
    }
  }
}

// GitHub Pages skips underscore-prefixed directories unless Jekyll is disabled.
fs.writeFileSync(path.join(out, '.nojekyll'), '');

// A missing chunk produces a blank page with no server error, so verify the
// entry document's local references resolve on disk before anything is pushed.
const html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)="([^"?#]+)"/g)]
  .map((m) => m[1])
  .filter((ref) => ref.startsWith(`${base}/`) || ref.startsWith('./'));
if (refs.length === 0) throw new Error('No local entry references found — the base-path rewrite did not apply.');
for (const ref of refs) {
  const rel = ref.startsWith('./') ? ref.slice(2) : ref.slice(base.length + 1);
  const p = path.join(out, rel);
  if (!fs.existsSync(p)) throw new Error(`Missing referenced file: ${ref} -> ${p}`);
}

console.log(`Staged ${out} at base "${base}": ${rewritten} files rewritten, ${refs.length} entry references verified.`);
