import { QueryCtx, MutationCtx, query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity;
  },
});

/**
 * Ensures the caller is authenticated.
 * Call at the top of every query/mutation handler.
 *
 * During development, set SKIP_AUTH=true in your Convex environment
 * to bypass the check (useful before better-auth is fully wired up).
 */
export async function ensureAuthenticated(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
        // Allow bypass during development
        const skipAuth = process.env.SKIP_AUTH === "true";
        if (skipAuth) {
            return null;
        }
        throw new Error("Not authenticated");
    }

    return identity;
}
