import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("updateResume allows empty strings", async () => {
    const modules = import.meta.glob("./**/*.ts");
    const t = convexTest(schema, modules);

    const identity = {
        tokenIdentifier: "user123",
        name: "Test User",
        email: "test@example.com",
        pictureUrl: "https://example.com/pic.png",
    };

    const authed = t.withIdentity(identity);

    // 1. Create a resume
    const resumeId = await authed.mutation(api.resumes.createResume, {
        title: "My Resume",
        markdown: "Initial text",
        customCss: ".old { color: red; }",
        configuration: "{}",
    });

    // 2. Update with empty string for markdown
    await authed.mutation(api.resumes.updateResume, {
        id: resumeId,
        markdown: "",
    });

    // 3. Verify markdown was updated to empty
    let updatedResume = await authed.query(api.resumes.getResume, { id: resumeId });
    expect(updatedResume?.markdown).toBe("");
    // Check that other fields didn't get wiped if not provided
    expect(updatedResume?.title).toBe("My Resume");
    expect(updatedResume?.customCss).toBe(".old { color: red; }");

    // 4. Update customCss to empty
    await authed.mutation(api.resumes.updateResume, {
        id: resumeId,
        customCss: "",
    });

    updatedResume = await authed.query(api.resumes.getResume, { id: resumeId });
    expect(updatedResume?.customCss).toBe("");
    expect(updatedResume?.markdown).toBe(""); // Should stay empty

    // 5. Update title to empty
    await authed.mutation(api.resumes.updateResume, {
        id: resumeId,
        title: "",
    });

    updatedResume = await authed.query(api.resumes.getResume, { id: resumeId });
    expect(updatedResume?.title).toBe("");
});

test("updateResume doesn't wipe fields when not provided", async () => {
    const modules = import.meta.glob("./**/*.ts");
    const t = convexTest(schema, modules);

    const identity = {
        tokenIdentifier: "user123",
        name: "Test User",
        email: "test@example.com",
    };

    const authed = t.withIdentity(identity);

    const resumeId = await authed.mutation(api.resumes.createResume, {
        title: "Keep Me",
        markdown: "Keep Me Too",
        customCss: "Keep Me Three",
        configuration: "{}",
    });

    // Update ONLY markdown
    await authed.mutation(api.resumes.updateResume, {
        id: resumeId,
        markdown: "New Markdown",
    });

    const updated = await authed.query(api.resumes.getResume, { id: resumeId });
    expect(updated?.markdown).toBe("New Markdown");
    expect(updated?.title).toBe("Keep Me");
    expect(updated?.customCss).toBe("Keep Me Three");
});
