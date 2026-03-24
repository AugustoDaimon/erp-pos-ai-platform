from ..entities.item_catalogo import ItemCatalogo

class ItemPedido:
    def __init__(
        self,
        item_id: int,
        quantidade: int,
        valor_unitario: float,
        id: int | None = None,
        pedido_id: int | None = None,
        valor_total: float | None = None,
        item: ItemCatalogo | None = None
    ):
        self.id = id
        self.pedido_id = pedido_id
        self.item_id = item_id
        self.quantidade = quantidade
        self.valor_unitario = valor_unitario
        self.item = item # Objeto opcional para carregar detalhes (nome, imagem)
        
        # Se não informamos o total, calculamos na hora
        self.valor_total = valor_total or (quantidade * valor_unitario)

    def __repr__(self):
        return f"<ItemPedido: {self.quantidade}x ID {self.item_id} (Total: R$ {self.valor_total})>"