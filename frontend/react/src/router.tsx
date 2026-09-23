import { createBrowserRouter } from 'react-router-dom';
import ControleEstoque from './pages/ControleEstoque';
import GerenciarCatalogo from './pages/GerenciarCatalogo';
import Menu from './pages/Menu';
import PontoDeVenda from './pages/PontoDeVenda';
import ControleServico from './pages/ControleServico';
import ConferirPedidos from './pages/ConferirPedidos';
import ControleCliente from './pages/ControleCliente';
import ControleCompras from './pages/ControleCompras';
import NovoPedido from './pages/NovoPedido';

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
    path: "/compras",
    children: [
      {
        index: true, // O index true faz o ControleCompras renderizar exatamente em "/compras"
        element: <ControleCompras />,
      },
      {
        path: "novo", // O caminho final ficará "/compras/novo"
        element: <NovoPedido />,
      }
    ]
  },
  {
    path: "/ponto-de-venda",
    element: <PontoDeVenda />,
  },
  {
    path: "/servicos",
    element: <ControleServico />
  },
  {
    path: "/relatorios",
    element: <ConferirPedidos />
  },
  {
    path: "/clientes",
    element: <ControleCliente />
  },
  {
    // Rota de 404 - Caso o usuário digite algo inexistente
    path: "*",
    element: <div className="p-10 font-bold text-center">404 - Página não encontrada</div>,
  }
]);