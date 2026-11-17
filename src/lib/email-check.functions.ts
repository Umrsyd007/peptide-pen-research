import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const verifyEmailDomain = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => z.object({ email: z.string().trim().email().max(255) }).parse(raw))
  .handler(async ({ data }) => {
    const { checkEmailDeliverable } = await import("@/lib/email-check.server");
    return { error: await checkEmailDeliverable(data.email) };
  });
