from abc import ABC, abstractmethod
from typing import List, Optional
from ..entities.item_pedido import ItemPedido

class IItemPedidoRepository(ABC):

    @abstractmethod
    def create(self, item_pedido: ItemPedido) -> ItemPedido:
        """Persiste um novo item vinculado a um pedido e ao catálogo."""
        pass

    @abstractmethod
    def update(self, item_pedido: ItemPedido) -> Optional[ItemPedido]:
        """Atualiza quantidades ou valores de um item de pedido existente."""
        pass

    @abstractmethod
    def delete(self, item_id: int) -> bool:
        """Remove um item específico. Retorna True se removido com sucesso."""
        pass

    @abstractmethod
    def find_by_id(self, item_id: int) -> Optional[ItemPedido]:
        """Busca um item de pedido específico pelo seu ID único."""
        pass

    @abstractmethod
    def list_by_pedido_id(self, pedido_id: int) -> List[ItemPedido]:
        """Busca todos os itens associados a um pedido (Útil para listagem rápida)."""
        pass

    @abstractmethod
    def list_all(self) -> List[ItemPedido]:
        """Lista todos os itens de pedidos do sistema (Geralmente para relatórios)."""
        pass