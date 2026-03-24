from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from flasgger import swag_from 
from dataclasses import asdict

# Repositórios
from ..repositories.pedido_repository import PedidoRepository
from ..repositories.item_catalogo_repository import ItemCatalogoRepository
from ..repositories.produto_repository import ProdutoRepository

# Service e Exceções
from ..services.pedido_service import (
    PedidoService,
    PedidoNotFoundError,
    InvalidPedidoDataError,
    PagamentoInvalidoError,
    ItemNaoEncontradoError,
    EstoqueInsuficienteError
)

# DTOs e Schemas
from ..DTOs.pedido_dto import CreatePedidoDTO, CreateItemPedidoDTO, FiltroPedidoDTO
from ..schemas.pedido_schema import CreatePedidoRequest, PedidoResponse

pedido_bp = Blueprint("pedidos", __name__, url_prefix='/api/pedidos')

# Instanciando o Service com suas 3 dependências
pedido_service = PedidoService(
    pedido_repo=PedidoRepository(),
    catalogo_repo=ItemCatalogoRepository(),
    produto_repo=ProdutoRepository()
)

@pedido_bp.post("/")
@swag_from('docs/pedido/pedido_create.yml')
def criar_pedido():
    try:
        # 1. Recebe e Valida o JSON bruto com Pydantic
        data = request.get_json()
        schema = CreatePedidoRequest(**data)
        dados_validados = schema.model_dump()
        
        # 2. A Mágica do Aninhamento: Separa a lista de itens e converte para DTOs
        itens_brutos = dados_validados.pop('itens')
        itens_dto = [CreateItemPedidoDTO(**item) for item in itens_brutos]
        
        # 3. Monta o DTO principal e injeta a lista de DTOs de itens
        dto_pedido = CreatePedidoDTO(**dados_validados, itens=itens_dto)
        
        # 4. Envia para o Service (Onde a regra de negócio e baixa de estoque acontecem)
        resultado_dto = pedido_service.create_pedido(dto_pedido)
        
        # 5. Converte a resposta usando asdict() para o Schema do Pydantic formatar
        return jsonify(PedidoResponse(**asdict(resultado_dto)).model_dump()), 201

    # Tratamento de Erros Finos (Isso é o que dá uma API de alta qualidade)
    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except (ItemNaoEncontradoError, PedidoNotFoundError) as e:
        return jsonify({"erro": str(e)}), 404
    except EstoqueInsuficienteError as e:
        return jsonify({"erro_estoque": str(e)}), 409 # 409 Conflict é ideal para falta de estoque
    except (InvalidPedidoDataError, PagamentoInvalidoError) as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except RuntimeError as e:
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
    """
    Endpoint dedicado ao cancelamento.
    Usamos POST com verbo na URL (ou PATCH) pois é uma ação que altera estado 
    e dispara regras complexas (como devolver o produto para a prateleira).
    """
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