import api from "./api";
import type { 
  Categoria, 
  CreateCategoriaRequest, 
  UpdateCategoriaRequest 
} from "./types/Categoria";

/**
 * SERVIÇO DE CATEGORIAS
 * Centraliza todas as chamadas para o endpoint /api/categorias
 */
export const categoriaService = {
  
  // 1. LISTAR TODAS
  listar: async (): Promise<Categoria[]> => {
    // O generic <Categoria[]> avisa ao Axios o que esperar no response.data
    const response = await api.get<Categoria[]>("/categorias/");
    return response.data;
  },

  // 2. BUSCAR POR ID
  buscarPorId: async (id: number): Promise<Categoria> => {
    const response = await api.get<Categoria>(`/categorias/${id}`);
    return response.data;
  },

  // 3. CRIAR NOVA
  criar: async (dados: CreateCategoriaRequest): Promise<Categoria> => {
    const response = await api.post<Categoria>("/categorias/", dados);
    return response.data;
  },

  atualizar: async (id: number, dados: UpdateCategoriaRequest): Promise<Categoria> => {
    const response = await api.put<Categoria>(`/categorias/${id}`, dados);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  }
};