import api from "./api";
import type { 
  Cliente, 
  CreateClienteRequest, 
  UpdateClienteRequest,
  FiltroCliente
} from "./types/Cliente";

export const clienteService = {
  
  // 1. LISTAR TODOS (Com suporte a filtros futuros)
  listar: async (filtros?: FiltroCliente): Promise<Cliente[]> => {
    const params = new URLSearchParams();
    
    if (filtros?.busca) params.append("busca", filtros.busca);

    const response = await api.get<Cliente[]>("/clientes/", { params });
    return response.data;
  },

  // 2. BUSCAR POR ID
  buscarPorId: async (id: number): Promise<Cliente> => {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  // 3. CRIAR NOVO CLIENTE
  criar: async (dados: CreateClienteRequest): Promise<Cliente> => {
    const response = await api.post<Cliente>("/clientes/", dados);
    return response.data;
  },

  // 4. ATUALIZAR CLIENTE
  atualizar: async (id: number, dados: UpdateClienteRequest): Promise<Cliente> => {
    const response = await api.put<Cliente>(`/clientes/${id}`, dados);
    return response.data;
  },

  // 5. DELETAR CLIENTE
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  }
};