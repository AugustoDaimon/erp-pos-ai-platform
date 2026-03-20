export interface Subcategoria {
  id: number;
  categoria_id: number;
  nome: string;
  criado_em: string;
}

export interface CreateSubcategoriaRequest {
  categoria_id: number;
  nome: string;
}

export interface UpdateSubcategoriaRequest {
  categoria_id?: number;
  nome?: string;
}