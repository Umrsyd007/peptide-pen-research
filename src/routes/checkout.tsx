import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

// Checkout now happens in the cart's "Complete Your Order" window.
// This route only hosts /checkout/success/*; bare /checkout goes to the store.
export const Route = createFileRoute("/checkout")({
  beforeLoad: ({ location }) => {
    if (location.pathname.replace(/\/$/, "") === "/checkout") throw redirect({ to: "/products" });
  },
  component: Outlet,
});
