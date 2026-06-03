from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, Numeric, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from .item_catalogo_model import ItemCatalogoModel
from ..entities.produto import Produto

class ProdutoModel(ItemCatalogoModel):  
    __tablename__ = "produtos"

    id: Mapped[int] = mapped_column(ForeignKey("itens_catalogo.id", ondelete="CASCADE"), primary_key=True)  
    categoria_id: Mapped[int | None] = mapped_column(ForeignKey("categorias.id", ondelete="RESTRICT"), nullable=True)
    subcategoria_id: Mapped[int | None] = mapped_column(ForeignKey("subcategorias.id", ondelete="SET NULL"), nullable=True)
    marca_id: Mapped[int | None] = mapped_column(ForeignKey("marcas.id", ondelete="RESTRICT"), nullable=True)    
    sku: Mapped[str | None] = mapped_column(String(100), unique=True, nullable=True)
    valor_instalacao: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00)
    custo_compra: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00)
    
    estoque_atual: Mapped[int] = mapped_column(Integer, default=0)
    estoque_minimo: Mapped[int] = mapped_column(Integer, default=0)
    
    observacao: Mapped[str | None] = mapped_column(Text, nullable=True)
    especificacao_1: Mapped[str | None] = mapped_column(String(255), nullable=True)
    especificacao_2: Mapped[str | None] = mapped_column(String(255), nullable=True)
    especificacao_3: Mapped[str | None] = mapped_column(String(255), nullable=True)
    imagem_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Configuração de Identidade Polimórfica
    __mapper_args__ = {
        "polymorphic_identity": "produto",
    }

    def to_entity(self) -> Produto:
        return Produto(
            id=self.id,
            # MAPEAMENTO: nome do catálogo vira descricao da entity
            descricao=self.nome, 
            valor_venda=float(self.preco_venda),
            # Campos específicos
            categoria_id=self.categoria_id,
            subcategoria_id=self.subcategoria_id,
            marca_id=self.marca_id,
            observacao=self.observacao,
            sku=self.sku,
            valor_instalacao=float(self.valor_instalacao),
            custo_compra=float(self.custo_compra),
            estoque_atual=self.estoque_atual,
            estoque_minimo=self.estoque_minimo,
            especificacao_1=self.especificacao_1,
            especificacao_2=self.especificacao_2,
            especificacao_3=self.especificacao_3,
            imagem_url=self.imagem_url,
            criado_em=self.criado_em
        )

    @staticmethod
    def from_entity(entity: Produto):
        return ProdutoModel(
            id=entity.id,
            # MAPEAMENTO INVERSO: descricao da entity vira nome no catálogo
            nome=entity.descricao,
            preco_venda=entity.valor_venda,
            # Campos específicos
            categoria_id=entity.categoria_id,
            subcategoria_id=entity.subcategoria_id,
            marca_id=entity.marca_id,
            observacao=entity.observacao,
            sku=entity.sku,
            valor_instalacao=entity.valor_instalacao,
            custo_compra=entity.custo_compra,
            estoque_atual=entity.estoque_atual,
            estoque_minimo=entity.estoque_minimo,
            especificacao_1=entity.especificacao_1,
            especificacao_2=entity.especificacao_2,
            especificacao_3=entity.especificacao_3,
            imagem_url=entity.imagem_url
        )