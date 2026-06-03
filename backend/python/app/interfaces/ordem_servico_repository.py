from abc import ABC, abstractmethod
from typing import List, Optional
from datetime import datetime
from ..entities.ordem_servico import OrdemServico, StatusOrdemServico

class IOrdemServicoRepository(ABC):
    
    @abstractmethod
    def create(self, ordem_servico: OrdemServico) -> OrdemServico:
        pass

    @abstractmethod
    def update(self, ordem_servico: OrdemServico) -> Optional[OrdemServico]:
        pass

    @abstractmethod
    def delete(self, ordem_servico_id: int) -> bool:
        pass

    @abstractmethod
    def find_by_id(self, ordem_servico_id: int) -> Optional[OrdemServico]:
        pass

    @abstractmethod
    def list_all(self) -> List[OrdemServico]:
        pass

    @abstractmethod
    def find_by_pedido_id(self, pedido_id: int) -> List[OrdemServico]:
        pass

    @abstractmethod
    def find_by_status(self, status: StatusOrdemServico) -> List[OrdemServico]:
        pass

    @abstractmethod
    def find_by_period(self, data_inicio: datetime, data_fim: datetime) -> List[OrdemServico]:
        pass