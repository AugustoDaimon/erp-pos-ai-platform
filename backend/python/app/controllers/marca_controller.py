from flask import Blueprint, request, jsonify
from flasgger import swag_from
from pydantic import ValidationError
from dataclasses import asdict

from ..repositories.marca_repository import MarcaRepository
from ..repositories.categoria_repository import CategoriaRepository
from ..services.marca_service import (
    MarcaService, 
    MarcaNotFoundError, 
    InvalidMarcaDataError,
    MarcaAlreadyExistsError,
    CategoriasInvalidasError
)
from ..DTOs.marca_dto import CreateMarcaDTO, UpdateMarcaDTO
from ..schemas.marca_schema import CreateMarcaRequest, UpdateMarcaRequest, MarcaResponse

marca_bp = Blueprint("marcas", __name__, url_prefix='/api/marcas')

# Instanciando o service com os DOIS repositórios
marca_service = MarcaService(MarcaRepository(), CategoriaRepository())

@marca_bp.post("/")
@swag_from('docs/marca/marca_create.yml')
def criar_marca():
    try:
        data = request.get_json()
        schema = CreateMarcaRequest(**data)
        
        dto = CreateMarcaDTO(
            nome=schema.nome,
            categorias_vinculadas=schema.categorias_vinculadas
        )
        resultado_dto = marca_service.create_marca(dto)
        
        return jsonify(MarcaResponse(**asdict(resultado_dto)).model_dump()), 201

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except CategoriasInvalidasError as e:
        return jsonify({"erro_relacionamento": str(e)}), 422
    except InvalidMarcaDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except MarcaAlreadyExistsError as e:
        return jsonify({"erro_conflito": str(e)}), 409

@marca_bp.get("/")
@swag_from('docs/marca/marca_list.yml')
def listar_marcas():
    marcas_dto = marca_service.list_marcas()
    resposta = [MarcaResponse(**asdict(m)).model_dump() for m in marcas_dto]
    return jsonify(resposta), 200

@marca_bp.get("/<int:marca_id>")
@swag_from('docs/marca/marca_search.yml')
def buscar_por_id(marca_id: int):
    try:
        marca_dto = marca_service.get_marca(marca_id)
        return jsonify(MarcaResponse(**asdict(marca_dto)).model_dump()), 200
    except MarcaNotFoundError as e:
        return jsonify({"erro": str(e)}), 404

@marca_bp.put("/<int:marca_id>")
@swag_from('docs/marca/marca_update.yml')
def atualizar_marca(marca_id: int):
    try:
        data = request.get_json()
        schema = UpdateMarcaRequest(**data)
        
        dto = UpdateMarcaDTO(
            nome=schema.nome,
            categorias_vinculadas=schema.categorias_vinculadas
        )
        
        marca_dto = marca_service.update_marca(marca_id, dto)
        return jsonify(MarcaResponse(**asdict(marca_dto)).model_dump()), 200

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except MarcaNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except CategoriasInvalidasError as e:
        return jsonify({"erro_relacionamento": str(e)}), 422
    except InvalidMarcaDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except MarcaAlreadyExistsError as e:
        return jsonify({"erro_conflito": str(e)}), 409

@marca_bp.delete("/<int:marca_id>")
@swag_from('docs/marca/marca_delete.yml')
def deletar_marca(marca_id: int):
    try:
        marca_service.delete_marca(marca_id)
        return jsonify({"detail": "Marca removida com sucesso"}), 200
    except MarcaNotFoundError as e:
        return jsonify({"erro": str(e)}), 404