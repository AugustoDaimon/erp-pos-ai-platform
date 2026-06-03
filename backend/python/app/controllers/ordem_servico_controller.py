from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from flasgger import swag_from 
from dataclasses import asdict
from datetime import datetime

from ..repositories.ordem_servico_repository import OrdemServicoRepository

from ..services.ordem_servico_service import (
    OrdemServicoService, 
    OrdemServicoNotFoundError, 
    InvalidOrdemServicoDataError
)
from ..DTOs.ordem_servico_dto import (
    CreateOrdemServicoDTO, 
    UpdateOrdemServicoDTO, 
    FiltroOrdemServicoDTO
)
from ..schemas.ordem_servico_schema import (
    CreateOrdemServicoRequest, 
    UpdateOrdemServicoRequest, 
    OrdemServicoResponse
)

ordem_servico_bp = Blueprint("ordens_servico", __name__, url_prefix='/api/ordens-servico')

ordem_servico_service = OrdemServicoService(OrdemServicoRepository())

def _parse_date(date_str: str | None) -> datetime | None:
    """Helper para converter datas recebidas via query params na URL."""
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str)
    except ValueError:
        return None

@ordem_servico_bp.post("/")
@swag_from('docs/ordem_servico/os_create.yml')
def criar_ordem_servico():
    try:
        data = request.get_json()
        
        schema = CreateOrdemServicoRequest(**data)
        dto = CreateOrdemServicoDTO(**schema.model_dump())
        resultado_dto = ordem_servico_service.create_ordem_servico(dto)
        
        return jsonify(OrdemServicoResponse(**asdict(resultado_dto)).model_dump()), 201

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except InvalidOrdemServicoDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500

@ordem_servico_bp.get("/")
@swag_from('docs/ordem_servico/os_list.yml')
def listar_ordens_servico():
    filtro = FiltroOrdemServicoDTO(
        pedido_id=request.args.get('pedido_id', type=int),
        status=request.args.get('status', type=str),
        data_inicio=_parse_date(request.args.get('data_inicio', type=str)),
        data_fim=_parse_date(request.args.get('data_fim', type=str))
    )
    
    os_dto_list = ordem_servico_service.list_ordens_servico(filtro)
    resposta = [OrdemServicoResponse(**asdict(os)).model_dump(mode='json') for os in os_dto_list]    
    return jsonify(resposta), 200

@ordem_servico_bp.get("/<int:os_id>")
@swag_from('docs/ordem_servico/os_search.yml')
def buscar_por_id(os_id: int):
    try:
        os_dto = ordem_servico_service.get_ordem_servico(os_id)
        return jsonify(OrdemServicoResponse(**asdict(os_dto)).model_dump()), 200
    except OrdemServicoNotFoundError as e:
        return jsonify({"erro": str(e)}), 404

@ordem_servico_bp.route("/<int:os_id>", methods=['PUT', 'PATCH'])
@swag_from('docs/ordem_servico/os_update.yml')
def atualizar_ordem_servico(os_id: int):
    try:
        data = request.get_json()
        
        schema = UpdateOrdemServicoRequest(**data)
        dto = UpdateOrdemServicoDTO(**schema.model_dump(exclude_unset=True))
        os_dto = ordem_servico_service.update_ordem_servico(os_id, dto)
        return jsonify(OrdemServicoResponse(**asdict(os_dto)).model_dump(mode='json')), 200

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except OrdemServicoNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except InvalidOrdemServicoDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500

@ordem_servico_bp.patch("/<int:os_id>/finalizar")
@swag_from('docs/ordem_servico/os_finalizar.yml')
def finalizar_ordem_servico(os_id: int):
    try:
        os_dto = ordem_servico_service.finalizar_ordem_servico(os_id)
        return jsonify(OrdemServicoResponse(**asdict(os_dto)).model_dump(mode='json')), 200
    except OrdemServicoNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500

@ordem_servico_bp.delete("/<int:os_id>")
@swag_from('docs/ordem_servico/os_delete.yml')
def deletar_ordem_servico(os_id: int):
    try:
        ordem_servico_service.delete_ordem_servico(os_id)
        return jsonify({"detail": "Ordem de serviço removida com sucesso"}), 200
    except OrdemServicoNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500