export const siteConfig = {
  name: 'Boundless Builders',
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
};
