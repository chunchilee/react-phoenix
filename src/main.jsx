import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import SnackbarProvider from './contexts/SnackbarContext.jsx'

import './index.css'
import routes from './routers/routes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider>
      <RouterProvider router={routes} />
    </SnackbarProvider>
  </StrictMode>,
)
