from abc import ABC, abstractmethod
from typing import List, Optional
from ..entities.produto import Produto

class IProdutoRepository(ABC):
    @abstractmethod
    def create(self, produto: Produto) -> Produto:
        pass

    @abstractmethod
    def update(self, produto: Produto) -> Produto:
        pass

    @abstractmethod
    def delete(self, produto_id: int) -> bool:
        pass

    @abstractmethod
    def find_by_id(self, produto_id: int) -> Optional[Produto]:
        pass

    @abstractmethod
    def find_by_sku(self, sku: str) -> Optional[Produto]:
        pass

    @abstractmethod
    def list_all(self) -> List[Produto]:
        pass

    @abstractmethod
    def update_estoque(self, produto_id: int, quantidade: int) -> bool:
        pass