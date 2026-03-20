# infrastructure/adapters/google_search_adapter.py
import requests
from typing import List
from ...entities.product_image import ProductImage
from ...interfaces.image_search_service import IImageSearchService

class GoogleCustomSearchAdapter(IImageSearchService):
    def __init__(self, api_key: str, search_engine_id: str):
        self.api_key = api_key
        self.cx = search_engine_id
        self.base_url = "https://www.googleapis.com/customsearch/v1"

    def search_images(self, query: str, count: int = 10) -> List[ProductImage]:
        params = {
            'q': query,
            'cx': self.cx,
            'key': self.api_key,
            'searchType': 'image',
            'num': count  # O Google permite de 1 a 10 por requisição
        }

        response = requests.get(self.base_url, params=params)
        
        if response.status_code != 200:
            # Aqui você poderia tratar erros específicos (quota excedida, etc)
            return []

        data = response.json()
        items = data.get('items', [])

        # O segredo da Clean Architecture: O Mapeamento
        # Transformamos o JSON do Google na nossa Entidade de Domínio
        product_images = []
        for item in items:
            image = ProductImage(
                url=item.get('link'),
                thumbnail_url=item.get('image', {}).get('thumbnailLink'),
                title=item.get('title')
            )
            product_images.append(image)

        return product_images