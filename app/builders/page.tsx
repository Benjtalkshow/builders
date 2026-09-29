import { Suspense } from 'react';

import {
  BuildersView,
  BuildersViewFallback,
} from '@/components/discover/builders-view';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata({
  title: 'Builders',
  description: 'Discover people building across the Boundless ecosystem.',
  path: '/builders',
});

export default function BuildersPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<BuildersViewFallback />}>
        <BuildersView />
      </Suspense>
      <SiteFooter />
    </>
  );
}
