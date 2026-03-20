from flask import Blueprint, request, jsonify
from pydantic import ValidationError, BaseModel, Field
from flasgger import swag_from
from dataclasses import asdict
from typing import List

# Importando as camadas da Clean Architecture
from ..adapters.google_search_adapter import GoogleCustomSearchAdapter
from ..use_cases.search_product_images import SearchProductImagesUseCase

# Configurações (Idealmente via decouple ou os.environ)
# TODO CHANGE CREDENTIALS 
API_KEY = "SUA_CHAVE_GOOGLE"
CX_ID = "SEU_CX_ID"

image_search_bp = Blueprint("image_search", __name__, url_prefix='/api/images')

# Instanciando as dependências seguindo o fluxo da Clean Arch
# O Adapter implementa a interface, o UseCase recebe o adapter.
image_service = GoogleCustomSearchAdapter(API_KEY, CX_ID)
search_use_case = SearchProductImagesUseCase(image_service)

# --- Schemas de Validação (Pydantic) ---

class ImageSearchRequest(BaseModel):
    description: str = Field(..., min_length=3, description="Descrição do produto para busca")

class ImageResponse(BaseModel):
    url: str
    thumbnail_url: str
    title: str

# --- Rota ---

@image_search_bp.post("/search")
@swag_from('docs/images/image_search.yml') # Lembre de criar o arquivo .yml
def pesquisar_imagens():
    try:
        data = request.get_json()
        # Validação do Schema
        schema = ImageSearchRequest(**data)
        
        # Execução do Use Case
        # Note que o Use Case retorna entidades de domínio (ProductImage)
        imagens_entidades = search_use_case.execute(schema.description)
        
        # Transformação das Entidades para o Schema de Resposta (Serialização)
        # Usamos list comprehension para converter a lista de objetos
        resposta = [
            ImageResponse(
                url=img.url, 
                thumbnail_url=img.thumbnail_url, 
                title=img.title
            ).model_dump() 
            for img in imagens_entidades
        ]
        
        return jsonify(resposta), 200

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except Exception as e:
        # Tratamento genérico para erros da API do Google ou de rede
        return jsonify({"erro_servico_externo": str(e)}), 502