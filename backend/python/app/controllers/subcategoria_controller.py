from flask import Blueprint, request, jsonify
from flasgger import swag_from # type: ignore
from pydantic import ValidationError
from dataclasses import asdict

from ..repositories.subcategoria_repository import SubcategoriaRepository
from ..repositories.categoria_repository import CategoriaRepository
from ..services.subcategoria_service import (
    SubcategoriaService, 
    SubcategoriaNotFoundError, 
    InvalidSubcategoriaDataError,
    SubcategoriaAlreadyExistsError,
    CategoriaPaiNotFoundError
)
from ..DTOs.subcategoria_dto import CreateSubcategoriaDTO, UpdateSubcategoriaDTO
from ..schemas.subcategoria_schema import CreateSubcategoriaRequest, UpdateSubcategoriaRequest, SubcategoriaResponse

subcategoria_bp = Blueprint("subcategorias", __name__, url_prefix='/api/subcategorias')

subcategoria_service = SubcategoriaService(SubcategoriaRepository(), CategoriaRepository())

@subcategoria_bp.post("/")
@swag_from('docs/subcategoria/subcategoria_create.yml')
def criar_subcategoria():
    try:
        data = request.get_json()
        schema = CreateSubcategoriaRequest(**data)
        dto = CreateSubcategoriaDTO(categoria_id=schema.categoria_id, nome=schema.nome)
        resultado_dto = subcategoria_service.create_subcategoria(dto)
        
        return jsonify(SubcategoriaResponse(**asdict(resultado_dto)).model_dump()), 201

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except CategoriaPaiNotFoundError as e:
        return jsonify({"erro_relacionamento": str(e)}), 422
    except InvalidSubcategoriaDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except SubcategoriaAlreadyExistsError as e:
        return jsonify({"erro_conflito": str(e)}), 409

@subcategoria_bp.get("/")
@swag_from('docs/subcategoria/subcategoria_list.yml')
def listar_subcategorias():
    subcategorias_dto = subcategoria_service.list_subcategorias()
    resposta = [SubcategoriaResponse(**asdict(s)).model_dump() for s in subcategorias_dto]
    return jsonify(resposta), 200

@subcategoria_bp.get("/<int:subcategoria_id>")
@swag_from('docs/subcategoria/subcategoria_search.yml')
def buscar_por_id(subcategoria_id: int):
    try:
        subcategoria_dto = subcategoria_service.get_subcategoria(subcategoria_id)
        return jsonify(SubcategoriaResponse(**asdict(subcategoria_dto)).model_dump()), 200
    except SubcategoriaNotFoundError as e:
        return jsonify({"erro": str(e)}), 404

@subcategoria_bp.put("/<int:subcategoria_id>")
@swag_from('docs/subcategoria/subcategoria_update.yml')
def atualizar_subcategoria(subcategoria_id: int):
    try:
        data = request.get_json()
        schema = UpdateSubcategoriaRequest(**data)
        dto = UpdateSubcategoriaDTO(categoria_id=schema.categoria_id, nome=schema.nome)
        
        subcategoria_dto = subcategoria_service.update_subcategoria(subcategoria_id, dto)
        return jsonify(SubcategoriaResponse(**asdict(subcategoria_dto)).model_dump()), 200

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except SubcategoriaNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except CategoriaPaiNotFoundError as e:
        return jsonify({"erro_relacionamento": str(e)}), 422
    except InvalidSubcategoriaDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except SubcategoriaAlreadyExistsError as e:
        return jsonify({"erro_conflito": str(e)}), 409

@subcategoria_bp.delete("/<int:subcategoria_id>")
@swag_from('docs/subcategoria/subcategoria_delete.yml')
def deletar_subcategoria(subcategoria_id: int):
    try:
        subcategoria_service.delete_subcategoria(subcategoria_id)
        return jsonify({"detail": "Subcategoria removida com sucesso"}), 200
    except SubcategoriaNotFoundError as e:
        return jsonify({"erro": str(e)}), 404