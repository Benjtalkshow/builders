import type { Metadata } from 'next';

const siteUrl = 'https://builders.boundlessfi.xyz';

type PageMetadataOptions = {
  description: string;
  path: `/${string}` | '/';
  title?: string;
};

/** Build consistent metadata for the public Boundless Builders routes. */
export function buildPageMetadata({
  description,
  path,
  title,
}: PageMetadataOptions): Metadata {
  const pageTitle = title ?? 'Boundless Builders';

  return {
    ...(title ? { title } : {}),
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: path,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
    },
  };
}
