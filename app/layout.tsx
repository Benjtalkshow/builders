import './globals.css';

import type { Metadata } from 'next';
import { Bebas_Neue, Plus_Jakarta_Sans } from 'next/font/google';

import { siteConfig } from '@/lib/seo/site';
import { Providers } from '@/providers';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
});

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  // Throws on a malformed NEXT_PUBLIC_SITE_URL so a bad value fails the build
  // instead of silently resolving every canonical to localhost.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  keywords: [
    'Stellar',
    'builders',
    'web3 projects',
    'Boundless',
    'developers',
    'teams',
  ],
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${jakarta.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className='flex min-h-full flex-col'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
