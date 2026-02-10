import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ensureAuthenticated } from "./auth";

export const list = query({
    args: {},
    handler: async (ctx) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.query("events").order("desc").take(100);
    },
});

export const getById = query({
    args: { id: v.id("events") },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.get(args.id);
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.string(),
        endTime: v.string(),
        location: v.optional(v.string()),
        createdBy: v.id("members"),
        type: v.optional(
            v.union(
                v.literal("family"),
                v.literal("kids"),
                v.literal("health"),
                v.literal("work")
            )
        ),
    },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.insert("events", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("events"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        startTime: v.optional(v.string()),
        endTime: v.optional(v.string()),
        location: v.optional(v.string()),
        createdBy: v.optional(v.id("members")),
        type: v.optional(
            v.union(
                v.literal("family"),
                v.literal("kids"),
                v.literal("health"),
                v.literal("work")
            )
        ),
    },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("events") },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        await ctx.db.delete(args.id);
    },
});
