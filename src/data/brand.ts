/**
 * The SMI brand config — the identity values the site injects into the
 * house shell's header and mobile overlay (one brand object passed to
 * the one Base mount, TODO.public track 02). They were the package's
 * baked federation defaults until 0.2.0 moved content out; the minisite
 * now declares its own. The logo pair reuses the assets the site
 * already renders — the canonical smi component logos, no per-site
 * copies. The site has no sign-in, so no signInHref is declared and no
 * sign-in link renders anywhere; the theme color is the one the shell
 * published for every property before the injection contract existed.
 * The shape is the package's BrandConfig (@oimlsmart/site-shell/config).
 */
import type { BrandConfig } from '@oimlsmart/site-shell/config'
import { COMPONENT_ASSET_BASE, SITE_ORIGIN } from './site-meta.ts'

export const BRAND: BrandConfig = {
  brandName: 'SMART Measuring Instruments',
  logoLight: `${COMPONENT_ASSET_BASE}/smi-light.svg`,
  logoDark: `${COMPONENT_ASSET_BASE}/smi-dark.svg`,
  homeHref: `${SITE_ORIGIN}/`,
  themeColor: '#004996',
}
