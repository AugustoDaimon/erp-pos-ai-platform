import api from "./api";
import type { 
  OrdemServico, 
  CreateOrdemServicoRequest, 
  UpdateOrdemServicoRequest,
  FiltroOrdemServico
} from "./types/OrdemServico";

export const ordemServicoService = {
  
  criar: async (dados: CreateOrdemServicoRequest): Promise<OrdemServico> => {
    const response = await api.post<OrdemServico>("/ordens-servico/", dados);
    return response.data;
  },

  listar: async (filtros?: FiltroOrdemServico): Promise<OrdemServico[]> => {
    const params = new URLSearchParams();
    
    if (filtros?.pedido_id) params.append("pedido_id", filtros.pedido_id.toString());
    if (filtros?.status) params.append("status", filtros.status);
    if (filtros?.data_inicio) params.append("data_inicio", filtros.data_inicio);
    if (filtros?.data_fim) params.append("data_fim", filtros.data_fim);

    const response = await api.get<OrdemServico[]>("/ordens-servico/", { params });
    return response.data;
  },

  buscarPorId: async (id: number): Promise<OrdemServico> => {
    const response = await api.get<OrdemServico>(`/ordens-servico/${id}`);
    return response.data;
  },

  atualizar: async (id: number, dados: UpdateOrdemServicoRequest): Promise<OrdemServico> => {
    const response = await api.patch<OrdemServico>(`/ordens-servico/${id}`, dados);
    return response.data;
  },

  finalizar: async (id: number): Promise<OrdemServico> => {
    const response = await api.patch<OrdemServico>(`/ordens-servico/${id}/finalizar`);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/ordens-servico/${id}`);
  }
};