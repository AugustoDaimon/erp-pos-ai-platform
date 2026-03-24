from abc import ABC, abstractmethod
from typing import List, Optional
from ..entities.item_catalogo import ItemCatalogo

class IItemCatalogoRepository(ABC):
    @abstractmethod
    def find_by_id(self, item_id: int) -> Optional[ItemCatalogo]:
        pass

    @abstractmethod
    def search_by_nome(self, nome: str) -> List[ItemCatalogo]:
        pass