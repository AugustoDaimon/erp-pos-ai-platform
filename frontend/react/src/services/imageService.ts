import api from "./api";
import type { ProductImage, ImageSearchRequest } from "./types/Image";

/**
 * SERVIÇO DE BUSCA DE IMAGENS
 * Consome o serviço externo (Linkup) através da nossa API Flask
 */
export const imageService = {
  
  buscarImagens: async (dados: ImageSearchRequest): Promise<ProductImage[]> => {
    const response = await api.post<ProductImage[]>("/images/search", dados);
    return response.data;
  }
};