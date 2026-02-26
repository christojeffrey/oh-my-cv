import { useConvexAuth, useQuery } from "convex/react";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { fromConvex } from "@/lib/resume-mapper";
import { localResumeAtom } from "@/store/local-resume-atom.ts";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/** Fetches a single resume by ID. Use in the editor. */
export function useResume(id?: string) {
  const { isAuthenticated } = useConvexAuth();
  const localResume = useAtomValue(localResumeAtom);

  const convexResume = useQuery(
    api.resumes.getResume,
    isAuthenticated && id ? { id: id as Id<"resumes"> } : "skip"
  );

  const resume = useMemo(() => {
    if (isAuthenticated) {
      return convexResume ? fromConvex(convexResume) : null;
    }
    return localResume;
  }, [isAuthenticated, convexResume, localResume]);

  const isLoading = isAuthenticated && convexResume === undefined;

  return { resume, isLoading };
}
