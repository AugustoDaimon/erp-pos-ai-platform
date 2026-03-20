from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Boolean, DateTime, Numeric, ForeignKey, func
from ..infrastructure.database.db import db
from ..entities.pedido import Pedido

class PedidoModel(db.Model):
    __tablename__ = "pedidos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    # ForeignKey conectando à tabela clientes. ondelete="SET NULL" reflete o seu SQL.
    cliente_id: Mapped[int | None] = mapped_column(ForeignKey("clientes.id", ondelete="SET NULL"))
    
    # Campos Financeiros (Convertidos de DECIMAL para float no to_entity)
    subtotal: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, server_default="0.00", nullable=False)
    taxas_cartao: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, server_default="0.00", nullable=False)
    desconto: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, server_default="0.00", nullable=False)
    valor_total: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, server_default="0.00", nullable=False)
    valor_pago: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, server_default="0.00", nullable=False)
    
    metodo_pagamento: Mapped[str | None] = mapped_column(String(50))
    emitir_nota_fiscal: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false", nullable=False)
    status_pedido: Mapped[str] = mapped_column(String(50), default="CONCLUIDO", server_default="'CONCLUIDO'", nullable=False)
    
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=func.now(), server_default=func.now())

    # Relacionamento bidirecional (Opcional, mas muito útil para o SQLAlchemy gerenciar exclusões em cascata)
    itens = relationship("ItemPedidoModel", back_populates="pedido", cascade="all, delete-orphan")

    def to_entity(self) -> Pedido:
        return Pedido(
            id=self.id,
            cliente_id=self.cliente_id,
            subtotal=float(self.subtotal),
            taxas_cartao=float(self.taxas_cartao),
            desconto=float(self.desconto),
            valor_total=float(self.valor_total),
            valor_pago=float(self.valor_pago),
            metodo_pagamento=self.metodo_pagamento,
            emitir_nota_fiscal=self.emitir_nota_fiscal,
            status_pedido=self.status_pedido,
            criado_em=self.criado_em
        )

    @staticmethod
    def from_entity(entity: Pedido):
        return PedidoModel(
            id=entity.id,
            cliente_id=entity.cliente_id,
            subtotal=entity.subtotal,
            taxas_cartao=entity.taxas_cartao,
            desconto=entity.desconto,
            valor_total=entity.valor_total,
            valor_pago=entity.valor_pago,
            metodo_pagamento=entity.metodo_pagamento,
            emitir_nota_fiscal=entity.emitir_nota_fiscal,
            status_pedido=entity.status_pedido,
            criado_em=entity.criado_em
        )