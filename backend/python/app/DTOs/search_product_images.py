from typing import List
from ..interfaces.image_search_service import IImageSearchService
from ..entities.product_image import ProductImage

class SearchProductImagesUseCase:
    def __init__(self, image_service: IImageSearchService):
        self.image_service = image_service

    def execute(self, product_description: str) -> List[ProductImage]:
        if not product_description:
            return ["ERROR"]

        images = self.image_service.search_images(
            search_query=product_description, 
            count=10
        )

        return images