import { createFileRoute, redirect } from "@tanstack/react-router";

// Checkout now happens in the cart's "Complete Your Order" window.
export const Route = createFileRoute("/checkout")({
  beforeLoad: () => {
    throw redirect({ to: "/products" });
  },
});
