import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/** Mutation-only hook for deleting a resume. No list subscription. */
export function useDeleteResume() {
  const { isAuthenticated } = useConvexAuth();
  const deleteResumeMutation = useMutation(api.resumes.deleteResume);

  const deleteResume = async (id: string): Promise<void> => {
    if (isAuthenticated) {
      try {
        await deleteResumeMutation({ id: id as Id<"resumes"> });
      } catch (error) {
        console.error("Failed to delete resume in Convex:", error);
        throw error;
      }
    } else {
      throw new Error("Cannot delete local resume");
    }
  };

  return { deleteResume };
}
