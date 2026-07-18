import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS } from "@/lib/products";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description:
    "Search the Peptide Pen Research catalog by keyword. Matches against product name and categories. Optionally filter to only bestsellers or new arrivals.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Search term matched against name and categories"),
    tag: z.enum(["NEW", "BESTSELLER"]).optional().describe("Optional tag filter"),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 20)"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, tag, limit }) => {
    const q = query.toLowerCase();
    const max = limit ?? 20;
    const results = PRODUCTS.filter((p) => {
      if (tag && p.tag !== tag) return false;
      return (
        p.name.toLowerCase().includes(q) || p.categories.toLowerCase().includes(q)
      );
    }).slice(0, max);

    return {
      content: [
        {
          type: "text",
          text:
            results.length === 0
              ? `No products matched "${query}".`
              : JSON.stringify(results, null, 2),
        },
      ],
      structuredContent: { count: results.length, results },
    };
  },
});
