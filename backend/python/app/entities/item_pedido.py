from datetime import datetime

class ItemPedido:
    def __init__(
            self, 
            produto_id: int,
            quantidade: int,
            valor_unitario: float,
            valor_total: float,
            pedido_id: int | None = None,
            id: int | None = None,
            criado_em: datetime | None = None
        ):

        self.id = id
        self.pedido_id = pedido_id
        self.produto_id = produto_id
        self.quantidade = quantidade
        self.valor_unitario = valor_unitario
        self.valor_total = valor_total
        self.criado_em = criado_em

    def __repr__(self):
        return f"<ItemPedido {self.id or 'Novo'} - Produto ID {self.produto_id} x{self.quantidade}>"