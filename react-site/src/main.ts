import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found')
} else {
  console.log('Root element found, rendering React')
  createRoot(rootElement).render(
    <StrictMode>
      <div>React is working! Hello World</div>
    </StrictMode>,
  )
}