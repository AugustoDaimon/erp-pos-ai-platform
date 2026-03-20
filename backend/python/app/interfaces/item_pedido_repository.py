from abc import ABC, abstractmethod
from ..entities import ItemPedido

class IItemPedidoRepository(ABC):

    @abstractmethod
    def get_by_id(self, id: int) -> ItemPedido | None:
        pass

    @abstractmethod
    def create(self, item_pedido: ItemPedido) -> ItemPedido:
        pass

    @abstractmethod
    def list_all(self) -> list[ItemPedido]:
        pass

    @abstractmethod
    def update(self, item_pedido: ItemPedido) -> ItemPedido:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    # Domain-specific method: Highly recommended for this specific entity
    @abstractmethod
    def list_by_pedido_id(self, pedido_id: int) -> list[ItemPedido]:
        """Fetches all items associated with a specific order."""
        pass