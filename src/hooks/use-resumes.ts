import { useAuth } from "@clerk/clerk-react";
import { useQuery, useConvexAuth } from "convex/react";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { api } from "../../convex/_generated/api";
import { localResumeAtom } from "@/store/local-resume-atom.ts";
import { fromConvex } from "@/lib/resume-mapper";

/** Subscribes to the full list of resumes. Use only on the dashboard. */
export function useResumes() {
    const { isLoaded } = useAuth();
    const { isAuthenticated, isLoading: isConvexAuthLoading } = useConvexAuth();
    const localResume = useAtomValue(localResumeAtom);

    const convexResumes = useQuery(api.resumes.getResumes, isAuthenticated ? {} : "skip");

    const resumes = useMemo(() => {
        if (isAuthenticated && convexResumes) {
            return convexResumes.map(fromConvex);
        }
        return isAuthenticated ? [] : [localResume];
    }, [isAuthenticated, convexResumes, localResume]);

    const isConvexLoading = isAuthenticated && convexResumes === undefined;
    const isLoading = !isLoaded || isConvexAuthLoading || isConvexLoading;

    return { resumes, isLoading };
}
