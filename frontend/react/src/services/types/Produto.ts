export interface Produto {
  id: number;
  categoria_id: number | null;
  subcategoria_id: number | null;
  marca_id: number | null;
  descricao: string;
  observacao: string | null;
  sku: string | null;
  valor_venda: number;
  valor_instalacao: number;
  custo_compra: number;
  estoque_atual: number;
  estoque_minimo: number;
  especificacao_1: string | null;
  especificacao_2: string | null;
  especificacao_3: string | null;
  imagem_url: string | null;
  criado_em: string;
}

export interface CreateProdutoRequest {
  descricao: string;
  valor_venda: number;
  categoria_id?: number | null;
  subcategoria_id?: number | null;
  marca_id?: number | null;
  observacao?: string | null;
  sku?: string | null;
  valor_instalacao?: number;
  custo_compra?: number;
  estoque_atual?: number;
  estoque_minimo?: number;
  especificacao_1?: string | null;
  especificacao_2?: string | null;
  especificacao_3?: string | null;
  imagem_url?: string | null;
}

export interface UpdateProdutoRequest extends Partial<CreateProdutoRequest> {}

export interface FiltroProduto {
  categoria_id?: number;
  marca_id?: number;
  busca?: string;
  estoque_baixo?: boolean;
}