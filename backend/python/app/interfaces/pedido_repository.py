from abc import ABC, abstractmethod
from typing import List, Optional
from ..entities.pedido import Pedido

class IPedidoRepository(ABC):
    @abstractmethod
    def create(self, pedido: Pedido) -> Pedido:
        pass

    @abstractmethod
    def update_status(self, pedido_id: int, novo_status: str) -> bool:
        pass
    
    @abstractmethod
    def find_by_id(self, pedido_id: int) -> Optional[Pedido]:
        pass

    @abstractmethod
    def find_by_cliente(self, cliente_id: int) -> List[Pedido]:
        pass

    @abstractmethod
    def list_by_status_oficina(self, status: str) -> List[Pedido]:
        pass

    @abstractmethod
    def list_atrasados(self) -> List[Pedido]:
        pass