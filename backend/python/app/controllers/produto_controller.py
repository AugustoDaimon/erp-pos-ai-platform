from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from flasgger import swag_from 
from dataclasses import asdict

from ..repositories.produto_repository import ProdutoRepository
from ..repositories.categoria_repository import CategoriaRepository
from ..repositories.subcategoria_repository import SubcategoriaRepository
from ..repositories.marca_repository import MarcaRepository

from ..services.produto_service import (
    ProdutoService, 
    ProdutoNotFoundError, 
    InvalidProdutoDataError,
    SkuAlreadyExistsError,
    RelacionamentoNotFoundError
)
from ..DTOs.produto_dto import CreateProdutoDTO, UpdateProdutoDTO, FiltroProdutoDTO
from ..schemas.produto_schema import CreateProdutoRequest, UpdateProdutoRequest, ProdutoResponse

produto_bp = Blueprint("produtos", __name__, url_prefix='/api/produtos')

produto_service = ProdutoService(
    ProdutoRepository(),
    CategoriaRepository(),
    SubcategoriaRepository(),
    MarcaRepository()
)

@produto_bp.post("/")
@swag_from('docs/produto/produto_create.yml')
def criar_produto():
    try:
        data = request.get_json()
        schema = CreateProdutoRequest(**data)
        
        dto = CreateProdutoDTO(**schema.model_dump())
        resultado_dto = produto_service.create_produto(dto)
        
        return jsonify(ProdutoResponse(**asdict(resultado_dto)).model_dump()), 201

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except RelacionamentoNotFoundError as e:
        return jsonify({"erro_relacionamento": str(e)}), 422
    except InvalidProdutoDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except SkuAlreadyExistsError as e:
        return jsonify({"erro_conflito": str(e)}), 409
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500

@produto_bp.get("/")
@swag_from('docs/produto/produto_list.yml')
def listar_produtos():
    estoque_baixo_str = request.args.get('estoque_baixo', default='false')
    estoque_baixo = str(estoque_baixo_str).lower() in ['true', '1', 't', 'y', 'yes']

    filtro = FiltroProdutoDTO(
        categoria_id=request.args.get('categoria_id', type=int),
        marca_id=request.args.get('marca_id', type=int),
        busca_descricao=request.args.get('busca', type=str),
        estoque_baixo=estoque_baixo
    )
    
    produtos_dto = produto_service.list_produtos(filtro)
    resposta = [ProdutoResponse(**asdict(p)).model_dump() for p in produtos_dto]
    return jsonify(resposta), 200

@produto_bp.get("/<int:produto_id>")
@swag_from('docs/produto/produto_search.yml')
def buscar_por_id(produto_id: int):
    try:
        produto_dto = produto_service.get_produto(produto_id)
        return jsonify(ProdutoResponse(**asdict(produto_dto)).model_dump()), 200
    except ProdutoNotFoundError as e:
        return jsonify({"erro": str(e)}), 404

@produto_bp.route("/<int:produto_id>", methods=['PUT', 'PATCH'])
@swag_from('docs/produto/produto_update.yml')
def atualizar_produto(produto_id: int):
    try:
        data = request.get_json()
        schema = UpdateProdutoRequest(**data)
        
        dto = UpdateProdutoDTO(**schema.model_dump(exclude_unset=True))
        
        produto_dto = produto_service.update_produto(produto_id, dto)
        return jsonify(ProdutoResponse(**asdict(produto_dto)).model_dump()), 200

    except ValidationError as e:
        return jsonify({"erros_de_validacao": e.errors()}), 400
    except ProdutoNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except RelacionamentoNotFoundError as e:
        return jsonify({"erro_relacionamento": str(e)}), 422
    except InvalidProdutoDataError as e:
        return jsonify({"erro_de_negocio": str(e)}), 422
    except SkuAlreadyExistsError as e:
        return jsonify({"erro_conflito": str(e)}), 409
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500

@produto_bp.delete("/<int:produto_id>")
@swag_from('docs/produto/produto_delete.yml')
def deletar_produto(produto_id: int):
    try:
        produto_service.delete_produto(produto_id)
        return jsonify({"detail": "Produto removido com sucesso"}), 200
    except ProdutoNotFoundError as e:
        return jsonify({"erro": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"erro_interno": str(e)}), 500