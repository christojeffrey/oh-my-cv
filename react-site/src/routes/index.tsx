import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <div>Hello from Dashboard! If you see this, routing works.</div>,
})