from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from pydantic import ValidationError, BaseModel, Field
from flasgger import swag_from
import os
from ..infrastructure.adapter.linkup_search_adapter import LinkupSearchAdapter
from ..DTOs.search_product_images import SearchProductImagesUseCase

load_dotenv()
LINKUP_API_KEY = os.getenv("LINKUP_API_KEY")
image_search_bp = Blueprint("image_search", __name__, url_prefix='/api/images')

image_service = LinkupSearchAdapter(LINKUP_API_KEY)
search_use_case = SearchProductImagesUseCase(image_service)

class ImageSearchRequest(BaseModel):
    description: str = Field(..., min_length=3, description="Descrição do produto para busca")

class ImageResponse(BaseModel):
    url: str
    title: str

@image_search_bp.post("/search")
@swag_from('docs/images/image_search.yml')
def pesquisar_imagens():
    try:
        data = request.get_json()
        schema = ImageSearchRequest(**data)

        # Chama a camada de caso de uso
        imagens_entidades = search_use_case.execute(schema.description)
        
        # Prevenção caso o use_case retorne None por acidente
        if not imagens_entidades:
            return jsonify([]), 200
        
        resposta = []
        for img in imagens_entidades:
            resposta.append({
                "url": getattr(img, 'url', ''),
                # Fallback inteligente: tenta ler 'titulo', se não existir, tenta 'title'
                "title": getattr(img, 'titulo', getattr(img, 'title', 'Imagem do Produto'))
            })
        
        return jsonify(resposta), 200

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except Exception as e:
        # Imprime o erro real no terminal do Flask para facilitar o debug
        print(f"ERRO NO CONTROLLER DE IMAGENS: {e}")
        return jsonify({"erro_servico_externo": str(e)}), 502