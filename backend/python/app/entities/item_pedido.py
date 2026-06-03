from ..entities.item_catalogo import ItemCatalogo

class ItemPedido:
    """Entidade de domínio que representa uma linha de item (Produto, Bicicleta ou Serviço) dentro de um pedido.

    Attributes:
        id (int | None): Identificador único da linha do pedido.
        pedido_id (int | None): Referência ao Pedido ao qual o item pertence.
        item_id (int): Referência ao ItemCatalogo (produto, bicicleta ou serviço) vendido.
        quantidade (int): Quantidade vendida. Deve ser maior que zero.
        valor_unitario (float): Preço unitário no momento da venda.
        valor_total (float): Valor total da linha. Calculado automaticamente ou recebido do banco.
        item (ItemCatalogo | None): Objeto aninhado opcional para carregar detalhes do item.
    """

    def __init__(
            self,
            item_id: int,
            quantidade: int,
            valor_unitario: float,
            id: int | None = None,
            pedido_id: int | None = None,
            valor_total: float | None = None,
            item: ItemCatalogo | None = None):
        self.id = id
        self.pedido_id = pedido_id
        self.item = item
        self.item_id = item_id
        self.quantidade = quantidade
        self.valor_unitario = valor_unitario
        if valor_total is not None:         # Preserva o valor_total se existe no banco de dados
            self._valor_total = float(valor_total)

    # Encapsulamento de Item ID
    @property
    def item_id(self) -> int:
        return self._item_id

    @item_id.setter
    def item_id(self, valor: int):
        if not valor or int(valor) <= 0:
            raise ValueError("O ID do item de catálogo é obrigatório.")
        self._item_id = int(valor)

    # Encapsulamento de Quantidade
    @property
    def quantidade(self) -> int:
        return self._quantidade

    @quantidade.setter
    def quantidade(self, valor: int):
        try:
            qtd = int(valor)
        except (TypeError, ValueError):
            raise ValueError("A quantidade deve ser um número inteiro válido.")
            
        if qtd <= 0:
            raise ValueError("A quantidade vendida deve ser no mínimo 1.")
            
        self._quantidade = qtd
        self._recalcular_total()

    # Encapsulamento de Valor Unitário
    @property
    def valor_unitario(self) -> float:
        return self._valor_unitario

    @valor_unitario.setter
    def valor_unitario(self, valor: float):
        try:
            val = float(valor)
        except (TypeError, ValueError):
            raise ValueError("O valor unitário deve ser numérico.")
            
        if val < 0:
            raise ValueError("O valor unitário não pode ser negativo.")
            
        self._valor_unitario = val
        self._recalcular_total()

    # Encapsulamento e Cálculo do Valor Total
    @property
    def valor_total(self) -> float:
        return self._valor_total

    def _recalcular_total(self):
        if hasattr(self, '_quantidade') and hasattr(self, '_valor_unitario'):
            self._valor_total = self._quantidade * self._valor_unitario

    def __repr__(self) -> str:
        return f"<ItemPedido: {self.quantidade}x ID {self.item_id} (Total: R$ {self.valor_total:.2f})>"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, ItemPedido):
            return False
            
        return (
            self.id == other.id and
            self.pedido_id == other.pedido_id and
            self.item_id == other.item_id and
            self.quantidade == other.quantidade and
            self.valor_unitario == other.valor_unitario
        )