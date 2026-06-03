export type StatusPedido = 'pendente' | 'concluido' | 'cancelado';
export type StatusOficina = 'nao_aplicavel' | 'entregue' | 'em_manutencao' | 'aguardando_peca' | 'pronto';

export interface ItemPedido {
  id: number;
  pedido_id: number;
  item_id: number;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  descricao_item?: string;
}

export interface Pedido {
  id: number;
  cliente_id: number | null;
  subtotal: number;
  taxas_cartao: number;
  desconto: number;
  valor_total: number;
  valor_pago: number;
  metodo_pagamento: string | null;
  emitir_nota_fiscal: boolean;
  status_pedido: StatusPedido;
  status_oficina: StatusOficina;
  data_prevista_retirada: string | null;
  data_entrega_real: string | null;
  criado_em: string;
  itens: ItemPedido[];
}

export interface CreateItemPedidoRequest {
  item_id: number;
  quantidade: number;
  valor_unitario: number; 
}

export interface CreatePedidoRequest {
  cliente_id?: number | null;
  taxas_cartao?: number;
  desconto?: number;
  valor_pago?: number;
  metodo_pagamento?: string | null;
  emitir_nota_fiscal?: boolean;
  data_prevista_retirada?: string | null;
  status_pedido?: StatusPedido; 
  itens: CreateItemPedidoRequest[];
}

export interface FiltroPedido {
  cliente_id?: number;
  status_pedido?: StatusPedido;
  status_oficina?: StatusOficina;
  data_inicio?: string;
  data_fim?: string;
}