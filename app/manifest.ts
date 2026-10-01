import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/seo/site';

export const dynamic = 'force-static';

// Design-system dark background: `--background` under `.dark` in app/globals.css.
const BACKGROUND = '#0d1111';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'Builders',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: BACKGROUND,
    theme_color: BACKGROUND,
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/icon.png', type: 'image/png', sizes: '512x512', purpose: 'any' },
      {
        src: '/apple-icon.png',
        type: 'image/png',
        sizes: '180x180',
        purpose: 'any',
      },
    ],
  };
}
