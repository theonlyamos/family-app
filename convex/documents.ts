import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ensureAuthenticated } from "./auth";

export const list = query({
    args: {},
    handler: async (ctx) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.query("documents").take(200);
    },
});

export const getById = query({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.get(args.id);
    },
});

export const listByMemberId = query({
    args: { memberId: v.id("members") },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        const allDocs = await ctx.db.query("documents").take(200);
        return allDocs.filter((d) =>
            d.associatedMemberIds?.includes(args.memberId)
        );
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        type: v.string(),
        size: v.string(),
        category: v.string(),
        description: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        associatedMemberIds: v.optional(v.array(v.id("members"))),
        uploadedBy: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.insert("documents", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("documents"),
        name: v.optional(v.string()),
        type: v.optional(v.string()),
        size: v.optional(v.string()),
        category: v.optional(v.string()),
        description: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        associatedMemberIds: v.optional(v.array(v.id("members"))),
        uploadedBy: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        await ctx.db.delete(args.id);
    },
});
