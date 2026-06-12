// Fetches all SupplifyMe product descriptions via their public Supabase REST API
// and emits a TS module of deepDive sections keyed by our 8-char product IDs.

const SUPA_URL = "https://ctprgnrlnkhcqtghgkem.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0cHJnbnJsbmtoY3F0Z2hna2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTMyMjgsImV4cCI6MjA2NTM4OTIyOH0.2mODe0oxSvUW9tJMkeT-g-eT2-k7IOqjl3DfOsmQxaY";

const MAP: Record<string, string> = {
  "72d3cbf2": "72d3cbf2-1800-455b-bd14-5e9d635250f3",
  "5696aeb5": "5696aeb5-1840-48ea-9946-8c0749c2ae81",
  "eaee73bb": "eaee73bb-5556-4e3c-93c7-44179d6dcbfd",
  "d2a5603b": "d2a5603b-f62f-472c-988c-f5f9acf85c0d",
  "75eaa7ac": "75eaa7ac-4eec-47cc-aea9-a97cc18e08c7",
  "db401164": "db401164-26d4-4613-9ef8-037b5cfaa285",
  "68831782": "68831782-ac4d-4019-bbd7-f454123d7499",
  "f5aa4333": "f5aa4333-a463-4d06-ab1d-2595de00799d",
  "591b5bd3": "591b5bd3-fb5b-4c0e-afa4-848d169c9b38",
  "c89a10d5": "c89a10d5-b6c0-492a-a309-b06deefb8db7",
  "e6a824f0": "e6a824f0-fda3-4850-aab7-58624c9e750a",
  "821f7789": "821f7789-18e2-4dd1-ae21-870ab3ffa0ac",
  "a973f518": "a973f518-d4cd-4254-8d99-1f9416e3f7c1",
  "f2a12dcf": "f2a12dcf-d241-41e0-927d-f7cefb7a87e0",
  "f76b7c74": "f76b7c74-6d98-43a4-9548-b75b2d23159b",
  "94badb0f": "94badb0f-3f54-4b2d-94ea-911118c790f3",
  "aff029b8": "aff029b8-2113-435f-ab58-149b9bd00ad8",
  "e794817e": "e794817e-6d81-4dd9-8554-6d6a1c358544",
  "08f6ee52": "08f6ee52-e4e4-4d47-aa84-b75c235bbbbc",
  "46f6d800": "46f6d800-1f40-4201-874e-3d7c1acb8518",
  "3afd37de": "3afd37de-3379-4719-87d0-6de973337432",
  "cd1d9cc4": "cd1d9cc4-d66c-48e4-8769-54d229359e06",
  "9a7347e7": "9a7347e7-50c5-44eb-83ff-098d79cd65c5",
  "eca4f03d": "eca4f03d-e1a2-42b0-8f47-922b431b0fae",
  "1691332d": "1691332d-297d-4cfb-8518-4fa143e00e69",
  "c777ccf6": "c777ccf6-8634-4220-b857-7b0e1111a3cd",
  "b8597fa0": "b8597fa0-adff-4518-8c60-e3cff6d5d080",
  "ad69b7ac": "ad69b7ac-20d5-48fc-991a-c4139e0d7e70",
  "7389ae0d": "7389ae0d-9709-4f3e-a77d-94842b3cc3d6",
  "474ae481": "474ae481-f33f-4add-a3a6-0444ba64c456",
  "322e88af": "322e88af-3021-4ba7-b4b3-0a335eb7b06a",
  "c1680f7a": "c1680f7a-7b4b-4368-89d2-99ceddd1186d",
  "65df5f32": "65df5f32-c149-4651-ac01-ab351299c354",
  "1b0959b6": "1b0959b6-6d20-441a-947d-540684490f18",
  "f386281f": "f386281f-bcd1-4ea5-a08e-fd04567ae74c",
  "080bb4c4": "080bb4c4-2fc8-44b5-ab91-586b6b5ebd07",
  "357579fd": "357579fd-343d-498e-bef2-75fd51c832cc",
  "6aa9fd75": "6aa9fd75-54dc-4b5d-ae1c-2f5727e6f291",
  "4a666b8b": "4a666b8b-1d4c-4dd2-bb4c-8047db40e45c",
  "6587dd72": "6587dd72-00a1-4ce8-9b75-c042eae21ca7",
  "04317a6e": "04317a6e-11bd-48d9-acf0-34afb102fd60",
  "21059df6": "21059df6-239d-4343-8a34-3c8723708b07",
};

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&rsquo;|&#8217;/g, "'")
    .replace(/&lsquo;|&#8216;/g, "'")
    .replace(/&rdquo;|&#8221;/g, '"')
    .replace(/&ldquo;|&#8220;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/[\u2019]/g, "'");
}

function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li)>/gi, "\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/<[^>]+>/g, "")
      .trim()
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
  );
}

