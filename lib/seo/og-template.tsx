import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Safe zone for the text overlay. The artwork in public/og/background.svg
 * keeps this region calm, and the text block is padded so the title and
 * subtitle always stay inside it.
 */
const SAFE_ZONE = {
  horizontalPadding: 120,
  maxWidth: 960,
} as const;

const fontsDir = join(process.cwd(), 'public', 'og', 'fonts');

// next/font does not apply inside ImageResponse, so the font files are read
// here once at module scope and handed to the renderer directly.
const bebasNeue = await readFile(join(fontsDir, 'bebas-neue.ttf'));
const plusJakartaSans400 = await readFile(
  join(fontsDir, 'plus-jakarta-sans-400.ttf')
);
const plusJakartaSans500 = await readFile(
  join(fontsDir, 'plus-jakarta-sans-500.ttf')
);
const background = await readFile(
  join(process.cwd(), 'public', 'og', 'background.svg'),
  'base64'
);

function toArrayBuffer(data: Buffer): ArrayBuffer {
  return data.buffer.slice(
    data.byteOffset,
    data.byteOffset + data.byteLength
  ) as ArrayBuffer;
}

/**
 * Renders the shared Open Graph card: the text-free background artwork with
 * the page title in Bebas Neue and the subtitle in Plus Jakarta Sans.
 */
export function renderOgImage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders Satori JSX, where <img> is the only way to embed the background artwork */}
        <img
          alt=''
          src={`data:image/svg+xml;base64,${background}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: SAFE_ZONE.maxWidth,
            paddingLeft: SAFE_ZONE.horizontalPadding,
            paddingRight: SAFE_ZONE.horizontalPadding,
          }}
        >
          <div
            style={{
              fontFamily: '"Bebas Neue"',
              fontSize: 116,
              lineHeight: 1,
              letterSpacing: '0.01em',
              color: '#f1fff1',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: '"Plus Jakarta Sans"',
              fontWeight: 500,
              fontSize: 34,
              lineHeight: 1.3,
              color: '#9fb3af',
              marginTop: 24,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Bebas Neue',
          data: toArrayBuffer(bebasNeue),
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Plus Jakarta Sans',
          data: toArrayBuffer(plusJakartaSans400),
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Plus Jakarta Sans',
          data: toArrayBuffer(plusJakartaSans500),
          style: 'normal',
          weight: 500,
        },
      ],
    }
  );
}
