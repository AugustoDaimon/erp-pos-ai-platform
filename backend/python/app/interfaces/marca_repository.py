from abc import ABC, abstractmethod
from ..entities.marca import Marca

class IMarcaRepository(ABC):
    @abstractmethod
    def find_by_id(self, id: int) -> Marca | None: pass

    @abstractmethod
    def get_by_nome(self, nome: str) -> Marca | None: pass

    @abstractmethod
    def create(self, marca: Marca) -> Marca: pass

    @abstractmethod
    def list_all(self) -> list[Marca]: pass

    @abstractmethod
    def update(self, marca: Marca) -> Marca | None: pass

    @abstractmethod
    def delete(self, id: int) -> None: pass