/**
 * Renders a JSON-LD structured-data block. Server-safe; the object is
 * serialized once at render. Keep payloads free of user input — this uses
 * dangerouslySetInnerHTML by necessity (the schema.org convention).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
