import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        tokenIdentifier: v.string(), // Clerk user ID
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        image: v.optional(v.string()),  // Profile picture URL
    }).index("by_token", ["tokenIdentifier"]),

    resumes: defineTable({
        userId: v.id("users"), // Foreign key to users
        title: v.string(),
        markdown: v.string(),
        customCss: v.string(),
        configuration: v.string(),   // JSON stringified styles
        lastUpdated: v.number(), // Timestamp
    }).index("by_user", ["userId"]),
});
