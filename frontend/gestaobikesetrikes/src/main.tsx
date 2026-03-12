import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PointOfSale from './pages/PointOfSale.tsx'
import Menu from './pages/menu.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
        <PointOfSale />
    </>
  </StrictMode>,
)
