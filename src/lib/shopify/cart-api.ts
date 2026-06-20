// Storefront API cart mutations. Used by the Zustand cart store.
import { formatCheckoutUrl, storefrontApiRequest } from "./client";

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) {
      id
      totalQuantity
      checkoutUrl
      lines(first: 100) {
        edges { node { id quantity merchandise { ... on ProductVariant { id } } } }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges { node { id merchandise { ... on ProductVariant { id } } } }
        }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges { node { id merchandise { ... on ProductVariant { id } } } }
        }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

type UserError = { field: string[] | null; message: string };

function isCartNotFoundError(errors: UserError[]): boolean {
  return errors.some(
    (e) =>
      e.message.toLowerCase().includes("cart not found") ||
      e.message.toLowerCase().includes("does not exist"),
  );
}

export async function createShopifyCart(input: {
  variantId: string;
  quantity: number;
}): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: {
      lines: [{ quantity: input.quantity, merchandiseId: input.variantId }],
    },
  });
  const payload = (data as any)?.data?.cartCreate;
  if (!payload) return null;
  if (payload.userErrors?.length) {
    console.error("Cart create failed", payload.userErrors);
    return null;
  }
  const cart = payload.cart;
  if (!cart?.checkoutUrl) return null;
  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;
  return {
    cartId: cart.id,
    checkoutUrl: formatCheckoutUrl(cart.checkoutUrl),
    lineId,
  };
}

export async function addLineToShopifyCart(
  cartId: string,
  input: { variantId: string; quantity: number },
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: input.quantity, merchandiseId: input.variantId }],
  });
  const payload = (data as any)?.data?.cartLinesAdd;
  if (!payload) return { success: false };
  const errors: UserError[] = payload.userErrors ?? [];
  if (isCartNotFoundError(errors)) return { success: false, cartNotFound: true };
  if (errors.length) {
    console.error("Cart add line failed", errors);
    return { success: false };
  }
  const lines = payload.cart?.lines?.edges ?? [];
  const line = lines.find(
    (l: { node: { merchandise: { id: string } } }) =>
      l.node.merchandise.id === input.variantId,
  );
  return { success: true, lineId: line?.node?.id };
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  const errors: UserError[] =
    (data as any)?.data?.cartLinesUpdate?.userErrors ?? [];
  if (isCartNotFoundError(errors)) return { success: false, cartNotFound: true };
  if (errors.length) {
    console.error("Cart update line failed", errors);
    return { success: false };
  }
  return { success: true };
}

export async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });
  const errors: UserError[] =
    (data as any)?.data?.cartLinesRemove?.userErrors ?? [];
  if (isCartNotFoundError(errors)) return { success: false, cartNotFound: true };
  if (errors.length) {
    console.error("Cart remove line failed", errors);
    return { success: false };
  }
  return { success: true };
}

export async function fetchShopifyCart(
  cartId: string,
): Promise<{ totalQuantity: number; checkoutUrl: string } | null> {
  const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
  const cart = (data as any)?.data?.cart;
  if (!cart) return null;
  return {
    totalQuantity: cart.totalQuantity,
    checkoutUrl: formatCheckoutUrl(cart.checkoutUrl),
  };
}
