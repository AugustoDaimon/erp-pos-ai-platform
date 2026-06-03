from typing import List, Optional
from sqlalchemy import func, select
from ..interfaces.produto_repository import IProdutoRepository
from ..entities.produto import Produto
from ..models.produto_model import ProdutoModel
from ..infrastructure.database.db import db

class ProdutoRepository(IProdutoRepository):

    def find_by_id(self, produto_id: int) -> Optional[Produto]:
        model = db.session.get(ProdutoModel, produto_id)
        return model.to_entity() if model else None

    def find_by_sku(self, sku: str) -> Optional[Produto]:
        stmt = select(ProdutoModel).where(func.lower(ProdutoModel.sku) == sku.lower())
        model = db.session.scalars(stmt).first()
        return model.to_entity() if model else None

    def create(self, produto: Produto) -> Produto:
        model = ProdutoModel.from_entity(produto)
        db.session.add(model)
        db.session.commit()
        return model.to_entity()

    def list_all(self) -> List[Produto]:
        stmt = select(ProdutoModel).order_by(ProdutoModel.id.desc())
        models = db.session.scalars(stmt).all()
        return [m.to_entity() for m in models]

    def update(self, produto: Produto) -> Optional[Produto]:
        model = db.session.get(ProdutoModel, produto.id)
        if not model:
            return None

        model.nome = produto.descricao
        model.preco_venda = produto.valor_venda
        model.categoria_id = produto.categoria_id
        model.subcategoria_id = produto.subcategoria_id
        model.marca_id = produto.marca_id
        model.observacao = produto.observacao
        model.sku = produto.sku
        model.valor_instalacao = produto.valor_instalacao
        model.custo_compra = produto.custo_compra
        model.estoque_atual = produto.estoque_atual
        model.estoque_minimo = produto.estoque_minimo
        model.especificacao_1 = produto.especificacao_1
        model.especificacao_2 = produto.especificacao_2
        model.especificacao_3 = produto.especificacao_3
        model.imagem_url = produto.imagem_url

        db.session.commit()
        return model.to_entity()

    def delete(self, produto_id: int) -> bool:
        model = db.session.get(ProdutoModel, produto_id)
        if model:
            db.session.delete(model)
            db.session.commit()
            return True
        return False

    def update_estoque(self, produto_id: int, quantidade: int) -> bool:
        model = db.session.get(ProdutoModel, produto_id)
        if not model:
            return False
        
        model.estoque_atual += quantidade
        db.session.commit()
        return True