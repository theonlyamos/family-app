import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // ──────────────────────────────────────────────
    // Auth — app-level user profile linked to better-auth identity
    // ──────────────────────────────────────────────
    users: defineTable({
        // External auth identity (better-auth user ID)
        externalId: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        role: v.union(
            v.literal("admin"),
            v.literal("member"),
            v.literal("viewer")
        ),
    })
        .index("by_externalId", ["externalId"])
        .index("by_email", ["email"]),

    // ──────────────────────────────────────────────
    // Family Members
    // ──────────────────────────────────────────────
    members: defineTable({
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

        // Relationships — children & siblings are derived from these refs
        fatherId: v.optional(v.id("members")),
        motherId: v.optional(v.id("members")),
        spouseId: v.optional(v.id("members")),

        // Who created/owns this record
        createdBy: v.optional(v.id("users")),
    })
        .index("by_lastName", ["lastName"])
        .index("by_fatherId", ["fatherId"])
        .index("by_motherId", ["motherId"])
        .index("by_spouseId", ["spouseId"]),

    // ──────────────────────────────────────────────
    // Events & Calendar
    // ──────────────────────────────────────────────
    events: defineTable({
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
    })
        .index("by_startTime", ["startTime"])
        .index("by_type", ["type"])
        .index("by_createdBy", ["createdBy"]),

    // ──────────────────────────────────────────────
    // Investments
    // ──────────────────────────────────────────────
    investments: defineTable({
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
    })
        .index("by_type", ["type"])
        .index("by_date", ["date"]),

    // ──────────────────────────────────────────────
    // Document Vault
    // ──────────────────────────────────────────────
    documents: defineTable({
        name: v.string(),
        type: v.string(),
        size: v.string(),
        category: v.string(),
        description: v.optional(v.string()),
        // Convex file storage reference for the actual file
        storageId: v.optional(v.id("_storage")),
        // Which members this document is associated with
        associatedMemberIds: v.optional(v.array(v.id("members"))),
        uploadedBy: v.id("users"),
    })
        .index("by_category", ["category"])
        .index("by_uploadedBy", ["uploadedBy"]),

    // ──────────────────────────────────────────────
    // Activity Feed
    // ──────────────────────────────────────────────
    activities: defineTable({
        action: v.string(),
        item: v.string(),
        type: v.string(),
        memberId: v.optional(v.id("members")),
    })
        .index("by_type", ["type"]),
});
