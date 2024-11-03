import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Provider } from "@/components/ui/provider"
import App from './app';

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
)
