# infrastructure/adapters/linkup_search_adapter.py
import json
import sys
from typing import List
from ...entities.product_image import ProductImage
from ...interfaces.image_search_service import IImageSearchService
from linkup import LinkupClient

class LinkupSearchAdapter(IImageSearchService):
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("LINKUP_API_KEY não configurada no ambiente.")
        self.client = LinkupClient(api_key)

    def search_images(self, search_query: str, count: int = 10) -> List[ProductImage]:
        try:
            response = self.client.search(
                query= search_query,
                depth= "standard",
                output_type= "searchResults",
                include_images= True
            )

            data = response.json()
            if isinstance(data, str):
                data = json.loads(data)
            print(f">>> DEBUG JSON BRUTO: {json.dumps(data, indent=2)}", file=sys.stderr, flush=True)
            
            raw_results = data.get("results", [])
            print(f">>> DEBUG QUANTIDADE TOTAL: {len(raw_results)} itens encontrados", file=sys.stderr, flush=True)

            product_images = []
            for item in raw_results:
                if item.get("type") == "image":
                    # 1. Pegamos o título bruto
                    titulo_bruto = item.get("name", "Imagem do Produto")
                    
                    # 2. Cortamos para no máximo 100 caracteres (com '...' no final se for maior)
                    if len(titulo_bruto) > 100:
                        titulo_seguro = titulo_bruto[:97] + "..."
                    else:
                        titulo_seguro = titulo_bruto

                    # 3. Instanciamos a entidade com o título seguro
                    image_entity = ProductImage(
                        url=item.get("url"),
                        titulo=titulo_seguro
                    )
                    product_images.append(image_entity)
                
                if len(product_images) >= count:
                    break
            print(f">>> DEBUG FINAL: {len(product_images)} entidades ProductImage criadas", file=sys.stderr, flush=True)
            return product_images

        except Exception as e:
            print(">>> ERRO CRÍTICO NO ADAPTER:", e, file=sys.stderr, flush=True)
            return []