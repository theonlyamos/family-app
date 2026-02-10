import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ensureAuthenticated } from "./auth";

export const list = query({
    args: {},
    handler: async (ctx) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.query("members").take(200);
    },
});

export const getById = query({
    args: { id: v.id("members") },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.get(args.id);
    },
});

export const create = mutation({
    args: {
        firstName: v.string(),
        middleName: v.optional(v.string()),
        lastName: v.string(),
        aliases: v.optional(v.array(v.string())),
        dateOfBirth: v.optional(v.string()),
        placeOfBirth: v.optional(v.string()),
        placeOfResidence: v.optional(v.string()),
        phoneNumbers: v.optional(v.array(v.string())),
        emailAddresses: v.optional(v.array(v.string())),
        education: v.optional(v.string()),
        occupation: v.optional(v.string()),
        gender: v.optional(v.string()),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        fatherId: v.optional(v.id("members")),
        motherId: v.optional(v.id("members")),
        spouseId: v.optional(v.id("members")),
        createdBy: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        return await ctx.db.insert("members", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("members"),
        firstName: v.optional(v.string()),
        middleName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        aliases: v.optional(v.array(v.string())),
        dateOfBirth: v.optional(v.string()),
        placeOfBirth: v.optional(v.string()),
        placeOfResidence: v.optional(v.string()),
        phoneNumbers: v.optional(v.array(v.string())),
        emailAddresses: v.optional(v.array(v.string())),
        education: v.optional(v.string()),
        occupation: v.optional(v.string()),
        gender: v.optional(v.string()),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        fatherId: v.optional(v.id("members")),
        motherId: v.optional(v.id("members")),
        spouseId: v.optional(v.id("members")),
    },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("members") },
    handler: async (ctx, args) => {
        await ensureAuthenticated(ctx);

        const member = await ctx.db.get(args.id);
        if (!member) return;

        // Clear spouse back-reference
        if (member.spouseId) {
            const spouse = await ctx.db.get(member.spouseId);
            if (spouse && spouse.spouseId === args.id) {
                await ctx.db.patch(member.spouseId, { spouseId: undefined });
            }
        }

        // Clear fatherId on children referencing this member
        const childrenByFather = await ctx.db
            .query("members")
            .withIndex("by_fatherId", (q) => q.eq("fatherId", args.id))
            .collect();
        for (const child of childrenByFather) {
            await ctx.db.patch(child._id, { fatherId: undefined });
        }

        // Clear motherId on children referencing this member
        const childrenByMother = await ctx.db
            .query("members")
            .withIndex("by_motherId", (q) => q.eq("motherId", args.id))
            .collect();
        for (const child of childrenByMother) {
            await ctx.db.patch(child._id, { motherId: undefined });
        }

        await ctx.db.delete(args.id);
    },
});
