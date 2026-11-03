import { createFileRoute, notFound, redirect, useLocation } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { getInjectorProduct } from "@/lib/injector";
import { InjectorPage } from "@/components/injector-page";
import { PEPTICOOL_IMAGE, PepticoolPage } from "@/components/pepticool-page";

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
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(isPepticool ? [{ property: "og:image", content: PEPTICOOL_IMAGE }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" },
      ],
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
