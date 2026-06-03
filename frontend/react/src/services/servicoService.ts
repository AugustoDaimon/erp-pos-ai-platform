import api from "./api";
import type { 
  Servico, 
  CreateServicoRequest, 
  UpdateServicoRequest 
} from "./types/Servico";

export const servicoService = {
  
  listar: async (busca?: string): Promise<Servico[]> => {
    const params = busca ? { busca } : {};
    const response = await api.get<Servico[]>("/servicos/", { params });
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Servico> => {
    const response = await api.get<Servico>(`/servicos/${id}`);
    return response.data;
  },

  criar: async (dados: CreateServicoRequest): Promise<Servico> => {
    const response = await api.post<Servico>("/servicos/", dados);
    return response.data;
  },

  atualizar: async (id: number, dados: UpdateServicoRequest): Promise<Servico> => {
    // Usando PATCH ou PUT (O Backend aceita ambos)
    const response = await api.patch<Servico>(`/servicos/${id}`, dados);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/servicos/${id}`);
  }
};