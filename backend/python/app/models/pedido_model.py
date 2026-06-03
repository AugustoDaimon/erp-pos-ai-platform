from datetime import datetime
from sqlalchemy import String, DateTime, Numeric, Integer, ForeignKey, func, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..infrastructure.database.db import db
from ..entities.pedido import Pedido

class PedidoModel(db.Model):
    __tablename__ = "pedidos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    cliente_id: Mapped[int | None] = mapped_column(ForeignKey("clientes.id", ondelete="SET NULL"), nullable=True)
    
    subtotal: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    taxas_cartao: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    desconto: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    valor_total: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    valor_pago: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    
    metodo_pagamento: Mapped[str | None] = mapped_column(String(50), nullable=True)
    emitir_nota_fiscal: Mapped[bool] = mapped_column(Boolean, default=False)
    
    status_pedido: Mapped[str] = mapped_column(String(50), default='CONCLUIDO') # PENDENTE, CONCLUIDO, CANCELADO
    status_oficina: Mapped[str] = mapped_column(String(50), default='NAO_APLICAVEL') # FILA, MANUTENCAO, PRONTO, ENTREGUE
    
    data_prevista_retirada: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    data_entrega_real: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=func.now(), server_default=func.now())

    itens: Mapped[list["ItensPedidoModel"]] = relationship(
        "ItensPedidoModel", back_populates="pedido", cascade="all, delete-orphan", lazy="selectin"
    )

    def __repr__(self):
        return f"<Pedido ID: {self.id} | Status: {self.status_pedido} | Total: {self.valor_total}>"
    
    def to_entity(self) -> Pedido:
        return Pedido(
            id=self.id,
            cliente_id=self.cliente_id,
            # Convertendo Numeric para float para evitar problemas com Decimal do banco
            subtotal=float(self.subtotal),
            taxas_cartao=float(self.taxas_cartao),
            desconto=float(self.desconto),
            valor_total=float(self.valor_total),
            valor_pago=float(self.valor_pago),
            metodo_pagamento=self.metodo_pagamento,
            emitir_nota_fiscal=self.emitir_nota_fiscal,
            status_pedido=self.status_pedido,
            status_oficina=self.status_oficina,
            data_prevista_retirada=self.data_prevista_retirada,
            data_entrega_real=self.data_entrega_real,
            criado_em=self.criado_em,
            # Converte os itens também!
            itens=[item.to_entity() for item in self.itens] if self.itens else []
        )