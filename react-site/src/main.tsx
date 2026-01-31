import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { I18nextProvider } from 'react-i18next'
import { routeTree } from './routeTree.gen'
import i18n from './configs/i18n'
import './index.css'
 
const router = createRouter({ routeTree })
 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  </StrictMode>,
)
