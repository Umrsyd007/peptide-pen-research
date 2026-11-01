import { getDefaultVariant, getVariants } from "./product-variants";
import { PRODUCT_IMAGE_COVERS } from "./product-image-data";

export interface ProductImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface ImageProduct {
  id: string;
  name: string;
  image: string;
}

const IMAGE_ROOT = "/images/peptidepen-v2";
const PEN_PRODUCT_IDS = new Set(PRODUCT_IMAGE_COVERS.map((cover) => cover.productId));

export const SHARED_PEN_IMAGES: readonly ProductImage[] = [
  {
    src: `${IMAGE_ROOT}/shared/02-case-angle.png`,
    alt: "Black PeptidePen with teal logo in its open case, angled view",
    width: 1444,
    height: 1089,
  },
  {
    src: `${IMAGE_ROOT}/shared/03-case-overhead.png`,
    alt: "Black PeptidePen kit in its open case, overhead view",
    width: 1448,
    height: 1086,
  },
  {
    src: `${IMAGE_ROOT}/shared/04-case-closeup.png`,
    alt: "Close-up of the black PeptidePen and teal logo in its case",
    width: 1448,
    height: 1086,
  },
];

/** A missing artwork match must never imply a different strength. */
export function getProductCover(product: ImageProduct, sku?: string): ProductImage {
  if (!PEN_PRODUCT_IDS.has(product.id)) {
    return { src: product.image, alt: product.name };
  }

  const selectedSku = sku ?? getDefaultVariant(product.id)?.sku;
  const variant = getVariants(product.id).find((candidate) => candidate.sku === selectedSku);
  const cover = PRODUCT_IMAGE_COVERS.find(
    (candidate) =>
      candidate.productId === product.id &&
      candidate.sku === selectedSku &&
      candidate.variantName === variant?.name,
  );

  return {
    src: cover ? `${IMAGE_ROOT}/covers/${cover.filename}` : `${IMAGE_ROOT}/master-pen.png`,
    alt: cover?.alt ?? "Black PeptidePen with teal logo; no variant strength shown",
    width: 1254,
    height: 1254,
  };
}

export function getProductGallery(product: ImageProduct, sku?: string): ProductImage[] {
  const cover = getProductCover(product, sku);
  return PEN_PRODUCT_IDS.has(product.id) ? [cover, ...SHARED_PEN_IMAGES] : [cover];
}

/** Refresh thumbnails for existing carts without rewriting stored IDs or prices. */
export function getCartItemImage(item: {
  productId: string;
  variantId: string;
  variantTitle?: string;
  title: string;
  image: string | null;
}): ProductImage {
  const prefix = `${item.productId}:`;
  const sku = item.variantId.startsWith(prefix) ? item.variantId.slice(prefix.length) : "";
  const product = { id: item.productId, name: item.title, image: item.image ?? "" };
  const currentVariant = getVariants(item.productId).find((variant) => variant.sku === sku);
  if (item.variantTitle && item.variantTitle !== currentVariant?.name) {
    return getProductCover(product, "");
  }
  return getProductCover(product, sku);
}

export function absoluteProductImageUrl(src: string): string {
  return new URL(src, "https://getpeptidepen.com").href;
}
