from abc import ABC, abstractmethod
from ..entities.produto import Produto

class IProdutoRepository(ABC):
    @abstractmethod
    def get_by_id(self, id: int) -> Produto | None: pass

    @abstractmethod
    def get_by_sku(self, sku: str) -> Produto | None: pass

    @abstractmethod
    def create(self, produto: Produto) -> Produto: pass

    @abstractmethod
    def list_all(self) -> list[Produto]: pass

    @abstractmethod
    def update(self, produto: Produto) -> Produto | None: pass

    @abstractmethod
    def delete(self, id: int) -> None: pass