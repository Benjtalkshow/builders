import type { Metadata } from 'next';

import { siteConfig } from '@/lib/seo/site';

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

export function buildPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    robots: indexableRobots,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url: path,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      description,
    },
  };
}
