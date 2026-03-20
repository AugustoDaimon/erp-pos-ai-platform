export interface Marca {
  id: number;
  nome: string;
  categorias_vinculadas: number[]; // A nossa lista N:N!
  criado_em: string;
}

export interface CreateMarcaRequest {
  nome: string;
  categorias_vinculadas: number[];
}

export interface UpdateMarcaRequest {
  nome?: string;
  categorias_vinculadas?: number[];
}