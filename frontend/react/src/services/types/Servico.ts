export interface Servico {
  id: number;
  descricao: string;
  preco: number;
  tempo_estimado: number;
  criado_em: string;
  tipo: string;
}

export interface CreateServicoRequest {
  descricao: string;
  preco: number;
  tempo_estimado: number;
}

export interface UpdateServicoRequest {
  descricao?: string;
  preco?: number;
  tempo_estimado?: number;
}