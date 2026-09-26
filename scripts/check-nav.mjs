#!/usr/bin/env node
/**
 * The nav completeness gate for this site — the CI check that every
 * href in the nav model resolves to a real page (TODO.public track 02,
 * where the nav moved into this repository and grew its own gate).
 *
 * It wraps the installed shell package's check-nav (the one completeness
 * gate, no second implementation) with this site's one twist: the
 * GitHub Pages deployment serves this repo's dist at <front door>/smi
 * (the `base` in astro.config.mjs), while the dist tree itself carries
 * no /smi prefix — Astro's base prefixes URLs, not the output layout.
 * The wrapper translates: a nav href under the deployment root is
 * checked against the dist file the deployment actually ships (the
 * model keeps the served path, ADR-0003). A route served by a SIBLING
 * deployment cannot be checked against this dist at all — it gets
 * declared below, flipped to external, and verified live against the
 * origin (or skipped, reported, under --offline). The declared list is
 * empty on purpose today: every nav route is this minisite's own. A
 * future entry served elsewhere gets declared here, not discovered by
 * a red gate. (The recs consumer's wrapper is the reference for this
 * translation; the two gates differ only in the deployment root.)
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
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MODEL_FILE = join(ROOT, 'src', 'data', 'nav-config.ts')
const DIST_DIR = join(ROOT, 'dist')
const ORIGIN = 'https://www.oimlsmart.org'

// The deployment root: the `base` in astro.config.mjs (SITE.base in
// src/data/site-meta.ts). This repo's dist ships at <origin>/smi.
const DEPLOYMENT_ROOT = '/smi'

// The routes another deployment serves on the shared front door. Empty
// today (see the header comment).
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

// --- mark the cross-deployment entries external, strip the deployment
// --- root from the entries this dist ships -------------------------------

function isCrossDeployment(href) {
  return CROSS_DEPLOYMENT_PREFIXES.some(p => href === p || href.startsWith(p + '/') || href.startsWith(p + '?') || href.startsWith(p + '#'))
}

function transform(model) {
  const flipped = []
  const stripped = []
  const visit = (link) => {
    if (!link.external && isCrossDeployment(link.href)) {
      link.external = true
      flipped.push(link.href)
    } else if (!link.external && link.href.startsWith(DEPLOYMENT_ROOT)) {
      link.href = link.href.slice(DEPLOYMENT_ROOT.length) || '/'
      stripped.push(link.href)
    }
  }
  for (const item of model.items ?? []) {
    if (item.type === 'dropdown') {
      for (const link of item.config?.links ?? []) visit(link)
    } else if (item.type === 'link') {
      visit(item)
    }
  }
  if (model.productCta) visit(model.productCta)
  return { flipped, stripped }
}

// --- main -------------------------------------------------------------------

const argv = process.argv.slice(2)
const offline = argv.includes('--offline')

if (!offline && !existsSync(DIST_DIR)) {
  fail(`no dist/ to check against — run \`npm run build\` first (or pass --offline)`)
}

const model = loadModel(MODEL_FILE)
const { flipped, stripped } = transform(model)

const dir = mkdtempSync(join(tmpdir(), 'smi-check-nav-'))
const checkModel = join(dir, 'nav-model.check.json')
writeFileSync(checkModel, JSON.stringify(model))

// The direct dependency's install path (npm's layout guarantees it; the
// package's exports map exposes no package.json to import-resolve).
const packageCheckNav = join(ROOT, 'node_modules', '@oimlsmart', 'site-shell', 'scripts', 'check-nav.mjs')
if (!existsSync(packageCheckNav)) fail(`the shell package's check-nav is missing: ${packageCheckNav} — is @oimlsmart/site-shell installed?`)

const args = [packageCheckNav, checkModel, '--dist', DIST_DIR, '--origin', ORIGIN, ...argv]
const run = spawnSync(process.execPath, args, { stdio: 'inherit' })
if (run.status === 0) {
  console.log(`smi check-nav: ${stripped.length} entries translated from the /smi deployment root into dist/, ${flipped.length} checked live as cross-deployment routes (${CROSS_DEPLOYMENT_PREFIXES.length} declared prefixes).`)
}
process.exit(run.status ?? 1)
