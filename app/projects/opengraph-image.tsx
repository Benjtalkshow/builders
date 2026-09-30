import { renderOgImage, size, contentType } from '@/lib/seo/og-template';

export { size, contentType };

export const alt = 'Projects — Boundless Builders';

export default function Image() {
  return renderOgImage({
    title: 'Projects',
    subtitle: 'Explore the products being built across the Boundless ecosystem.',
  });
}
