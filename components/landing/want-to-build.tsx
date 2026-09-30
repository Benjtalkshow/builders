import { CtaBand } from '@/components/marketing/cta-band';
import { siteConfig } from '@/lib/seo/site';

export function WantToBuild() {
  return (
    <CtaBand
      heading='Want to be a builder?'
      description='Create your profile, join a team, and start shipping on Boundless. Your work belongs in the showcase.'
      action={{
        label: 'Get started on Boundless',
        href: siteConfig.parentUrl,
        external: true,
      }}
    />
  );
}
