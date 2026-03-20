export interface Categoria {
  id: number;
  nome: string;
  criado_em: string;
}

export interface CreateCategoriaRequest {
  nome: string;
}

export interface UpdateCategoriaRequest {
  nome?: string;
}