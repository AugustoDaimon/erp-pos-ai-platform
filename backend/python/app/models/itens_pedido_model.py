from datetime import datetime
from sqlalchemy import DateTime, Numeric, Integer, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..infrastructure.database.db import db

class ItensPedidoModel(db.Model):
    __tablename__ = "itens_pedido"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    # Chaves Estrangeiras
    pedido_id: Mapped[int] = mapped_column(ForeignKey("pedidos.id", ondelete="CASCADE"), nullable=False)
    
    # Aponta para o ID do Catálogo (Polimorfismo)
    item_catalogo_id: Mapped[int] = mapped_column(ForeignKey("itens_catalogo.id"), nullable=False)
    
    # Dados da Transação
    quantidade: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    
    # Instantâneo do preço no momento da venda (Crucial para o histórico)
    valor_unitario: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    valor_total: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=func.now(), server_default=func.now())

    # Relacionamentos
    pedido: Mapped["PedidoModel"] = relationship("PedidoModel", back_populates="itens")
    
    # Permite aceder diretamente ao objeto do catálogo (seja Produto ou Serviço)
    item: Mapped["ItemCatalogoModel"] = relationship("ItemCatalogoModel", lazy="selectin")

    def __repr__(self):
        return f"<ItemPedido ID: {self.id} | ItemID: {self.item_catalogo_id} | Qtd: {self.quantidade}>"