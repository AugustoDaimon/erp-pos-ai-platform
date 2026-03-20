from datetime import datetime
from sqlalchemy import String, DateTime, Text, Numeric, Integer, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from ..infrastructure.database.db import db
from ..entities.produto import Produto

class ProdutoModel(db.Model):
    __tablename__ = "produtos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    # Chaves Estrangeiras (Respeitando as regras de DELETE do seu SQL)
    categoria_id: Mapped[int | None] = mapped_column(ForeignKey("categorias.id", ondelete="RESTRICT"), nullable=True)
    subcategoria_id: Mapped[int | None] = mapped_column(ForeignKey("subcategorias.id", ondelete="SET NULL"), nullable=True)
    marca_id: Mapped[int | None] = mapped_column(ForeignKey("marcas.id", ondelete="RESTRICT"), nullable=True)
    
    # Identificação
    descricao: Mapped[str] = mapped_column(String(255), nullable=False)
    observacao: Mapped[str | None] = mapped_column(Text, nullable=True)
    sku: Mapped[str | None] = mapped_column(String(100), unique=True, nullable=True)
    
    # Valores Financeiros (Numeric para não perder centavos)
    valor_venda: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    valor_instalacao: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00)
    custo_compra: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    
    # Estoque
    estoque_atual: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    estoque_minimo: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    
    # Especificações
    especificacao_1: Mapped[str | None] = mapped_column(String(255), nullable=True)
    especificacao_2: Mapped[str | None] = mapped_column(String(255), nullable=True)
    especificacao_3: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    # Meta
    imagem_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=func.now(), server_default=func.now())

    def to_entity(self) -> Produto:
        return Produto(
            id=self.id,
            categoria_id=self.categoria_id,
            subcategoria_id=self.subcategoria_id,
            marca_id=self.marca_id,
            descricao=self.descricao,
            observacao=self.observacao,
            sku=self.sku,
            valor_venda=float(self.valor_venda), # Converte Decimal do banco para float do Python
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
            categoria_id=entity.categoria_id,
            subcategoria_id=entity.subcategoria_id,
            marca_id=entity.marca_id,
            descricao=entity.descricao,
            observacao=entity.observacao,
            sku=entity.sku,
            valor_venda=entity.valor_venda,
            valor_instalacao=entity.valor_instalacao,
            custo_compra=entity.custo_compra,
            estoque_atual=entity.estoque_atual,
            estoque_minimo=entity.estoque_minimo,
            especificacao_1=entity.especificacao_1,
            especificacao_2=entity.especificacao_2,
            especificacao_3=entity.especificacao_3,
            imagem_url=entity.imagem_url,
            # criado_em é gerado pelo banco
        )