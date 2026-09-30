import type { JsonLdNode } from '@/lib/seo/schema';

/**
 * Renders a JSON-LD structured data block.
 *
 * The payload is serialized with JSON.stringify and every `<` is escaped to
 * `\u003c` so a value can never break out of the script tag.
 */
export function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
