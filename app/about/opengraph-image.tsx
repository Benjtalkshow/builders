import { renderOgImage, size, contentType } from '@/lib/seo/og-template';

export { size, contentType };

export const alt = 'About — Boundless Builders';

export default function Image() {
  return renderOgImage({
    title: 'About',
    subtitle: 'Meet the people building the future of the Boundless ecosystem.',
  });
}
