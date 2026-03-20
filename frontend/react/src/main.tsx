import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PointOfSale from './pages/PointOfSale.tsx'
import Menu from './pages/Menu.tsx'
import CadastroProduto from './pages/CadastroProduto.tsx'
import GerenciarCatalogo from './pages/GerenciarCatalogo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
        <CadastroProduto />
    </>
  </StrictMode>,
)
