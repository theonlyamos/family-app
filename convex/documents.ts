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

export const generateUploadUrl = mutation(async (ctx) => {
    await ensureAuthenticated(ctx);
    return await ctx.storage.generateUploadUrl();
});

export const getFileUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        return await ctx.storage.getUrl(args.storageId);
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
    },
    handler: async (ctx, args) => {
        const identity = await ensureAuthenticated(ctx);

        if (!identity) {
            throw new Error("Unauthenticated call to create document");
        }

        // Look up or auto-create the app-level user record
        let user = await ctx.db
            .query("users")
            .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
            .first();

        if (!user) {
            // Auto-provision user from auth identity
            const userId = await ctx.db.insert("users", {
                externalId: identity.subject,
                email: identity.email ?? "unknown@example.com",
                name: identity.name ?? undefined,
                role: "member",
            });
            user = await ctx.db.get(userId);
        }

        return await ctx.db.insert("documents", {
            ...args,
            uploadedBy: user!._id,
        });
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
        const doc = await ctx.db.get(args.id);
        if (doc && doc.storageId) {
            await ctx.storage.delete(doc.storageId);
        }
        await ctx.db.delete(args.id);
    },
});
