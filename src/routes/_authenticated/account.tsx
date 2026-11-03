import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { getOrderManagementAccess } from "@/lib/order-management.functions";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account | Peptide Pen Research" },
      { name: "description", content: "Manage your Peptide Pen Research account and assistant connections." },
      { property: "og:title", content: "My Account | Peptide Pen Research" },
      { property: "og:description", content: "Manage your Peptide Pen Research account and assistant connections." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [canManageOrders, setCanManageOrders] = useState(false);
  const checkOrderAccess = useServerFn(getOrderManagementAccess);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    checkOrderAccess().then(({ allowed }) => setCanManageOrders(allowed)).catch(() => {});
  }, [checkOrderAccess]);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/", replace: true });
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to store
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">My Account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Signed in as {email ?? "…"}</p>
      {canManageOrders && <Button asChild className="mt-6"><Link to="/orders">Manage orders</Link></Button>}
      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-medium">AI Assistant integrations</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect this store to ChatGPT, Claude, or any MCP-compatible AI client. When you approve
          the connection, the assistant can browse the catalog and send product questions on your
          behalf.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          MCP endpoint: <code className="rounded bg-muted px-1.5 py-0.5">/mcp</code>
        </p>
      </div>
      <div className="mt-6">
        <Button variant="outline" onClick={handleSignOut} disabled={signingOut}>
          Sign out
        </Button>
      </div>
    </main>
  );
}
