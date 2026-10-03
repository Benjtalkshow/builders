import type { Metadata } from 'next';

import { siteConfig } from '@/lib/seo/site';

/**
 * Open Graph fields every page shares. Next.js merges metadata shallowly, so a
 * page that sets `openGraph` replaces the parent's block entirely and loses
 * these fields unless it spreads this in.
 *
 * Images are left out on purpose. Share images come from the
 * `opengraph-image` file convention, and setting `images` here would override
 * any per-route `opengraph-image` file.
 */
export const sharedOpenGraph = {
  type: 'website',
  siteName: siteConfig.name,
  locale: siteConfig.locale,
} satisfies Metadata['openGraph'];

/** Twitter card fields every page shares. See `sharedOpenGraph`. */
export const sharedTwitter = {
  card: 'summary_large_image',
  site: siteConfig.twitterHandle,
  creator: siteConfig.twitterHandle,
} satisfies Metadata['twitter'];

/**
 * Indexing directives for public pages. Applied per page rather than in the
 * root layout so the built-in 404 page keeps its own `noindex` tag.
 */
export const indexableRobots: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

/** Build consistent, route-specific metadata for public pages. */
export function buildPageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    robots: indexableRobots,
    alternates: {
      canonical: path,
    },
    openGraph: {
      ...sharedOpenGraph,
      ...(title ? { title } : { title: siteConfig.name }),
      description,
      url: path,
    },
    twitter: {
      ...sharedTwitter,
      ...(title ? { title } : { title: siteConfig.name }),
      description,
    },
  };
}
