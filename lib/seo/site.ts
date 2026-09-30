/**
 * Shared site configuration for Boundless Builders. Page metadata and JSON-LD
 * structured data both read from here, so the same strings are never
 * duplicated across routes.
 */
export const siteConfig = {
  name: 'Boundless Builders',
  /** The organization behind the app, used by the Organization schema. */
  organizationName: 'Boundless',
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    'https://builders.boundlessfi.xyz',
  description:
    'Discover the builders, projects, and teams shipping on Stellar through Boundless. A public showcase of the people and products of the ecosystem.',
  twitterHandle: '@boundless_fi',
  locale: 'en_US',
  /** The main Boundless app, where builders sign up and create. */
  parentUrl:
    process.env.NEXT_PUBLIC_BOUNDLESS_APP_URL?.trim() ||
    'https://boundlessfi.xyz',
  /** Public path to the white Boundless logo used by structured data. */
  logoPath: '/brand/boundless-logo-white.svg',
};
