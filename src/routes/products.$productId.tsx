import { createFileRoute, notFound, redirect, useLocation } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { getInjectorProduct } from "@/lib/injector";
import { InjectorPage } from "@/components/injector-page";
import { PEPTICOOL_IMAGE, PepticoolPage } from "@/components/pepticool-page";
import { OG_IMAGE as INJECTOR_OG_IMAGE } from "@/components/injector-media";

const PEPTICOOL_ID = "1b0959b6";

// Pre-selected option is passed in navigation state (not the URL) so product
// URLs stay clean, e.g. /products/08f6ee52 rather than ?option=single.
declare module "@tanstack/react-router" {
  interface HistoryState {
    option?: string;
  }
}

export const Route = createFileRoute("/products/$productId")({
  beforeLoad: ({ search, params }) => {
    // Old links carried ?option=…; send them to the clean URL. Other params
    // (e.g. gclid/utm_*) are kept so ad attribution isn't lost.
    const s = search as Record<string, unknown>;
    if ("option" in s) {
      const { option: _drop, ...rest } = s;
      throw redirect({
        to: "/products/$productId",
        params,
        search: rest as never,
        statusCode: 301,
        replace: true,
      });
    }
  },
  loader: ({ params }) => {
    const product = getInjectorProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ params, loaderData }) => {
    const product = loaderData?.product;
    const title = product?.title ?? "Needle-Free Injector | PeptidePen";
    const description =
      product?.description ??
      "A reusable needle-free injector. Free UK delivery in 3–7 days.";
    const url = `https://getpeptidepen.com/products/${params.productId}`;
    const isPepticool = params.productId === PEPTICOOL_ID;
    const image = isPepticool ? PEPTICOOL_IMAGE : INJECTOR_OG_IMAGE;
    // Structured data so search engines can show price and availability.
    const prices = product?.variants.map((v) => v.price) ?? [];
    const offers =
      prices.length > 1
        ? { "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: Math.min(...prices).toFixed(2), highPrice: Math.max(...prices).toFixed(2), offerCount: prices.length, availability: "https://schema.org/InStock", url }
        : { "@type": "Offer", priceCurrency: "USD", price: (prices[0] ?? 0).toFixed(2), availability: "https://schema.org/InStock", url };
    const jsonLd = product && {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description,
      image: [image],
      sku: product.id,
      url,
      brand: { "@type": "Brand", name: "PeptidePen" },
      offers,
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        ...(isPepticool ? [] : [{ property: "og:image:width", content: "1200" }, { property: "og:image:height", content: "630" }]),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: image },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" },
      ],
      scripts: jsonLd ? [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }] : [],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const option = useLocation({ select: (l) => l.state.option });
  return (
    <SiteShell>
      {product.id === PEPTICOOL_ID ? (
        <PepticoolPage product={product} />
      ) : (
        <InjectorPage product={product} option={option} />
      )}
    </SiteShell>
  );
}
