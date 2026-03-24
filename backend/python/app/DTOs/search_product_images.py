# Here an Use Case seemed better than a DTO, since it is really an use case and not a data transfer object

# application/use_cases/search_product_images.py
from typing import List
from ..interfaces.image_search_service import IImageSearchService
from ..entities.product_image import ProductImage

class SearchProductImagesUseCase:
    def __init__(self, image_service: IImageSearchService):
        # Injeção de Dependência: recebemos a interface, não a implementação
        self.image_service = image_service

    def execute(self, product_description: str) -> List[ProductImage]:
        # 1. Validação de Regra de Negócio Simples
        if not product_description:
            # Poderíamos lançar uma exceção customizada aqui
            return ["ERROR"]

        # 2. Chamada ao serviço (Abstração)
        # O Use Case não sabe se isso bate no Google, Bing ou um Mock de teste
        images = self.image_service.search_images(
            search_query=product_description, 
            count=10
        )

        return images