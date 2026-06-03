import api from "./api";
import type { 
  Pedido, 
  CreatePedidoRequest, 
  FiltroPedido 
} from "./types/Pedido";

export const pedidoService = {
  
  criar: async (dados: CreatePedidoRequest): Promise<Pedido> => {
    const response = await api.post<Pedido>("/pedidos/", dados);
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Pedido> => {
    const response = await api.get<Pedido>(`/pedidos/${id}`);
    return response.data;
  },

  cancelar: async (id: number): Promise<{ detail: string }> => {
    const response = await api.post<{ detail: string }>(`/pedidos/${id}/cancelar`);
    return response.data;
  },

  listar: async (filtros?: FiltroPedido): Promise<Pedido[]> => {
    const params = new URLSearchParams();
    
    if (filtros?.cliente_id) params.append("cliente_id", filtros.cliente_id.toString());
    if (filtros?.status_pedido) params.append("status_pedido", filtros.status_pedido);
    if (filtros?.status_oficina) params.append("status_oficina", filtros.status_oficina);
    if (filtros?.data_inicio) params.append("data_inicio", filtros.data_inicio);
    if (filtros?.data_fim) params.append("data_fim", filtros.data_fim);

    const response = await api.get<Pedido[]>("/pedidos/", { params });
    return response.data;
  }
};