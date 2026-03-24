from flask import Blueprint, request, jsonify
from flasgger import swag_from 

from ..repositories.item_catalogo_repository import ItemCatalogoRepository
from ..schemas.item_catalogo_schema import ItemCatalogoResponse

catalogo_bp = Blueprint("catalogo", __name__, url_prefix='/api/catalogo')

# Como é só uma busca simples (sem regras de negócio complexas como baixar estoque),
# em muitas arquiteturas Clean, é aceitável o Controller chamar o Repo de leitura diretamente,
# ou usar um Serviço bem fino (CatalogoService) só de leitura. Vamos instanciar o Repo.
catalogo_repo = ItemCatalogoRepository()

@catalogo_bp.get("/busca")
@swag_from('docs/catalogo/catalogo_busca.yml')
def buscar_itens_pdv():
    """
    Rota estrela do PDV. 
    Busca peças e serviços ao mesmo tempo para o autocomplete do carrinho.
    Exemplo: GET /api/catalogo/busca?q=freio
    """
    termo_busca = request.args.get('q', type=str, default="")
    
    if len(termo_busca) < 2:
        # Evita buscar o banco inteiro se o usuário digitou só 1 letra
        return jsonify([]), 200

    # Retorna uma lista de Entities 'ItemCatalogo' (misturando produtos e serviços)
    itens_entity = catalogo_repo.search_by_nome(termo_busca)
    
    # Converte as Entities para o Schema do Pydantic (que inclui id, nome, preco, tipo)
    # Como as entities não são dicts, passamos o objeto usando from_attributes=True no Schema
    resposta = [ItemCatalogoResponse.model_validate(item).model_dump() for item in itens_entity]
    
    return jsonify(resposta), 200