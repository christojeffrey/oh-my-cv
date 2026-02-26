import { useConvexAuth, useMutation } from "convex/react";
import { useAtom } from "jotai";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { localResumeAtom } from "@/store/local-resume-atom.ts";
import type { DbResume } from "@/types/resume";
import { toConvexArgs } from "@/lib/resume-mapper";

/** Mutation-only hook for updating a resume. No list subscription. */
export function useUpdateResume() {
    const { isAuthenticated } = useConvexAuth();
    const [, setLocalResume] = useAtom(localResumeAtom);
    const updateResumeMutation = useMutation(api.resumes.updateResume);

    const updateResume = async (id: string, data: Partial<DbResume>) => {
        if (isAuthenticated) {
            await updateResumeMutation({ id: id as Id<"resumes">, ...toConvexArgs(data) });
        } else {
            setLocalResume((prev) => ({ ...prev, ...data, updated_at: new Date() }));
        }
    };

    return { updateResume };
}
