import { createFileRoute } from "@tanstack/react-router";
import { ResumeEditor } from "@/features/editor";

export const Route = createFileRoute("/editor/$id")({
  component: Editor,
});

function Editor() {
  const { id } = Route.useParams();
  return <ResumeEditor id={id} />;
}
