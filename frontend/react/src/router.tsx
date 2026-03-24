import { createBrowserRouter } from 'react-router-dom';
import ControleEstoque from './pages/ControleEstoque';
import GerenciarCatalogo from './pages/GerenciarCatalogo';
import Menu from './pages/Menu';
import PontoDeVenda from './pages/PontoDeVenda';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu/>,
  },
  {
    path: "/estoque",
    element: <ControleEstoque />,
  },
  {
    path: "/gerenciar-catalogo",
    element: <GerenciarCatalogo />,
  },
{
    path: "/ponto-de-venda",
    element: <PontoDeVenda />,
  },
  {
    // Rota de 404 - Caso o usuário digite algo inexistente
    path: "*",
    element: <div className="p-10 font-bold text-center">404 - Página não encontrada</div>,
  }
]);