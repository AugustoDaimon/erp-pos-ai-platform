import api from "./api";
import type { Marca, CreateMarcaRequest, UpdateMarcaRequest } from "./types/Marca";

export const marcaService = {
  listar: async (): Promise<Marca[]> => {
    const response = await api.get<Marca[]>("/marcas/");
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Marca> => {
    const response = await api.get<Marca>(`/marcas/${id}`);
    return response.data;
  },

  criar: async (dados: CreateMarcaRequest): Promise<Marca> => {
    const response = await api.post<Marca>("/marcas/", dados);
    return response.data;
  },

  atualizar: async (id: number, dados: UpdateMarcaRequest): Promise<Marca> => {
    const response = await api.put<Marca>(`/marcas/${id}`, dados);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/marcas/${id}`);
  }
};