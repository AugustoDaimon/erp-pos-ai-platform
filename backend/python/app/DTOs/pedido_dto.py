from dataclasses import dataclass, asdict

# ==========================================
# DTO para CRIAÇÃO (Create)
# ==========================================
@dataclass
class CreatePedidoDTO:
    """Dados enviados pelo frontend no momento de finalizar a venda."""
    subtotal: float
    taxas_cartao: float = 0.0
    desconto: float = 0.0
    valor_pago: float = 0.0
    metodo_pagamento: str | None = None
    emitir_nota_fiscal: bool = False
    cliente_id: int | None = None
    status_pedido: str = 'CONCLUIDO'


# ==========================================
# DTO para ATUALIZAÇÃO (Update / PATCH)
# ==========================================
@dataclass
class UpdatePedidoDTO:
    """
    Geralmente usado para alterar o status de PENDENTE para CONCLUIDO ou CANCELADO,
    ou para registrar um pagamento atrasado.
    """
    status_pedido: str | None = None
    metodo_pagamento: str | None = None
    valor_pago: float | None = None
    emitir_nota_fiscal: bool | None = None

    def to_dict_exclude_none(self) -> dict:
        return {k: v for k, v in asdict(self).items() if v is not None}


# ==========================================
# DTO para FILTRO / BUSCA (List)
# ==========================================
@dataclass
class FiltroPedidoDTO:
    cliente_id: int | None = None
    status_pedido: str | None = None
    data_inicio: str | None = None
    data_fim: str | None = None
    limite: int = 50
    pagina: int = 1


# ==========================================
# DTO para LEITURA (Response)
# ==========================================
@dataclass
class PedidoResponseDTO:
    id: int
    cliente_id: int | None
    subtotal: float
    taxas_cartao: float
    desconto: float
    valor_total: float
    valor_pago: float
    troco: float # Campo calculado no DTO de resposta!
    metodo_pagamento: str | None
    emitir_nota_fiscal: bool
    status_pedido: str
    criado_em: str

    @classmethod
    def from_entity(cls, entity):
        data_str = entity.criado_em.strftime("%Y-%m-%d %H:%M:%S") if getattr(entity, 'criado_em', None) else ""
        
        # Calcula o troco apenas para a visualização
        troco_calculado = entity.valor_pago - entity.valor_total
        troco = troco_calculado if troco_calculado > 0 else 0.0

        return cls(
            id=entity.id,
            cliente_id=entity.cliente_id,
            subtotal=entity.subtotal,
            taxas_cartao=entity.taxas_cartao,
            desconto=entity.desconto,
            valor_total=entity.valor_total,
            valor_pago=entity.valor_pago,
            troco=troco,
            metodo_pagamento=entity.metodo_pagamento,
            emitir_nota_fiscal=entity.emitir_nota_fiscal,
            status_pedido=entity.status_pedido,
            criado_em=data_str
        )