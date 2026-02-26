import { DEFAULT_RESUME_CONFIGURATION } from "@/constants";
import type { DbResume } from "@/types/resume";
import type { Id } from "../../convex/_generated/dataModel";

/** Shape of a raw Convex resume document (what `getResume` / `getResumes` return). */
export type ConvexResume = {
    _id: Id<"resumes">;
    _creationTime: number;
    title: string;
    markdown: string;
    customCss: string;
    configuration: string; // JSON-stringified ResumeConfiguration
    lastUpdated: number;
};

/** Maps a raw Convex document → app DbResume. */
export function fromConvex(r: ConvexResume): DbResume {
    return {
        id: r._id,
        name: r.title,
        markdown: r.markdown,
        customCss: r.customCss,
        configuration: { ...DEFAULT_RESUME_CONFIGURATION, ...JSON.parse(r.configuration) },
        created_at: new Date(r._creationTime),
        updated_at: new Date(r.lastUpdated),
    };
}

/** Maps an app DbResume (partial) → Convex mutation args. */
export function toConvexArgs(data: Partial<DbResume>) {
    return {
        title: data.name,
        markdown: data.markdown,
        customCss: data.customCss,
        configuration: data.configuration ? JSON.stringify(data.configuration) : undefined,
    };
}