interface Section { heading: string; body: string[] }

// Parse the HTML description. Headings are <p><strong>...</strong></p> or
// the first <strong>...</strong> at the start of a <p>; sections are
// delimited by <hr> or by the next heading.
function parseDescription(html: string): Section[] {
  if (!html) return [];
  // Normalize windows newlines
  html = html.replace(/\r/g, "");

  // Split by <hr> first — that's how SupplifyMe divides sections.
  const chunks = html.split(/<hr\s*\/?>/i).map((c) => c.trim()).filter(Boolean);
  const sections: Section[] = [];

  for (const chunk of chunks) {
    // Find leading bold/strong as the section heading. Pattern:
    //   <p><strong>HEADING</strong>... (rest of body)
    // or <p><strong>HEADING</strong></p><p>body</p>...
    const headingMatch = chunk.match(/^\s*<p[^>]*>\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*(?:<br\s*\/?>|<\/p>)?([\s\S]*)$/i);
    let heading = "";
    let rest = chunk;
    if (headingMatch) {
      heading = stripTags(headingMatch[1]).trim();
      rest = headingMatch[2] || "";
    }
    // Split paragraphs
    const paraHtmls = rest
      .split(/<\/p>/i)
      .map((p) => p.replace(/^.*?<p[^>]*>/i, "").trim())
      .filter(Boolean);
    const paras: string[] = [];
    for (const p of paraHtmls) {
      const text = stripTags(p);
      // Split on internal <br><br>-derived blank lines too
      const splits = text.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
      for (const s of splits) {
        // Bullet groups inside one paragraph become single combined string
        const cleaned = s.replace(/\s*\n\s*/g, " — ").replace(/\s+/g, " ").trim();
        if (cleaned.length > 1) paras.push(cleaned);
      }
    }
    // If no <p> wrapper, fall back to plain stripTags on rest
    if (paras.length === 0 && rest.trim()) {
      const fallback = stripTags(rest)
        .split(/\n{2,}/)
        .map((s) => s.replace(/\s+/g, " ").trim())
        .filter(Boolean);
      paras.push(...fallback);
    }

    if (!heading) {
      // Treat first paragraph as the heading if it's short & no period
      if (paras.length > 0 && paras[0].length < 90 && !/[.!?]$/.test(paras[0])) {
        heading = paras.shift()!;
      } else {
        heading = "Overview";
      }
    }
    // Drop the trailing disclaimer-only section if it's tiny boilerplate
    if (/^Disclaimer/i.test(heading)) continue;
    if (paras.length === 0) continue;
    sections.push({ heading, body: paras });
  }

  return sections;
}

async function main() {
  const ids = Object.keys(MAP);
  const uuids = Object.values(MAP);
  const url = `${SUPA_URL}/rest/v1/products?id=in.(${uuids.join(",")})&select=id,name,description`;
  const res = await fetch(url, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const rows: { id: string; name: string; description: string | null }[] = await res.json();
  const byUuid = new Map(rows.map((r) => [r.id, r]));

  const out: Record<string, Section[]> = {};
  const warn: string[] = [];

  for (const shortId of ids) {
    const row = byUuid.get(MAP[shortId]);
    if (!row) { warn.push(`${shortId}: missing row`); continue; }
    const sections = parseDescription(row.description ?? "");
    if (sections.length < 1) warn.push(`${shortId} (${row.name}): no sections`);
    out[shortId] = sections;
  }

  let buf = `// AUTO-GENERATED by scripts/scrape-deepdive.ts — do not edit by hand.\n`;
  buf += `import type { DeepDiveSection } from "@/lib/product-descriptions";\n\n`;
  buf += `export const DEEP_DIVES: Record<string, DeepDiveSection[]> = {\n`;
  for (const id of ids) {
    const sections = out[id] ?? [];
    if (!sections.length) {
      buf += `  // ${id}: empty\n`;
      continue;
    }
    buf += `  ${JSON.stringify(id)}: [\n`;
    for (const s of sections) {
      buf += `    { heading: ${JSON.stringify(s.heading)}, body: [\n`;
      for (const b of s.body) buf += `      ${JSON.stringify(b)},\n`;
      buf += `    ] },\n`;
    }
    buf += `  ],\n`;
  }
  buf += `};\n`;

  console.log(buf);
  if (warn.length) { console.error("\n// Warnings:"); warn.forEach((w) => console.error("// " + w)); }
}

main();
