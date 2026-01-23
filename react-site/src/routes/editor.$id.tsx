import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editor/$id')({
  component: Editor,
})

function Editor() {
  const { id } = Route.useParams()
  return <div>Editor for {id}</div>
}