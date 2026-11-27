import { createFileRoute } from "@tanstack/react-router";
import md5 from "js-md5";
import { getServerSupabaseClient } from "@/lib/supabase-server";

function timingSafeEqualHex(a: string, b: string): boolean {
  const left = a.trim().toLowerCase();
  const right = b.trim().toLowerCase();
  if (left.length === 0 || left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i++) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

export const Route = createFileRoute("/api/mounode-notify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const privateKey = process.env.MOUNODE_PRIVATE_KEY ?? "";
          if (!privateKey) {
            return new Response("Server Misconfigured", { status: 500 });
          }

          const url = new URL(request.url);
          const receivedVt = url.searchParams.get("vt") ?? "";

          const rawText = await request.text();
          const params = new URLSearchParams(rawText);
          const orderId = (params.get("order_id") ?? "").trim();
          const isSuccess = (params.get("is_success") ?? "").trim();

          if (!orderId) {
            return new Response("Missing order_id", { status: 400 });
          }

          const expectedVt = md5(`${orderId}${privateKey}`).toLowerCase();
          if (!timingSafeEqualHex(receivedVt, expectedVt)) {
            return new Response("Forbidden", { status: 403 });
          }

          if (isSuccess === "1") {
            const db = await getServerSupabaseClient();
            const { error } = await db
              .from("orders")
              .update({ status: "paid" })
              .eq("order_number", orderId)
              .eq("status", "pending");

            if (error) {
              return new Response("Database Error", { status: 500 });
            }
          }

          return new Response("200", {
            status: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        } catch {
          return new Response("Error", { status: 500 });
        }
      },
    },
  },
});