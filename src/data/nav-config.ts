/**
 * The SMI nav model — the ordered items the house shell's header and
 * the mobile overlay render, and the footer's Explore column derives
 * (one model, injected through Base's `nav` prop, TODO.public track 02).
 * The shell's header carried the public site's baked federation nav
 * until 0.2.0; the minisite now declares its own, and it is
 * deliberately slim: the minisite's own sections only, as standalone
 * links. The site root (About) is not a nav entry — the brand mark
 * links it (BrandConfig.homeHref), and a prefix-matched entry for the
 * root would light up on every page of a one-tree site. Cross-site
 * navigation (the rest of the federation) stays out of the top nav by
 * doctrine; it lives in the footer's host registry.
 *
 * The model's `origin` is the front door, and every href carries the
 * deployed path in full (the /smi base included): the shell resolves a
 * relative href by concatenating the origin in front of it, and the
 * footer's Explore column resolves the SAME items against the footer's
 * own origin (the front door, so the footer's legal and programme links
 * work) — a model whose origin is the minisite root renders the header
 * correctly but the Explore column one base short (the /smi segment
 * dropped, the links landing on the front door's own routes). The recs
 * consumer's model is the reference shape (ADR-0003).
 *
 * The file is data-only: the active-path predicates ship with the
 * package's config contract (@oimlsmart/site-shell/config), never from
 * here. The relative imports carry explicit .ts extensions on purpose
 * (the nav completeness gate, scripts/check-nav.mjs, loads this file
 * under plain node's type stripping, which resolves relative
 * specifiers literally — the extensionless house style would fail it).
 */
import type { NavModel } from '@oimlsmart/site-shell/config'
import { SITE } from './site-meta.ts'

export const NAV_MODEL: NavModel = {
  // The front door: the chrome's links resolve from any host, and the
  // footer's Explore column (derived from this model, resolved against
  // the footer's front-door origin) lands on the same destinations.
  origin: SITE.url,
  items: [
    { type: 'link', label: 'Story', href: `${SITE.base}/story/`, matchPrefix: `${SITE.base}/story` },
    { type: 'link', label: 'Docs', href: `${SITE.base}/docs/`, matchPrefix: `${SITE.base}/docs` },
    { type: 'link', label: 'Demo', href: `${SITE.base}/demo/`, matchPrefix: `${SITE.base}/demo` },
  ],
}
