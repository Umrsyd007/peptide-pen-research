// Scrapes SupplifyMe product pages and emits TypeScript with deepDive entries
// for each product, keyed by our 8-char product IDs.
//
// Run: bun run scripts/scrape-deepdive.ts > /tmp/deepdive-output.ts

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

// Decode HTML entities + strip tags into plain text
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"');
}

interface Section { heading: string; body: string[] }

function parseDescription(html: string): Section[] {
  // Convert to text first, then parse markdown-ish structure
  const text = htmlToText(html)
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Find the description block: starts at first "What is" / strong heading
  // and ends at "Disclaimer" section end or "Show less".
  // We rely on the page text containing repeated "* * *" separators.
  const startIdx = text.search(/\bWhat is [^\n?]+\?/);
  if (startIdx < 0) return [];
  const tail = text.slice(startIdx);

  // Split by horizontal rule (rendered as "* * *" in markdown, "---" or
  // long underscore lines in HTML-to-text). After tags are stripped we
  // mostly see double-newlines between sections. Use the "Show less"
  // sentinel as the hard end.
  const endIdx = tail.search(/\b(Show less|Frequently Asked Questions|Customer Reviews)\b/);
  const body = (endIdx > 0 ? tail.slice(0, endIdx) : tail).trim();

  // Heuristic: section heading is a short line ending with ? or one of
  // a curated set of titles (no trailing period, < 80 chars, followed by
  // a blank line, and itself surrounded by blank lines).
  const lines = body.split("\n");
  const sections: Section[] = [];
  let current: Section | null = null;
  let buffer: string[] = [];

  const flushPara = () => {
    if (!current) return;
    const para = buffer.join(" ").replace(/\s+/g, " ").trim();
    if (para) current.body.push(para);
    buffer = [];
  };
  const flushSection = () => {
    flushPara();
    if (current && current.body.length) sections.push(current);
    current = null;
  };

  const isHeading = (line: string): boolean => {
    const t = line.trim();
    if (!t || t.length > 110) return false;
    if (/^[•\-]/.test(t)) return false;
    if (/[.;,]$/.test(t)) return false;
    // Single sentence-style headings (Title Case-ish or ends with ?)
    if (t.endsWith("?")) return true;
    // Bold-ish heading patterns we know from SupplifyMe
    if (/^(What is|How does|Research on|Clinical Trials|How [A-Z].* works|Phase \d|Benefits|Possible Side Effects|Pre-Mixed|Disclaimer|Mechanism|Storage|Shipping|Development Background|Molecular|Safety|Quality|Side Effects|Background|Overview|Dosage|Stacking)/i.test(t)) {
      return true;
    }
    // " vs. " pattern → comparison heading
    if (/\bvs\.?\s+/i.test(t) && t.split(" ").length < 10) return true;
    // Short Title-Case heading: at least 2 capitalised words, no period
    const words = t.split(/\s+/);
    if (words.length >= 2 && words.length <= 10) {
      const caps = words.filter((w) => /^[A-Z]/.test(w)).length;
      if (caps / words.length >= 0.6) return true;
    }
    return false;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) {
      flushPara();
      continue;
    }
    // Horizontal rule of asterisks / dashes / underscores
    if (/^[*_\-\s]{3,}$/.test(line)) {
      flushPara();
      continue;
    }
    // Bullet
    if (/^•/.test(line) || /^[●▪]/.test(line)) {
      flushPara();
      const bullet = line.replace(/^[●▪]/, "•").replace(/\s+/g, " ").trim();
      if (current) current.body.push(bullet);
      continue;
    }
    // Heading?
    if (isHeading(line)) {
      // Heading must be followed by blank line then content (avoid
      // grabbing the middle of a paragraph). Peek at the next non-empty
      // line: if it looks like prose continuing the line, treat it as
      // paragraph instead.
      const prevBlank = i === 0 || lines[i - 1].trim() === "";
      if (prevBlank) {
        flushSection();
        current = { heading: line.replace(/\?+$/, "?"), body: [] };
        continue;
      }
    }
    if (!current) {
      current = { heading: "Overview", body: [] };
    }
    buffer.push(line);
  }
  flushSection();

  // Drop sections that are obviously not real research content
  return sections.filter((s) => {
    const txt = s.body.join(" ");
    return txt.length > 40 && !/^Add to Cart|^Watch How|^Show less|^Subscribe/.test(s.heading);
  });
}

async function fetchProduct(uuid: string): Promise<string> {
  const url = `https://supplifyme.com/products/${uuid}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PeptidePenBot/1.0)" },
  });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return await res.text();
}

function tsString(s: string): string {
  return JSON.stringify(s);
}

async function main() {
  const ids = Object.keys(MAP);
  const out: Record<string, Section[]> = {};
  const errors: string[] = [];

  await Promise.all(
    ids.map(async (id) => {
      try {
        const html = await fetchProduct(MAP[id]);
        const sections = parseDescription(html);
        if (sections.length < 2) {
          errors.push(`${id}: only ${sections.length} sections parsed`);
        }
        out[id] = sections;
      } catch (e) {
        errors.push(`${id}: ${(e as Error).message}`);
        out[id] = [];
      }
    }),
  );

  // Emit a TS module
  let buf = `// AUTO-GENERATED by scripts/scrape-deepdive.ts — do not edit by hand.\n`;
  buf += `import type { DeepDiveSection } from "@/lib/product-descriptions";\n\n`;
  buf += `export const DEEP_DIVES: Record<string, DeepDiveSection[]> = {\n`;
  for (const id of ids) {
    const sections = out[id] ?? [];
    if (!sections.length) {
      buf += `  // ${id}: no sections parsed\n`;
      continue;
    }
    buf += `  ${tsString(id)}: [\n`;
    for (const s of sections) {
      const bodyArr = s.body.map((b) => `      ${tsString(b)},`).join("\n");
      buf += `    { heading: ${tsString(s.heading)}, body: [\n${bodyArr}\n    ] },\n`;
    }
    buf += `  ],\n`;
  }
  buf += `};\n`;

  console.log(buf);
  if (errors.length) {
    console.error("\n// Parse warnings:");
    for (const e of errors) console.error("// " + e);
  }
}

main();
