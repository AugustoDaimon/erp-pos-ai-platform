from abc import ABC, abstractmethod
from typing import List, Optional
from ..entities.produto import Produto

class IProdutoRepository(ABC):
    @abstractmethod
    def create(self, produto: Produto) -> Produto:
        """Persiste um novo produto no catálogo pela primeira vez."""
        pass

    @abstractmethod
    def update(self, produto: Produto) -> Produto:
        """Atualiza os dados de um produto já existente."""
        pass

    @abstractmethod
    def delete(self, produto_id: int) -> bool:
        """Remove um produto do catálogo (cuidado com restrições de FK)."""
        pass

    @abstractmethod
    def find_by_id(self, produto_id: int) -> Optional[Produto]:
        """Busca um produto específico pelo ID."""
        pass

    @abstractmethod
    def find_by_sku(self, sku: str) -> Optional[Produto]:
        """Busca por código SKU/Código de barras."""
        pass

    @abstractmethod
    def list_all(self) -> List[Produto]:
        """Retorna a lista completa de produtos cadastrados."""
        pass

    @abstractmethod
    def update_estoque(self, produto_id: int, quantidade: int) -> bool:
        """Ajusta o saldo de estoque (positivo para entrada, negativo para saída)."""
        pass