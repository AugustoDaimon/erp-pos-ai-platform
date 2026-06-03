from abc import ABC, abstractmethod
from typing import List, Optional
from ..entities.servico import Servico

class IServicoRepository(ABC):
    
    @abstractmethod
    def create(self, servico: Servico) -> Servico:
        pass

    @abstractmethod
    def update(self, servico: Servico) -> Optional[Servico]:
        pass

    @abstractmethod
    def delete(self, servico_id: int) -> bool:
        pass

    @abstractmethod
    def find_by_id(self, servico_id: int) -> Optional[Servico]:
        pass

    @abstractmethod
    def list_all(self) -> List[Servico]:
        pass