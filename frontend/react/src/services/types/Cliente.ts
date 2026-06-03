export interface Cliente {
  id: number;
  nome: string;
  celular: string | null;
  sem_whatsapp: boolean;
  bike_info: string | null;
  criado_em?: string; 
}

export interface CreateClienteRequest {
  nome: string;
  celular?: string | null;
  sem_whatsapp?: boolean;
  bike_info?: string | null;
}

export interface UpdateClienteRequest extends Partial<CreateClienteRequest> {}

export interface FiltroCliente {
  busca?: string;
}