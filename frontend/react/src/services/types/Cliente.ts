export interface Cliente {
  id: number;
  nome: string;
  celular: string | null;
  sem_whatsapp: boolean;
  bike_info: string | null;
  criado_em?: string; // Data retornada como string ISO pelo Python
}

export interface CreateClienteRequest {
  nome: string;
  celular?: string | null;
  sem_whatsapp?: boolean;
  bike_info?: string | null;
}

// O Update permite atualizar parcialmente os dados (Partial)
export interface UpdateClienteRequest extends Partial<CreateClienteRequest> {}

// Caso queira adicionar filtros na busca futuramente (ex: buscar por nome ou telefone)
export interface FiltroCliente {
  busca?: string;
}