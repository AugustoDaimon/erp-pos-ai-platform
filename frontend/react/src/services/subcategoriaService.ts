import api from "./api";
import type { 
  Subcategoria, 
  CreateSubcategoriaRequest, 
  UpdateSubcategoriaRequest 
} from  "./types/Subcategoria";

export const subcategoriaService = {
  listar: async (): Promise<Subcategoria[]> => {
    const response = await api.get<Subcategoria[]>("/subcategorias/");
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Subcategoria> => {
    const response = await api.get<Subcategoria>(`/subcategorias/${id}`);
    return response.data;
  },

  criar: async (dados: CreateSubcategoriaRequest): Promise<Subcategoria> => {
    const response = await api.post<Subcategoria>("/subcategorias/", dados);
    return response.data;
  },

  atualizar: async (id: number, dados: UpdateSubcategoriaRequest): Promise<Subcategoria> => {
    const response = await api.put<Subcategoria>(`/subcategorias/${id}`, dados);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/subcategorias/${id}`);
  }
};