/**
 * The canonical host registry — the ONE machine-readable list of the
 * public OIML SMART properties (the same list every property's footer
 * renders). It moved into the consuming repositories when the
 * site-shell package went machinery-only (0.2.0, TODO.public track 02):
 * the footer's "The sites" column renders from it (via the footer
 * config), so the column keeps the federation's canonical link set.
 * This copy is adopted verbatim from the shell repository's reference
 * preset (presets/www/host-registry.mjs); a host joins the registry by
 * changing every copy in the same change.
 */

export interface HostEntry {
  /** The stable key. */
  key: string
  /** The host's public URL. */
  url: string
  /** The footer's display label. */
  label: string
  /** What the host is, one line. */
  desc: string
}

export const HOST_REGISTRY: readonly HostEntry[] = [
  {
    key: 'www',
    url: 'https://www.oimlsmart.org',
    label: 'Public site',
    desc: 'The public site',
  },
  {
    key: 'platform',
    url: 'https://platform.oimlsmart.org',
    label: 'Platform',
    desc: 'The production OIML-CS SMART platform',
  },
  {
    key: 'demo',
    url: 'https://demo.oimlsmart.org',
    label: 'Demo',
    desc: 'The public demo instance',
  },
  {
    key: 'id',
    url: 'https://id.oimlsmart.org',
    label: 'Identity',
    desc: 'The identity service',
  },
  {
    key: 'status',
    url: 'https://status.oimlsmart.org',
    label: 'Status',
    desc: 'The status page',
  },
  {
    key: 'primmel',
    url: 'https://www.primmel.org',
    label: 'Primmel',
    desc: 'The Primmel language site and specification',
  },
  {
    key: 'studio',
    url: 'https://www.oimlsmart.org/studio/',
    label: 'Studio',
    desc: 'The studio minisite',
  },
]
