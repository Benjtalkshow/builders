import { renderOgImage, size, contentType } from '@/lib/seo/og-template';

export { size, contentType };

export const alt = 'Builders — Boundless Builders';

export default function Image() {
  return renderOgImage({
    title: 'Builders',
    subtitle: 'Discover people building across the Boundless ecosystem.',
  });
}
