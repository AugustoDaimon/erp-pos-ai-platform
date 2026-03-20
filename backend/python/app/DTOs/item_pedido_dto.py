from dataclasses import dataclass, asdict

# ==========================================
# DTO para CRIAÇÃO (Create)
# ==========================================
@dataclass
class CreateItemPedidoDTO:
    """
    Nota: O 'valor_total' NÃO vem do frontend. 
    Ele será calculado pelo Service multiplicando quantidade * valor_unitario.
    """
    produto_id: int
    quantidade: int
    valor_unitario: float
    pedido_id: int | None = None # Pode ser None se o pedido ainda estiver sendo montado na memória


# ==========================================
# DTO para ATUALIZAÇÃO (Update / PATCH)
# ==========================================
@dataclass
class UpdateItemPedidoDTO:
    """Geralmente usado quando o usuário altera a quantidade no carrinho."""
    quantidade: int | None = None
    valor_unitario: float | None = None

    def to_dict_exclude_none(self) -> dict:
        return {k: v for k, v in asdict(self).items() if v is not None}


# ==========================================
# DTO para LEITURA (Response)
# ==========================================
@dataclass
class ItemPedidoResponseDTO:
    id: int
    pedido_id: int | None
    produto_id: int
    quantidade: int
    valor_unitario: float
    valor_total: float
    criado_em: str

    @classmethod
    def from_entity(cls, entity):
        data_str = entity.criado_em.strftime("%Y-%m-%d %H:%M:%S") if getattr(entity, 'criado_em', None) else ""
        return cls(
            id=entity.id,
            pedido_id=entity.pedido_id,
            produto_id=entity.produto_id,
            quantidade=entity.quantidade,
            valor_unitario=entity.valor_unitario,
            valor_total=entity.valor_total,
            criado_em=data_str
        )