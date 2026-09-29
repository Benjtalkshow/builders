import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BREAKPOINT = '#8B2E2E'\nconst BACKGROUND = '#0A0A0A'\n\nexport default function manifest(): MetadataRoute {\n  return {\n    name: 'Boundless',\n    short_name: 'Builders',\n    description: 'Boundless is a marketplace for open-source builders to fund, ship, and own their work.',\n    start_url: '/',\n    display: 'standalone',\n    background_color: BACKGROUND,\n    theme_color: BACKGROUND,\n    icons: [\n      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },\n      { src: '/icon.png', type: 'image/png', sizes: '512x512' },\n      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180', purpose: 'any' },\n    ],\n  }\n}
