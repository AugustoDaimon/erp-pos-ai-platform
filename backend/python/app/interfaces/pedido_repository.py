from abc import ABC, abstractmethod
from ..entities import Pedido

class IPedidoRepository(ABC):

    @abstractmethod
    def get_by_id(self, id: int) -> Pedido | None:
        pass

    @abstractmethod
    def create(self, pedido: Pedido) -> Pedido:
        pass

    @abstractmethod
    def list_all(self) -> list[Pedido]:
        pass

    @abstractmethod
    def update(self, pedido: Pedido) -> Pedido:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass