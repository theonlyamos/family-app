import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ensureAuthenticated } from "./auth";

export const list = query({
    args: {},
    handler: async (ctx) => {
        await ensureAuthenticated(ctx);
        // Return most recent activities first (by creation time)
        return await ctx.db.query("activities").order("desc").take(20);
    },
});

export const listByMemberId = query({
    args: { memberId: v.id("members") },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        return await ctx.db
            .query("activities")
            .order("desc")
            .filter((q) => q.eq(q.field("memberId"), args.memberId))
            .take(20);
    },
});

export const create = mutation({
    args: {
        action: v.string(),
        item: v.string(),
        type: v.string(),
        memberId: v.optional(v.id("members")),
    },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.insert("activities", args);
    },
});
