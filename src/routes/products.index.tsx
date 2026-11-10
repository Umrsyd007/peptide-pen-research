import { createFileRoute, redirect } from "@tanstack/react-router";
import { PRODUCT_ID } from "@/lib/injector";

export const Route = createFileRoute("/products/")({
  beforeLoad: () => {
    throw redirect({ to: "/products/$productId", params: { productId: PRODUCT_ID }, statusCode: 301 });
  },
});
