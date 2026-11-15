import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { trackPageView } from "@/lib/analytics";
import { TrackingConsent } from "@/components/tracking-consent";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#ffffff" },
      { name: "google-site-verification", content: "BGlNCM2smi9KPj6lNmsdBNoO-EggAAt2lTmuIQ1iXqA" },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "Peptide Pen Research" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Peptide Pen Research | Research-Grade Peptide Pens" },
      { property: "og:title", content: "Peptide Pen Research | Research-Grade Peptide Pens" },
      { name: "twitter:title", content: "Peptide Pen Research | Research-Grade Peptide Pens" },
      { name: "description", content: "Pre-mixed, lab-tested research peptide pens with full COA documentation, cold-chain shipping and dosing references. For in-vitro laboratory use only." },
      { property: "og:description", content: "Pre-mixed, lab-tested research peptide pens with full COA documentation, cold-chain shipping and dosing references. For in-vitro laboratory use only." },
      { name: "twitter:description", content: "Pre-mixed, lab-tested research peptide pens with full COA documentation, cold-chain shipping and dosing references. For in-vitro laboratory use only." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
    scripts: [
      {
        children: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "z75f9lqmwe");`,
      },
      {
        children: `window.ParleySettings = { siteKey: "pk_a2_dm0RqD16PvS1aS-fbufoF" }; window.Parley = window.Parley || function () { (window.Parley.q = window.Parley.q || []).push(arguments); }; (function (d, s) { s = d.createElement("script"); s.async = true; s.src = "https://chatwithparley.com/widget.js"; d.head.appendChild(s); })(document);`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Peptide Pen Research",
          url: "https://getpeptidepen.com",
          description:
            "Research-grade peptide pens supplied for laboratory research use only.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Peptide Pen Research",
          url: "https://getpeptidepen.com",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  // Fire page_view on every SPA navigation
  useEffect(() => {
    const unsub = router.subscribe("onResolved", ({ toLocation }) => {
      trackPageView({ path: toLocation.pathname + toLocation.searchStr });
    });
    return unsub;
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <TrackingConsent />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
