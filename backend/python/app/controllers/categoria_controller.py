from flask import Blueprint, request, jsonify
from flasgger import swag_from
from pydantic import ValidationError
from dataclasses import asdict

# Importando as camadas da Categoria
from ..repositories.categoria_repository import CategoriaRepository
from ..services.categoria_service import (
    CategoriaService, 
    CategoriaNotFoundError, 
    InvalidCategoriaDataError,
    CategoriaAlreadyExistsError
)
from ..DTOs.categoria_dto import CreateCategoriaDTO, UpdateCategoriaDTO
from ..schemas.categoria_schema import CreateCategoriaRequest, UpdateCategoriaRequest, CategoriaResponse

# Inicialização do Blueprint e do Service
categoria_bp = Blueprint("categorias", __name__, url_prefix='/api/categorias')

# Instanciando o service injetando o repositório
categoria_service = CategoriaService(CategoriaRepository())


@categoria_bp.post("/")
@swag_from('docs/categoria/categoria_create.yml')
def criar_categoria():
    try:
        data = request.get_json()
        
        # 1. Validação com Pydantic
        schema = CreateCategoriaRequest(**data)

        # 2. Mapeamento para o DTO de Entrada
        dto = CreateCategoriaDTO(nome=schema.nome)
        
        # 3. Execução da Regra de Negócio
        resultado_dto = categoria_service.create_categoria(dto)
        
        # 4. Formatação da Resposta com Pydantic
        return jsonify(CategoriaResponse(**asdict(resultado_dto)).model_dump()), 201

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except InvalidCategoriaDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except CategoriaAlreadyExistsError as e:
        return jsonify({"erro_conflito": str(e)}), 409


@categoria_bp.get("/")
@swag_from('docs/categoria/categoria_list.yml')
def listar_categorias():
    categorias_dto = categoria_service.list_categorias()
    
    # Converte cada DTO do Service para o Schema de Resposta do Pydantic
    resposta = [CategoriaResponse(**asdict(c)).model_dump() for c in categorias_dto]
    return jsonify(resposta), 200


@categoria_bp.get("/<int:categoria_id>")
@swag_from('docs/categoria/categoria_search.yml')
def buscar_por_id(categoria_id: int):
    try:
        categoria_dto = categoria_service.get_categoria(categoria_id)
        return jsonify(CategoriaResponse(**asdict(categoria_dto)).model_dump()), 200
        
    except CategoriaNotFoundError as e:
        return jsonify({"erro": str(e)}), 404


@categoria_bp.put("/<int:categoria_id>")
@swag_from('docs/categoria/categoria_update.yml')
def atualizar_categoria(categoria_id: int):
    try:
        data = request.get_json()
        
        # Usamos o Schema de Update (onde os campos são opcionais)
        schema = UpdateCategoriaRequest(**data)

        # Mapeamos para o DTO de Update
        dto = UpdateCategoriaDTO(nome=schema.nome)
        
        categoria_dto = categoria_service.update_categoria(categoria_id, dto)
        return jsonify(CategoriaResponse(**asdict(categoria_dto)).model_dump()), 200

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except CategoriaNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except InvalidCategoriaDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except CategoriaAlreadyExistsError as e:
        return jsonify({"erro_conflito": str(e)}), 409


@categoria_bp.delete("/<int:categoria_id>")
@swag_from('docs/categoria/categoria_delete.yml')
def deletar_categoria(categoria_id: int):
    try:
        categoria_service.delete_categoria(categoria_id)
        return jsonify({"detail": "Categoria removida com sucesso"}), 200
    except CategoriaNotFoundError as e:
        return jsonify({"erro": str(e)}), 404