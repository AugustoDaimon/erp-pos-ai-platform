from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from flasgger import swag_from 
from dataclasses import asdict

from ..repositories.pedido_repository import PedidoRepository
from ..repositories.item_catalogo_repository import ItemCatalogoRepository
from ..repositories.produto_repository import ProdutoRepository

from ..services.pedido_service import (
    PedidoService,
    PedidoNotFoundError,
    InvalidPedidoDataError,
    PagamentoInvalidoError,
    ItemNaoEncontradoError,
    EstoqueInsuficienteError
)

from ..DTOs.pedido_dto import CreatePedidoDTO, CreateItemPedidoDTO, FiltroPedidoDTO
from ..schemas.pedido_schema import CreatePedidoRequest, PedidoResponse

pedido_bp = Blueprint("pedidos", __name__, url_prefix='/api/pedidos')

pedido_service = PedidoService(
    pedido_repo=PedidoRepository(),
    catalogo_repo=ItemCatalogoRepository(),
    produto_repo=ProdutoRepository()
)

@pedido_bp.post("/")
@swag_from('docs/pedido/pedido_create.yml')
def criar_pedido():
    try:
        data = request.get_json()
        schema = CreatePedidoRequest(**data)
        dados_validados = schema.model_dump()
        itens_brutos = dados_validados.pop('itens')
        itens_dto = [
            CreateItemPedidoDTO(
                item_id=item['item_id'],
                quantidade=item['quantidade'],
                valor_unitario=item['valor_unitario']
            ) 
            for item in itens_brutos
        ]
        dto_pedido = CreatePedidoDTO(**dados_validados, itens=itens_dto)
        resultado_dto = pedido_service.create_pedido(dto_pedido)
        return jsonify(PedidoResponse(**asdict(resultado_dto)).model_dump()), 201

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except (ItemNaoEncontradoError, PedidoNotFoundError) as e:
        return jsonify({"erro": str(e)}), 404
    except EstoqueInsuficienteError as e:
        return jsonify({"erro_estoque": str(e)}), 409 
    except (InvalidPedidoDataError, PagamentoInvalidoError) as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500
    
@pedido_bp.get("/")
# TODO YAML
def listar_pedidos():
    try:
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        pedidos_dto = pedido_service.listar_pedidos()
        
        return jsonify([PedidoResponse(**asdict(p)).model_dump() for p in pedidos_dto]), 200

    except Exception as e:
        return jsonify({"erro_interno": str(e)}), 500

@pedido_bp.get("/<int:pedido_id>")
@swag_from('docs/pedido/pedido_search.yml')
def buscar_pedido(pedido_id: int):
    try:
        resultado_dto = pedido_service.find_pedido(pedido_id)
        return jsonify(PedidoResponse(**asdict(resultado_dto)).model_dump()), 200
    except PedidoNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500

@pedido_bp.post("/<int:pedido_id>/cancelar")
@swag_from('docs/pedido/pedido_cancelar.yml')
def cancelar_pedido(pedido_id: int):
    try:
        sucesso = pedido_service.cancelar_pedido(pedido_id)
        if sucesso:
            return jsonify({"detail": f"Pedido {pedido_id} cancelado e estoque devolvido com sucesso."}), 200
    except PedidoNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except InvalidPedidoDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500