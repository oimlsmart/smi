/**
 * The SMI nav model — the ordered items the house shell's header and
 * the mobile overlay render (one model, injected through Base's `nav`
 * prop, TODO.public track 02). The shell's header carried the public
 * site's baked federation nav until 0.2.0; the minisite now declares
 * its own, and it is deliberately slim: the minisite's own sections
 * only, as standalone links. The site root (About) is not a nav entry —
 * the brand mark links it (BrandConfig.homeHref), and a prefix-matched
 * entry for the root would light up on every page of a one-tree site.
 * Cross-site navigation (the rest of the federation) stays out of the
 * top nav by doctrine; it lives in the footer's host registry.
 *
 * Hrefs are relative to the model's `origin` — the minisite's own
 * deployed root (the front door's /smi path), so the chrome's links
 * resolve from any host (ADR-0003). The `matchPrefix` values are the
 * deployed paths instead (the deployment base included): the header
 * matches them against the served pathname.
 *
 * The file is data-only: the active-path predicates ship with the
 * package's config contract (@oimlsmart/site-shell/config), never from
 * here. The relative imports carry explicit .ts extensions on purpose
 * (the nav completeness gate, scripts/check-nav.mjs, loads this file
 * under plain node's type stripping, which resolves relative
 * specifiers literally — the extensionless house style would fail it).
 */
import type { NavModel } from '@oimlsmart/site-shell/config'
import { SITE, SITE_ORIGIN } from './site-meta.ts'

export const NAV_MODEL: NavModel = {
  origin: SITE_ORIGIN,
  items: [
    { type: 'link', label: 'Story', href: '/story', matchPrefix: `${SITE.base}/story` },
    { type: 'link', label: 'Docs', href: '/docs', matchPrefix: `${SITE.base}/docs` },
    { type: 'link', label: 'Demo', href: '/demo', matchPrefix: `${SITE.base}/demo` },
  ],
}
