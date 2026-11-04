import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getProduct } from "@/lib/products";

export default defineTool({
  name: "submit_product_question",
  title: "Submit product question",
  description:
    "Send a product inquiry to the Peptide Pen Research team on behalf of the signed-in user. The store will follow up by email.",
  inputSchema: {
    productId: z.string().optional().describe("Product id from list_products/get_product"),
    message: z
      .string()
      .trim()
      .min(1)
      .max(2000)
      .describe("The question or inquiry to send to the store team"),
    name: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .describe("Sender display name; falls back to the signed-in user's email"),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ productId, message, name }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text", text: "Not authenticated." }],
        isError: true,
      };
    }
    const email = ctx.getUserEmail();
    if (!email) {
      return {
        content: [{ type: "text", text: "No email on the signed-in user; cannot submit." }],
        isError: true,
      };
    }
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const product = productId ? getProduct(productId) : undefined;
    const { data, error } = await supabase
      .from("product_questions")
      .insert({
        product_id: productId ?? null,
        product_name: product?.name ?? null,
        name: name ?? email,
        email,
        message,
      })
      .select("id")
      .single();
    if (error || !data) {
      return {
        content: [{ type: "text", text: `Failed to submit question: ${error?.message ?? "unknown"}` }],
        isError: true,
      };
    }
    try {
      const { notifyProductQuestion } = await import('@/lib/email/product-question.server');
      await notifyProductQuestion(supabase, {
        id: data.id, productId, productName: product?.name,
        name: name ?? email, email, message,
      });
    } catch {
      console.error('Saved MCP inquiry notification could not be queued');
    }
    return {
      content: [
        {
          type: "text",
          text: `Question submitted. The Peptide Pen Research team will reply to ${email}.`,
        },
      ],
      structuredContent: { id: data.id, email },
    };
  },
});
