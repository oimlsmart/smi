/**
 * The SMI minisite's site metadata — the one home of the site's own
 * identity constants (TODO.public track 02). The house shell's baked
 * site constants left the package at 0.2.0; the values this site
 * renders now live here, and the injected config files (brand, nav,
 * footer) all derive from these, so no surface carries its own literal.
 *
 * The file is data-only under plain node (erasable syntax, no package
 * imports): the nav completeness gate loads the data tree through
 * node's type stripping.
 */

/** The front door of the federation (the shared origin). */
const FRONT_DOOR = 'https://www.oimlsmart.org'

export const SITE = {
  /** The federation front door this minisite deploys onto. */
  url: FRONT_DOOR,
  /** The deployment base path (astro.config.mjs carries the same value). */
  base: '/smi',
  title: 'SMART Measuring Instruments',
  description:
    'OIML SMI — the physical measuring instrument that ships with a standards-defined digital twin.',
} as const

/** The site's own deployed root — the origin its relative hrefs resolve
 *  against (the minisite serves under the front door's /smi path). */
export const SITE_ORIGIN = `${SITE.url}${SITE.base}`

/** The canonical legal pages (the footer's Privacy/Terms targets, served
 *  by the public site). */
export const LEGAL = {
  privacy: `${SITE.url}/privacy`,
  terms: `${SITE.url}/terms`,
}

/** Programme partners referenced by the footer's bottom bar. */
export const PARTNERS = {
  oiml: 'https://www.oiml.org',
  ribose: 'https://www.ribose.com',
  github: 'https://github.com/oimlsmart',
}

/** The canonical component-logo asset base — the one copy of the
 *  component logos the federation renders (the shell package ships no
 *  asset origin since 0.2.0). */
export const COMPONENT_ASSET_BASE = `${SITE.url}/img/components`
