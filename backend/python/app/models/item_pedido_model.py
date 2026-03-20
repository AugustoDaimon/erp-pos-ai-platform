from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, DateTime, Numeric, ForeignKey, func
from ..infrastructure.database.db import db
from ..entities.item_pedido import ItemPedido

class ItemPedidoModel(db.Model):
    __tablename__ = "itens_pedido"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    # ForeignKeys para pedido e produto. CASCADE reflete exatamente o seu SQL.
    pedido_id: Mapped[int] = mapped_column(ForeignKey("pedidos.id", ondelete="CASCADE"), nullable=False)
    produto_id: Mapped[int] = mapped_column(ForeignKey("produtos.id"), nullable=False)
    
    quantidade: Mapped[int] = mapped_column(Integer, nullable=False)
    valor_unitario: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    valor_total: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=func.now(), server_default=func.now())

    # Relacionamento de volta para o Pedido
    pedido = relationship("PedidoModel", back_populates="itens")

    def to_entity(self) -> ItemPedido:
        return ItemPedido(
            id=self.id,
            pedido_id=self.pedido_id,
            produto_id=self.produto_id,
            quantidade=self.quantidade,
            valor_unitario=float(self.valor_unitario),
            valor_total=float(self.valor_total),
            criado_em=self.criado_em
        )

    @staticmethod
    def from_entity(entity: ItemPedido):
        return ItemPedidoModel(
            id=entity.id,
            pedido_id=entity.pedido_id,
            produto_id=entity.produto_id,
            quantidade=entity.quantidade,
            valor_unitario=entity.valor_unitario,
            valor_total=entity.valor_total,
            criado_em=entity.criado_em
        )