from abc import ABC, abstractmethod
from ..entities.categoria import Categoria

class ICategoriaRepository(ABC):

    @abstractmethod
    def find_by_id(self, id: int) -> Categoria | None:
        pass

    @abstractmethod
    def create(self, categoria: Categoria) -> Categoria:
        pass

    @abstractmethod
    def list_all(self) -> list[Categoria]:
        pass

    @abstractmethod
    def update(self, categoria: Categoria) -> Categoria | None:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    @abstractmethod
    def get_by_nome(self, nome: str) -> Categoria | None:
        pass