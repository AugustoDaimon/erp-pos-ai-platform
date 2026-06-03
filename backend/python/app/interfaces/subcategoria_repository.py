from abc import ABC, abstractmethod
from ..entities.subcategoria import Subcategoria

class ISubcategoriaRepository(ABC):

    @abstractmethod
    def find_by_id(self, id: int) -> Subcategoria | None:
        pass

    @abstractmethod
    def create(self, subcategoria: Subcategoria) -> Subcategoria:
        pass

    @abstractmethod
    def list_all(self) -> list[Subcategoria]:
        pass

    @abstractmethod
    def update(self, subcategoria: Subcategoria) -> Subcategoria | None:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    @abstractmethod
    def get_by_nome_e_categoria(self, nome: str, categoria_id: int) -> Subcategoria | None:
        """Busca se já existe uma subcategoria com este nome DENTRO da mesma categoria pai."""
        pass