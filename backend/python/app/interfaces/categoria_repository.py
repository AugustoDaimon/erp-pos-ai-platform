from abc import ABC, abstractmethod
from ..entities.categoria import Categoria

class ICategoriaRepository(ABC):

    @abstractmethod
    def get_by_id(self, id: int) -> Categoria | None:
        """Busca uma categoria pelo ID."""
        pass

    @abstractmethod
    def create(self, categoria: Categoria) -> Categoria:
        """Salva uma nova categoria no banco de dados."""
        pass

    @abstractmethod
    def list_all(self) -> list[Categoria]:
        """Retorna todas as categorias cadastradas."""
        pass

    @abstractmethod
    def update(self, categoria: Categoria) -> Categoria | None:
        """Atualiza os dados de uma categoria existente."""
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        """Remove uma categoria pelo ID."""
        pass

    @abstractmethod
    def get_by_nome(self, nome: str) -> Categoria | None:
        """Busca uma categoria pelo nome."""
        pass