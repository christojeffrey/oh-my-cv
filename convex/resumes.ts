import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the current user's resume.
 * If multiple exist (which shouldn't happen per spec), return the latest.
 * If none exist, return null.
 */
/**
 * Get all resumes for the current user.
 */
export const getResumes = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) return [];

        const resumes = await ctx.db
            .query("resumes")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();

        return resumes;
    },
});

export const getResume = query({
    args: { id: v.id("resumes") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

/**
 * Create a new resume.
 */
/**
 * Create a new resume.
 */
export const createResume = mutation({
    args: {
        title: v.string(),
        markdown: v.string(),
        css: v.string(),
        styles: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        // 1. Get or Create User
        let user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            const userId = await ctx.db.insert("users", {
                tokenIdentifier: identity.tokenIdentifier,
                name: identity.name,
                email: identity.email,
                image: identity.pictureUrl,
            });
            user = await ctx.db.get(userId);
        }

        if (!user) throw new Error("Failed to get/create user");

        const now = Date.now();

        // Create new
        const resumeId = await ctx.db.insert("resumes", {
            userId: user._id,
            title: args.title,
            markdown: args.markdown,
            css: args.css,
            styles: args.styles,
            lastUpdated: now,
        });
        return resumeId;
    },
});

/**
 * Update an existing resume.
 */
export const updateResume = mutation({
    args: {
        id: v.id("resumes"),
        title: v.optional(v.string()),
        markdown: v.optional(v.string()),
        css: v.optional(v.string()),
        styles: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const now = Date.now();

        await ctx.db.patch(args.id, {
            ...(args.title && { title: args.title }),
            ...(args.markdown && { markdown: args.markdown }),
            ...(args.css && { css: args.css }),
            ...(args.styles && { styles: args.styles }),
            lastUpdated: now,
        });
    },
});

export const deleteResume = mutation({
    args: { id: v.id("resumes") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        await ctx.db.delete(args.id);
    },
});
