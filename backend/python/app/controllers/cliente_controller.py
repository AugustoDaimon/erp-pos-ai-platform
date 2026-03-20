from flask import Blueprint, request, jsonify
from flasgger import swag_from
from pydantic import ValidationError
from dataclasses import asdict

# Importando as camadas do Cliente
from ..repositories.cliente_repository import ClienteRepository
from ..services.cliente_service import (
    ClienteService, 
    ClienteNotFoundError, 
    InvalidClienteDataError
)
from ..DTOs.cliente_dto import CreateClienteDTO, UpdateClienteDTO
from ..schemas.cliente_schema import CreateClienteRequest, UpdateClienteRequest, ClienteResponse


# Inicialização do Blueprint e do Service
cliente_bp = Blueprint("clientes", __name__, url_prefix='/api/clientes')
cliente_service = ClienteService(ClienteRepository())


@cliente_bp.post("/")
@swag_from('docs/cliente/cliente_create.yml')
def criar_cliente():
    try:
        data = request.get_json()
        
        # 1. Validação com Pydantic
        schema = CreateClienteRequest(**data)

        # 2. Mapeamento para o DTO de Entrada
        dto = CreateClienteDTO(
            nome=schema.nome,
            celular=schema.celular,
            sem_whatsapp=schema.sem_whatsapp,
            bike_info=schema.bike_info
        )
        
        # 3. Execução da Regra de Negócio
        resultado_dto = cliente_service.create_cliente(dto)
        
        # 4. Formatação da Resposta com Pydantic
        return jsonify(ClienteResponse(**asdict(resultado_dto)).model_dump()), 201

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except InvalidClienteDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422


@cliente_bp.get("/")
@swag_from('docs/cliente/cliente_list.yml')
def listar_clientes():
    clientes_dto = cliente_service.list_clientes()
    
    # Converte cada DTO do Service para o Schema de Resposta do Pydantic
    resposta = [ClienteResponse(**asdict(c)).model_dump() for c in clientes_dto]
    return jsonify(resposta), 200


@cliente_bp.get("/<int:cliente_id>")
@swag_from('docs/cliente/cliente_search.yml')
def buscar_por_id(cliente_id: int):
    try:
        cliente_dto = cliente_service.get_cliente(cliente_id)
        return jsonify(ClienteResponse(**asdict(cliente_dto)).model_dump()), 200
        
    except ClienteNotFoundError as e:
        return jsonify({"erro": str(e)}), 404


@cliente_bp.put("/<int:cliente_id>")
@swag_from('docs/cliente/cliente_update.yml')
def atualizar_cliente(cliente_id: int):
    try:
        data = request.get_json()
        
        # Usamos o Schema de Update (onde os campos são opcionais)
        schema = UpdateClienteRequest(**data)

        # Mapeamos para o DTO de Update
        dto = UpdateClienteDTO(
            nome=schema.nome,
            celular=schema.celular,
            sem_whatsapp=schema.sem_whatsapp,
            bike_info=schema.bike_info
        )
        
        cliente_dto = cliente_service.update_cliente(cliente_id, dto)
        return jsonify(ClienteResponse(**asdict(cliente_dto)).model_dump()), 200

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except ClienteNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except InvalidClienteDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422


@cliente_bp.delete("/<int:cliente_id>")
@swag_from('docs/cliente/cliente_delete.yml')
def deletar_cliente(cliente_id: int):
    try:
        cliente_service.delete_cliente(cliente_id)
        return jsonify({"detail": "Cliente removido com sucesso"}), 200
    except ClienteNotFoundError as e:
        return jsonify({"erro": str(e)}), 404