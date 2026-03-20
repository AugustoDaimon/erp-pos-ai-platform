import api from "./api";
import type { 
  Produto, 
  CreateProdutoRequest, 
  UpdateProdutoRequest, 
  FiltroProduto 
} from "./types/Produto";

export const produtoService = {
  listar: async (filtros?: FiltroProduto): Promise<Produto[]> => {
    const params = new URLSearchParams();
    
    if (filtros?.categoria_id) params.append("categoria_id", filtros.categoria_id.toString());
    if (filtros?.marca_id) params.append("marca_id", filtros.marca_id.toString());
    if (filtros?.busca) params.append("busca", filtros.busca);
    if (filtros?.estoque_baixo) params.append("estoque_baixo", "true");

    const response = await api.get<Produto[]>("/produtos/", { params });
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Produto> => {
    const response = await api.get<Produto>(`/produtos/${id}`);
    return response.data;
  },

  criar: async (dados: CreateProdutoRequest): Promise<Produto> => {
    const response = await api.post<Produto>("/produtos/", dados);
    return response.data;
  },

  atualizar: async (id: number, dados: UpdateProdutoRequest): Promise<Produto> => {
    const response = await api.put<Produto>(`/produtos/${id}`, dados);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/produtos/${id}`);
  }
};