import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS, getProduct } from "@/lib/products";

export default defineTool({
  name: "get_product",
  title: "Get product details",
  description:
    "Return full details for a single product from the Peptide Pen Research catalog. Accepts either the product id (preferred, from list_products) or a case-insensitive product name.",
  inputSchema: {
    id: z.string().optional().describe("Product id, e.g. '08f6ee52'"),
    name: z.string().optional().describe("Product name (case-insensitive exact or partial match)"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id, name }) => {
    if (!id && !name) {
      return {
        content: [{ type: "text", text: "Provide either `id` or `name`." }],
        isError: true,
      };
    }
    let product = id ? getProduct(id) : undefined;
    if (!product && name) {
      const q = name.toLowerCase().trim();
      product =
        PRODUCTS.find((p) => p.name.toLowerCase() === q) ??
        PRODUCTS.find((p) => p.name.toLowerCase().includes(q));
    }
    if (!product) {
      return {
        content: [{ type: "text", text: `No product found for ${id ?? name}.` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
      structuredContent: { product },
    };
  },
});
