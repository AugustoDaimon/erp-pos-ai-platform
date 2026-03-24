from datetime import datetime
from sqlalchemy import String, DateTime, Numeric, Integer, ForeignKey, func, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..infrastructure.database.db import db

class PedidoModel(db.Model):
    __tablename__ = "pedidos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    # FK para Cliente (Opcional para vendas rápidas/balcão)
    cliente_id: Mapped[int | None] = mapped_column(ForeignKey("clientes.id", ondelete="SET NULL"), nullable=True)
    
    # Resumo Financeiro
    subtotal: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    taxas_cartao: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    desconto: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    
    # Gestão de Saldo (O teu dilema de pagamentos antecipados)
    valor_total: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    valor_pago: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    
    # Configurações de Pagamento
    metodo_pagamento: Mapped[str | None] = mapped_column(String(50), nullable=True)
    emitir_nota_fiscal: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Estados
    status_pedido: Mapped[str] = mapped_column(String(50), default='CONCLUIDO') # PENDENTE, CONCLUIDO, CANCELADO
    status_oficina: Mapped[str] = mapped_column(String(50), default='NAO_APLICAVEL') # FILA, MANUTENCAO, PRONTO, ENTREGUE
    
    # Datas de Compromisso
    data_prevista_retirada: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    data_entrega_real: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=func.now(), server_default=func.now())

    # Relacionamento com os itens
    itens: Mapped[list["ItensPedidoModel"]] = relationship(
        "ItensPedidoModel", back_populates="pedido", cascade="all, delete-orphan", lazy="selectin"
    )

    def __repr__(self):
        return f"<Pedido ID: {self.id} | Status: {self.status_pedido} | Total: {self.valor_total}>"