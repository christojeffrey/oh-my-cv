import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the current user by their Clerk token identifier.
 */
export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();
        return user;
    },
});

/**
 * Create or update a user (upsert) based on their identity.
 * This is typically called after authentication or via webhook.
 */
export const upsertUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        image: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", args.tokenIdentifier)
            )
            .unique();

        if (user !== null) {
            // Update existing user
            if (
                user.name !== args.name ||
                user.email !== args.email ||
                user.image !== args.image
            ) {
                await ctx.db.patch(user._id, {
                    name: args.name,
                    email: args.email,
                    image: args.image,
                });
            }
            return user._id;
        }

        // Create new user
        return await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            name: args.name,
            email: args.email,
            image: args.image,
        });
    },
});
