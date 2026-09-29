import { ProjectsView } from '@/components/discover/projects-view';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata({
  title: 'Projects',
  description:
    'Explore the products being built across the Boundless ecosystem.',
  path: '/projects',
});

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <ProjectsView />
      <SiteFooter />
    </>
  );
}
