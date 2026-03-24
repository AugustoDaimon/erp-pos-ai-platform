from abc import ABC, abstractmethod
from typing import List, Optional
from ..entities.pedido import Pedido

class IPedidoRepository(ABC):
    @abstractmethod
    def create(self, pedido: Pedido) -> Pedido:
        """Cria um novo pedido/OS e seus itens vinculados."""
        pass

    @abstractmethod
    def update_status(self, pedido_id: int, novo_status: str) -> bool:
        """Atualiza apenas o status (ex: de PENDENTE para CONCLUIDO)."""
        pass
    
    @abstractmethod
    def find_by_id(self, pedido_id: int) -> Optional[Pedido]:
        pass

    @abstractmethod
    def find_by_cliente(self, cliente_id: int) -> List[Pedido]:
        """Histórico de compras/serviços de um cliente específico."""
        pass

    @abstractmethod
    def list_by_status_oficina(self, status: str) -> List[Pedido]:
        """Útil para o Dashboard da oficina (ex: buscar todos em 'MANUTENCAO')."""
        pass

    @abstractmethod
    def list_atrasados(self) -> List[Pedido]:
        """Busca pedidos onde data_prevista_retirada < hoje e não foram entregues."""
        pass