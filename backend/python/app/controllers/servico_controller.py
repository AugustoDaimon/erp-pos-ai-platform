from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from flasgger import swag_from 
from dataclasses import asdict

from ..repositories.servico_repository import ServicoRepository

from ..services.servico_service import (
    ServicoService, 
    ServicoNotFoundError, 
    InvalidServicoDataError
)
from ..DTOs.servico_dto import CreateServicoDTO, UpdateServicoDTO, FiltroServicoDTO
from ..schemas.servico_schema import CreateServicoRequest, UpdateServicoRequest, ServicoResponse

servico_bp = Blueprint("servicos", __name__, url_prefix='/api/servicos')

servico_service = ServicoService(ServicoRepository())

@servico_bp.post("/")
@swag_from('docs/servico/servico_create.yml')
def criar_servico():
    try:
        data = request.get_json()
        schema = CreateServicoRequest(**data)
        dto = CreateServicoDTO(**schema.model_dump())
        resultado_dto = servico_service.create_servico(dto)
    
        return jsonify(ServicoResponse(**asdict(resultado_dto)).model_dump()), 201

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except InvalidServicoDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500

@servico_bp.get("/")
@swag_from('docs/servico/servico_list.yml')
def listar_servicos():
    filtro = FiltroServicoDTO(
        busca_descricao=request.args.get('busca', type=str)
    )
    
    servicos_dto = servico_service.list_servicos(filtro)
    resposta = [ServicoResponse(**asdict(s)).model_dump() for s in servicos_dto]
    return jsonify(resposta), 200

@servico_bp.get("/<int:servico_id>")
@swag_from('docs/servico/servico_search.yml')
def buscar_por_id(servico_id: int):
    try:
        servico_dto = servico_service.get_servico(servico_id)
        return jsonify(ServicoResponse(**asdict(servico_dto)).model_dump()), 200
    except ServicoNotFoundError as e:
        return jsonify({"erro": str(e)}), 404

@servico_bp.route("/<int:servico_id>", methods=['PUT', 'PATCH'])
@swag_from('docs/servico/servico_update.yml')
def atualizar_servico(servico_id: int):
    try:
        data = request.get_json()
        
        schema = UpdateServicoRequest(**data)
        dto = UpdateServicoDTO(**schema.model_dump(exclude_unset=True))
        
        servico_dto = servico_service.update_servico(servico_id, dto)
        return jsonify(ServicoResponse(**asdict(servico_dto)).model_dump()), 200

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except ServicoNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except InvalidServicoDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500

@servico_bp.delete("/<int:servico_id>")
@swag_from('docs/servico/servico_delete.yml')
def deletar_servico(servico_id: int):
    try:
        servico_service.delete_servico(servico_id)
        return jsonify({"detail": "Serviço removido com sucesso"}), 200
    except ServicoNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500