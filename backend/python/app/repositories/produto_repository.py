from ..interfaces.produto_repository import IProdutoRepository
from ..entities.produto import Produto
from ..models.produto_model import ProdutoModel
from ..infrastructure.database.db import db

class ProdutoRepository(IProdutoRepository):

    def get_by_id(self, id: int) -> Produto | None:
        model = db.session.get(ProdutoModel, id)
        return model.to_entity() if model else None

    def get_by_sku(self, sku: str) -> Produto | None:
        # Busca exata ignorando maiúsculas/minúsculas no SKU
        from sqlalchemy import func
        stmt = db.select(ProdutoModel).where(func.lower(ProdutoModel.sku) == sku.lower())
        model = db.session.scalars(stmt).first()
        return model.to_entity() if model else None

    def create(self, produto: Produto) -> Produto:
        model = ProdutoModel.from_entity(produto)
        db.session.add(model)
        db.session.commit()
        return model.to_entity()

    def list_all(self) -> list[Produto]:
        # Ordenamos por ID decrescente para os mais novos aparecerem primeiro
        stmt = db.select(ProdutoModel).order_by(ProdutoModel.id.desc())
        models = db.session.scalars(stmt).all()
        return [m.to_entity() for m in models]

    def update(self, produto: Produto) -> Produto | None:
        model = db.session.get(ProdutoModel, produto.id)
        if not model:
            return None

        # Atualiza todos os campos
        model.categoria_id = produto.categoria_id
        model.subcategoria_id = produto.subcategoria_id
        model.marca_id = produto.marca_id
        model.descricao = produto.descricao
        model.observacao = produto.observacao
        model.sku = produto.sku
        model.valor_venda = produto.valor_venda
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

    def delete(self, id: int) -> None:
        model = db.session.get(ProdutoModel, id)
        if model:
            db.session.delete(model)
            db.session.commit()