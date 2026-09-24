import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LegalPage from './pages/LegalPage'

const root = document.getElementById('root')!
const page = root.dataset.page === 'terms' ? 'terms' : 'privacy'

createRoot(root).render(
  <StrictMode>
    <LegalPage doc={page} />
  </StrictMode>,
)
