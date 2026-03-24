from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from pydantic import ValidationError, BaseModel, Field
from flasgger import swag_from
from dataclasses import asdict
from typing import List
import os

# Importando as camadas da Clean Architecture
from ..infrastructure.adapter.linkup_search_adapter import LinkupSearchAdapter
from ..DTOs.search_product_images import SearchProductImagesUseCase

# Configurações (Idealmente via decouple ou os.environ)
load_dotenv()
LINKUP_API_KEY = os.getenv("LINKUP_API_KEY")
image_search_bp = Blueprint("image_search", __name__, url_prefix='/api/images')

# Instanciando as dependências seguindo o fluxo da Clean Arch
# O Adapter implementa a interface, o UseCase recebe o adapter.
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

        imagens_entidades = search_use_case.execute(schema.description)
        
        resposta = [
            {
                "url": img.url,
                "title": img.title
            } for img in imagens_entidades
        ]
        
        return jsonify(resposta), 200

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except Exception as e:
        # Tratamento genérico para erros da API do Google ou de rede
        return jsonify({"erro_servico_externo": str(e)}), 502