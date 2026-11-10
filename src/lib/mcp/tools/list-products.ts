import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS } from "@/lib/products";

export default defineTool({
  name: "list_products",
  title: "List products",
  description:
    "Return every product in the PeptidePen catalog with id, name, categories, price, and tag. Use this to give the user an overview of what's available.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const rows = PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      categories: p.categories,
      price: p.price,
      tag: p.tag,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, products: rows },
    };
  },
});
