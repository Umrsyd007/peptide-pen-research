import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";
import searchProductsTool from "./tools/search-products";
import submitQuestionTool from "./tools/submit-question";

// OAuth issuer MUST be the direct supabase.co host (not the .lovable.cloud proxy).
// Read from VITE_SUPABASE_PROJECT_ID (inlined at build time). The fallback keeps the
// issuer well-formed during the manifest-extract eval; the published build inlines
// the real ref and no token verifies against the sentinel.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "peptide-pen-research-mcp",
  title: "PeptidePen",
  version: "0.1.0",
  instructions:
    "Tools for the PeptidePen catalog. Use `list_products` to browse the catalog, `search_products` to filter by keyword or category, `get_product` for full product details, and `submit_product_question` to send an inquiry to the store team.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProductsTool, searchProductsTool, getProductTool, submitQuestionTool],
});
