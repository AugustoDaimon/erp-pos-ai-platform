from abc import ABC, abstractmethod
from typing import List, Optional
from ..entities.item_pedido import ItemPedido

class IItemPedidoRepository(ABC):

    @abstractmethod
    def create(self, item_pedido: ItemPedido) -> ItemPedido:
        pass

    @abstractmethod
    def update(self, item_pedido: ItemPedido) -> Optional[ItemPedido]:
        pass

    @abstractmethod
    def delete(self, item_id: int) -> bool:
        pass

    @abstractmethod
    def find_by_id(self, item_id: int) -> Optional[ItemPedido]:
        pass

    @abstractmethod
    def list_by_pedido_id(self, pedido_id: int) -> List[ItemPedido]:
        pass

    @abstractmethod
    def list_all(self) -> List[ItemPedido]:
        pass