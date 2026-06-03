from flask import Blueprint, request, jsonify
from flasgger import swag_from 

from ..repositories.item_catalogo_repository import ItemCatalogoRepository
from ..schemas.item_catalogo_schema import ItemCatalogoResponse

catalogo_bp = Blueprint("catalogo", __name__, url_prefix='/api/catalogo')

catalogo_repo = ItemCatalogoRepository()

@catalogo_bp.get("/busca")
@swag_from('docs/catalogo/catalogo_busca.yml')
def buscar_itens_pdv():
    termo_busca = request.args.get('q', type=str, default="")
    
    if len(termo_busca) < 2:
        # Evita buscar o banco inteiro se o usuário digitou só 1 letra
        return jsonify([]), 200

    itens_entity = catalogo_repo.search_by_nome(termo_busca)
    resposta = [ItemCatalogoResponse.model_validate(item).model_dump() for item in itens_entity]
    
    return jsonify(resposta), 200