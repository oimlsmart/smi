/**
 * The SMI footer config — the content the site injects into the house
 * shell's footer frame (TODO.public track 02; the columns, legal pages,
 * attribution, and copyright were literals inside the shell's
 * SiteFooter.astro until 0.2.0 moved them out, and the footer this site
 * rendered before carried them baked). The shape is the package's
 * FooterConfig (@oimlsmart/site-shell/config); the Explore column is
 * NOT here — the footer derives it from the nav model — and the brand
 * block renders the injected BrandConfig, so the description speaks for
 * this site. The attribution line is the footer-class programme
 * attribution every property carries, never a promotion.
 */
import type { FooterConfig } from '@oimlsmart/site-shell/config'
import { SITE, LEGAL, PARTNERS } from './site-meta.ts'
import { HOST_REGISTRY } from './host-registry.ts'

export const FOOTER: FooterConfig = {
  // The footer's own relative links are the public site's routes, so
  // the footer resolves them against the front door — not against the
  // minisite root the nav model resolves against.
  origin: SITE.url,
  description:
    'The physical measuring instrument that ships with a standards-defined digital twin: the instrument is the API.',
  columns: [
    {
      heading: 'Programme',
      links: [
        { label: 'About OIML SMART', href: '/about/what-is-smart' },
        { label: 'Pilot programme', href: '/pilot' },
        { label: 'Contact', href: '/about/contact' },
        { label: 'GitHub', href: PARTNERS.github, external: true, icon: 'github' },
      ],
    },
  ],
  hosts: HOST_REGISTRY.map(h => ({ label: h.label, href: h.url })),
  attribution: [
    'A programme of the ',
    { label: 'International Organization of Legal Metrology', href: PARTNERS.oiml, external: true },
    ', delivered by ',
    { label: 'Ribose', href: PARTNERS.ribose, external: true },
  ],
  legal: [
    { label: 'Privacy', href: LEGAL.privacy },
    { label: 'Terms', href: LEGAL.terms },
  ],
  copyright: 'Content © OIML · Code © Ribose',
}
