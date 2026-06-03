export type StatusOrdemServico = 
  | 'na_fila' 
  | 'em_manutencao' 
  | 'aguardando_peca' 
  | 'pronto' 
  | 'entregue';

export interface OrdemServico {
  id: number;
  pedido_id: number;
  servico_id: number;
  data_inicio_previsto: string;
  data_termino_previsto: string;
  data_termino_real: string | null;
  status: StatusOrdemServico;
}

export interface CreateOrdemServicoRequest {
  pedido_id: number;
  servico_id: number;
  data_inicio_previsto: string;
  data_termino_previsto: string;
  status?: StatusOrdemServico | string;
}

export interface UpdateOrdemServicoRequest {
  pedido_id?: number;
  servico_id?: number;
  data_inicio_previsto?: string;
  data_termino_previsto?: string;
  data_termino_real?: string | null;
  status?: StatusOrdemServico | string;
}

export interface FiltroOrdemServico {
  pedido_id?: number;
  status?: StatusOrdemServico | string;
  data_inicio?: string;
  data_fim?: string;
}