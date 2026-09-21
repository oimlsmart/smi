#!/usr/bin/env node
/**
 * The nav completeness gate for this site — the CI check that every
 * href in the nav model resolves to a real page (TODO.public track 02,
 * where the nav moved into this repository and grew its own gate).
 *
 * It wraps the installed shell package's check-nav (the one completeness
 * gate, no second implementation) with this site's shape: the model is
 * loaded through plain node's type stripping first — the same load the
 * gate's own legs perform, which keeps src/data/nav-config.ts honest
 * about its data-only idiom — and then handed to the package tool:
 *
 *   - the site's routes are checked against the built --dist tree,
 *     including the page-quality legs (redirect stubs, coming-soon
 *     markers, thin mains);
 *   - the `--origin` (the model's own origin, the minisite's deployed
 *     root) resolves any relative href the tool ever fetches.
 *
 * The minisite's nav carries only routes this repository serves (the
 * minisite's own sections), so the cross-deployment marking the www
 * wrapper performs has nothing to mark here; the declared-prefix list
 * below is where a route served by another deployment would be named,
 * the same seam the www lychee config encodes as exclusions.
 *
 * Usage (the npm script `check:nav` runs the first form):
 *
 *   node scripts/check-nav.mjs                      # build dist first
 *   node scripts/check-nav.mjs --offline            # no-network runs
 *
 * Exit 0 when every entry resolves; exit 1 with each failing entry
 * named otherwise.
 */

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MODEL_FILE = join(ROOT, 'src', 'data', 'nav-config.ts')
const DIST_DIR = join(ROOT, 'dist')

// Routes another deployment serves on the shared front door. Empty
// today: Story, Docs, and Demo are this repo's to serve, and the dist
// tree carries them (the deployment base is the Pages mount, not a
// dist path).
const CROSS_DEPLOYMENT_PREFIXES = []

function fail(message) {
  console.error(`check-nav: ${message}`)
  process.exit(1)
}

// --- load the render model under node's type stripping ---------------------

function loadModel(file) {
  if (!existsSync(file)) fail(`the nav model is missing: ${file}`)
  const specifier = JSON.stringify(pathToFileURL(file).href)
  const code = `import(${specifier}).then(m => { process.stdout.write(JSON.stringify(m.NAV_MODEL ?? m.nav ?? m.default ?? m)) })`
  const run = spawnSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', code], { encoding: 'utf8' })
  if (run.status !== 0 || !run.stdout) {
    fail(`could not load the nav model (node >= 22.6 required): ${(run.stderr || '').trim()}`)
  }
  return JSON.parse(run.stdout)
}

// --- main -------------------------------------------------------------------

const argv = process.argv.slice(2)
const offline = argv.includes('--offline')

if (!offline && !existsSync(DIST_DIR)) {
  fail(`no dist/ to check against — run \`npm run build\` first (or pass --offline)`)
}

const model = loadModel(MODEL_FILE)

// The direct dependency's install path (npm's layout guarantees it; the
// package's exports map exposes no package.json to import-resolve).
const packageCheckNav = join(ROOT, 'node_modules', '@oimlsmart', 'site-shell', 'scripts', 'check-nav.mjs')
if (!existsSync(packageCheckNav)) fail(`the shell package's check-nav is missing: ${packageCheckNav} — is @oimlsmart/site-shell installed?`)

const args = [packageCheckNav, MODEL_FILE, '--dist', DIST_DIR]
if (model.origin) args.push('--origin', model.origin)
args.push(...argv)
const run = spawnSync(process.execPath, args, { stdio: 'inherit' })
if (run.status === 0) {
  console.log(`smi check-nav: the model's origin is ${model.origin ?? '(unset)'}; ${CROSS_DEPLOYMENT_PREFIXES.length} declared cross-deployment prefixes, so every entry was checked against dist/.`)
}
process.exit(run.status ?? 1)
