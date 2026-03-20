# domain/interfaces/image_search_service.py
from abc import ABC, abstractmethod
from typing import List
from ..entities.product_image import ProductImage

class IImageSearchService(ABC):
    @abstractmethod
    def search_images(self, query: str, count: int = 10) -> List[ProductImage]:
        """
        Busca imagens na internet baseada em uma descrição.
        Deve retornar uma lista de entidades ProductImage.
        """
        pass