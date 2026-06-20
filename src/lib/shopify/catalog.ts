// Fetches the full Shopify catalog and exposes a SKU -> variant map so
// the locally-curated product files (products.ts, product-variants.ts) can
// be enriched with live price, availability and checkout-ready variantId.
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest } from "./client";
import { PRODUCT_VARIANTS } from "@/lib/product-variants";


export interface ShopifyVariant {
  id: string; // gid://shopify/ProductVariant/...
  sku: string | null;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
  productHandle: string;
  productTitle: string;
  productImage: string | null;
}

const PRODUCTS_QUERY = `
  query StorefrontProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          handle
          title
          featuredImage { url }
          variants(first: 25) {
            edges {
              node {
                id
                sku
                title
                availableForSale
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;

async function fetchAllVariants(): Promise<Map<string, ShopifyVariant>> {
  const map = new Map<string, ShopifyVariant>();
  let after: string | null = null;
  // Cap at a few pages so this can never spin forever.
  for (let i = 0; i < 10; i++) {
    const res: any = await storefrontApiRequest(PRODUCTS_QUERY, {
      first: 100,
      after,
    });
    const conn = res?.data?.products;
    if (!conn) break;
    for (const pe of conn.edges) {
      const p = pe.node;
      for (const ve of p.variants.edges) {
        const v = ve.node;
        if (!v.sku) continue;
        map.set(v.sku.trim(), {
          id: v.id,
          sku: v.sku,
          title: v.title,
          availableForSale: v.availableForSale,
          price: v.price,
          compareAtPrice: v.compareAtPrice ?? null,
          productHandle: p.handle,
          productTitle: p.title,
          productImage: p.featuredImage?.url ?? null,
        });
      }
    }
    if (!conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }
  return map;
}

export function useShopifyCatalog() {
  return useQuery({
    queryKey: ["shopify", "catalog"],
    queryFn: fetchAllVariants,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
}

/**
 * Returns the set of local product IDs that still have at least one variant
 * (matched by SKU) live in Shopify. While the catalog is loading we return
 * `null` so callers can avoid flashing an empty grid. If the request errored
 * we also return `null` and fall back to showing everything — better to show
 * stale entries than a broken store.
 */
export function useAvailableProductIds(): Set<string> | null {
  const { data, isLoading, isError } = useShopifyCatalog();
  return useMemo(() => {
    if (isLoading || isError || !data) return null;
    const ids = new Set<string>();
    for (const [productId, variants] of Object.entries(PRODUCT_VARIANTS)) {
      if (variants.some((v) => v.sku && data.has(v.sku.trim()))) {
        ids.add(productId);
      }
    }
    return ids;
  }, [data, isLoading, isError]);
}

export function formatMoney(amount: string | number, currencyCode = "USD") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!Number.isFinite(n)) return "";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}
