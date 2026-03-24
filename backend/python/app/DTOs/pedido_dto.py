from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime

# ==========================================
# 1. DTOs dos Itens (Aninhados no Pedido)
# ==========================================

@dataclass
class CreateItemPedidoDTO:
    """O que o React envia quando um item é adicionado ao carrinho."""
    item_id: int # É o ID do Catálogo (serve para Produto ou Serviço)
    quantidade: int
    valor_unitario: float

@dataclass
class ItemPedidoResponseDTO:
    """O que o Backend devolve para o React renderizar a linha do pedido."""
    id: int
    item_id: int
    quantidade: int
    valor_unitario: float
    valor_total: float

    @classmethod
    def from_entity(cls, entity):
        return cls(
            id=entity.id,
            item_id=entity.item_id,
            quantidade=entity.quantidade,
            valor_unitario=entity.valor_unitario,
            valor_total=entity.valor_total
        )

# ==========================================
# 2. DTOs do Pedido (O Cabeçalho)
# ==========================================

@dataclass
class CreatePedidoDTO:
    """O JSON completo que o Frontend envia ao clicar em 'Finalizar Venda'."""
    cliente_id: int | None = None
    subtotal: float = 0.0 # Enviado pelo front para conferência
    taxas_cartao: float = 0.0
    desconto: float = 0.0
    valor_pago: float = 0.0
    metodo_pagamento: str | None = None
    emitir_nota_fiscal: bool = False
    status_pedido: str = 'CONCLUIDO'
    status_oficina: str = 'NAO_APLICAVEL'
    
    # Datas podem vir como string do front, mas o ideal é o framework (Flask/Pydantic) converter. 
    # Aqui assumimos que já chega convertido se usar validação prévia, ou mantemos como str e convertemos no service.
    data_prevista_retirada: datetime | None = None 
    
    # A Mágica do Aninhamento:
    itens: List[CreateItemPedidoDTO] = field(default_factory=list)


@dataclass
class UpdatePedidoDTO:
    """Permite atualizar o status da oficina, datas ou o pagamento posterior."""
    status_pedido: str | None = None
    status_oficina: str | None = None
    metodo_pagamento: str | None = None
    valor_pago: float | None = None
    data_prevista_retirada: datetime | None = None
    data_entrega_real: datetime | None = None

    def to_dict_exclude_none(self) -> dict:
        from dataclasses import asdict
        return {k: v for k, v in asdict(self).items() if v is not None}


@dataclass
class PedidoResponseDTO:
    """O JSON robusto que volta para a tela de 'Detalhes do Pedido' ou impressão de recibo."""
    id: int
    cliente_id: int | None
    subtotal: float
    taxas_cartao: float
    desconto: float
    valor_total: float
    valor_pago: float
    saldo_devedor: float # Propriedade calculada excelente para o Frontend
    metodo_pagamento: str | None
    emitir_nota_fiscal: bool
    status_pedido: str
    status_oficina: str
    data_prevista_retirada: str | None
    data_entrega_real: str | None
    criado_em: str
    itens: List[ItemPedidoResponseDTO] = field(default_factory=list)

    @classmethod
    def from_entity(cls, entity):
        return cls(
            id=entity.id,
            cliente_id=entity.cliente_id,
            subtotal=entity.subtotal,
            taxas_cartao=entity.taxas_cartao,
            desconto=entity.desconto,
            valor_total=entity.valor_total,
            valor_pago=entity.valor_pago,
            saldo_devedor=entity.saldo_devedor, # O método dinâmico que criamos na Entity!
            metodo_pagamento=entity.metodo_pagamento,
            emitir_nota_fiscal=entity.emitir_nota_fiscal,
            status_pedido=entity.status_pedido,
            status_oficina=entity.status_oficina,
            data_prevista_retirada=entity.data_prevista_retirada.strftime("%Y-%m-%d %H:%M:%S") if entity.data_prevista_retirada else None,
            data_entrega_real=entity.data_entrega_real.strftime("%Y-%m-%d %H:%M:%S") if entity.data_entrega_real else None,
            criado_em=entity.criado_em.strftime("%Y-%m-%d %H:%M:%S") if entity.criado_em else "",
            itens=[ItemPedidoResponseDTO.from_entity(i) for i in entity.itens]
        )


@dataclass
class FiltroPedidoDTO:
    """Usado para montar a tela de histórico de vendas ou painel da oficina."""
    cliente_id: int | None = None
    status_pedido: str | None = None
    status_oficina: str | None = None
    apenas_atrasados: bool = False
    data_inicio: str | None = None
    data_fim: str | None = None