import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ensureAuthenticated } from "./auth";

export const list = query({
    args: {},
    handler: async (ctx) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.query("investments").take(100);
    },
});

export const getById = query({
    args: { id: v.id("investments") },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.get(args.id);
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        type: v.union(
            v.literal("stock"),
            v.literal("crypto"),
            v.literal("real_estate"),
            v.literal("bond"),
            v.literal("other")
        ),
        amount: v.number(),
        date: v.string(),
        notes: v.optional(v.string()),
        change: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.insert("investments", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("investments"),
        name: v.optional(v.string()),
        type: v.optional(
            v.union(
                v.literal("stock"),
                v.literal("crypto"),
                v.literal("real_estate"),
                v.literal("bond"),
                v.literal("other")
            )
        ),
        amount: v.optional(v.number()),
        date: v.optional(v.string()),
        notes: v.optional(v.string()),
        change: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("investments") },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        await ctx.db.delete(args.id);
    },
});
