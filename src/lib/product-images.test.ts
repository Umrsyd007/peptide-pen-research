import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PRODUCTS, getProduct } from "./products";
import { getDefaultVariant, getVariants } from "./product-variants";
import { PRODUCT_IMAGE_COVERS } from "./product-image-data";
import {
  absoluteProductImageUrl,
  getCartItemImage,
  getProductCover,
  getProductGallery,
} from "./product-images";

describe("product artwork", () => {
  it("covers every variant of the 33 pen products and keeps the nasal spray separate", () => {
    const pens = PRODUCTS.filter((product) => product.id !== "d2a5603b");
    expect(pens).toHaveLength(33);
    expect(PRODUCT_IMAGE_COVERS).toHaveLength(37);
    for (const product of pens) {
      for (const variant of getVariants(product.id)) {
        const matches = PRODUCT_IMAGE_COVERS.filter(
          (cover) => cover.productId === product.id && cover.sku === variant.sku,
        );
        expect(matches).toHaveLength(1);
        expect(matches[0].variantName).toBe(variant.name);
        expect(getProductCover(product, variant.sku).src.endsWith(matches[0].filename)).toBe(true);
      }
      expect(product.image).toBe(getProductCover(product, getDefaultVariant(product.id)?.sku).src);
    }
    expect(new Set(PRODUCT_IMAGE_COVERS.map((cover) => cover.filename)).size).toBe(37);
  });

  it("uses 20 mg and 60 mg artwork for Retatrutide despite legacy SKU numbers", () => {
    const product = getProduct("08f6ee52")!;
    expect(getProductCover(product, "retatrutide-6mg").alt).toContain("20 mg");
    expect(getProductCover(product, "retatrutide-12").alt).toContain("60 mg");
    expect(getProductCover(product).src.endsWith("08f6ee52-20mg.webp")).toBe(true);
  });

  it("provides distinct covers for every Tirzepatide and NAD+ size", () => {
    for (const id of ["1b0959b6", "080bb4c4"]) {
      const product = getProduct(id)!;
      const covers = getVariants(id).map((variant) => getProductCover(product, variant.sku).src);
      expect(new Set(covers).size).toBe(getVariants(id).length);
    }
  });

  it("keeps the three shared original photos in positions two, three and four", () => {
    const expected = Object.keys({
      "/images/peptidepen-v2/shared/02-case-angle.png":
        "0b04761c46b58561c4e139cc986860f0db7193d3017cba78e3a42c68c5fbb6f4",
      "/images/peptidepen-v2/shared/03-case-overhead.png":
        "b412c6830535ef87c5d2123f0f3927077ab76880f6ca82b1711f09597e5804e3",
      "/images/peptidepen-v2/shared/04-case-closeup.png":
        "807b15266ba15d167b9a5e435dcc2da3c81cb4ededd47f1d69ddc605f17929f3",
    });
    for (const product of PRODUCTS.filter((product) => product.id !== "d2a5603b")) {
      for (const variant of getVariants(product.id)) {
        const gallery = getProductGallery(product, variant.sku);
        expect(gallery).toHaveLength(4);
        expect(gallery.slice(1).map((image) => image.src)).toEqual(expected);
        expect(new Set(gallery.map((image) => image.src)).size).toBe(4);
      }
    }
  });

  it("preserves the original case photo bytes", () => {
    const hashes = {
      "/images/peptidepen-v2/shared/02-case-angle.png":
        "0b04761c46b58561c4e139cc986860f0db7193d3017cba78e3a42c68c5fbb6f4",
      "/images/peptidepen-v2/shared/03-case-overhead.png":
        "b412c6830535ef87c5d2123f0f3927077ab76880f6ca82b1711f09597e5804e3",
      "/images/peptidepen-v2/shared/04-case-closeup.png":
        "807b15266ba15d167b9a5e435dcc2da3c81cb4ededd47f1d69ddc605f17929f3",
    };
    for (const [src, hash] of Object.entries(hashes)) {
      const bytes = readFileSync(resolve(process.cwd(), "public", src.slice(1)));
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(hash);
    }
  });

  it("ships a nonempty asset for all covers and the unlabelled fallback", () => {
    for (const cover of PRODUCT_IMAGE_COVERS) {
      const bytes = readFileSync(
        resolve(process.cwd(), "public/images/peptidepen-v2/covers", cover.filename),
      );
      expect(bytes.length).toBeGreaterThan(1000);
      expect(bytes.subarray(0, 4).toString()).toBe("RIFF");
      expect(bytes.subarray(8, 12).toString()).toBe("WEBP");
    }
    const generic = getProductCover(getProduct("08f6ee52")!, "future-size");
    expect(generic.src.endsWith("/master-pen.png")).toBe(true);
    expect(
      readFileSync(resolve(process.cwd(), "public", generic.src.slice(1))).length,
    ).toBeGreaterThan(1000);
  });

  it("retains the nasal spray photo without fabricated duplicate thumbnails", () => {
    const product = getProduct("d2a5603b")!;
    expect(product.image).toBe(
      "/__l5e/assets-v1/b815d774-9df8-4296-9363-f568c59bc388/d2a5603b.png",
    );
    expect(getProductGallery(product)).toEqual([{ src: product.image, alt: product.name }]);
  });

  it("resolves a saved cart's selected size without changing its IDs, title or price", () => {
    const item = {
      productId: "08f6ee52",
      variantId: "08f6ee52:retatrutide-12",
      variantTitle: "60mg",
      title: "Retatrutide",
      image: "/old-green-pen.png",
      quantity: 2,
      price: { amount: "208.58", currencyCode: "USD" },
    };
    const original = structuredClone(item);
    expect(getCartItemImage(item).src.endsWith("08f6ee52-60mg.webp")).toBe(true);
    expect(item).toEqual(original);
    expect(
      getCartItemImage({ ...item, variantTitle: "12mg" }).src.endsWith("/master-pen.png"),
    ).toBe(true);
    expect(
      getCartItemImage({ ...item, variantId: "obsolete-format" }).src.endsWith("/master-pen.png"),
    ).toBe(true);
  });

  it("preserves the leading space in the catalog's SLU SKU", () => {
    const product = getProduct("a973f518")!;
    const sku = getDefaultVariant(product.id)!.sku;
    expect(sku.startsWith(" ")).toBe(true);
    expect(getProductCover(product, sku).src.endsWith("/master-pen.png")).toBe(false);
  });

  it("uses unlabelled artwork if a catalog strength changes before its cover is replaced", () => {
    const product = getProduct("08f6ee52")!;
    const variant = getVariants(product.id)[0];
    const originalName = variant.name;
    try {
      variant.name = "unreviewed-size";
      expect(getProductCover(product, variant.sku).src.endsWith("/master-pen.png")).toBe(true);
    } finally {
      variant.name = originalName;
    }
  });

  it("provides absolute public image URLs for product metadata", () => {
    const src = getProductCover(getProduct("08f6ee52")!).src;
    expect(absoluteProductImageUrl(src)).toBe("https://getpeptidepen.com" + src);
  });
});
