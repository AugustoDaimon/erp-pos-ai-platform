from sqlalchemy import Integer, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from ..infrastructure.database.db import db
from ..entities.ordem_servico import OrdemServico, StatusOrdemServico

class OrdemServicoModel(db.Model):
    __tablename__ = 'ordens_servico'
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    pedido_id: Mapped[int] = mapped_column(ForeignKey("pedidos.id", ondelete="CASCADE"), nullable=False)
    servico_id: Mapped[int] = mapped_column(ForeignKey("itens_catalogo.id"), nullable=False)

    data_inicio_previsto: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    data_termino_previsto: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    data_termino_real: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    status: Mapped[StatusOrdemServico] = mapped_column(
        SQLEnum(StatusOrdemServico, name="status_os_enum", create_constraint=True),
        default=StatusOrdemServico.NA_FILA,
        nullable=False
    )

    def to_entity(self) -> OrdemServico:
        return OrdemServico(
            id=self.id,
            pedido_id=self.pedido_id,
            servico_id=self.servico_id,
            data_inicio_previsto=self.data_inicio_previsto,
            data_termino_previsto=self.data_termino_previsto,
            data_termino_real=self.data_termino_real,
            status=self.status
        )

    @staticmethod
    def from_entity(entity: OrdemServico) -> 'OrdemServicoModel':
        return OrdemServicoModel(
            id=entity.id,
            pedido_id=entity.pedido_id,
            servico_id=entity.servico_id,
            data_inicio_previsto=entity.data_inicio_previsto,
            data_termino_previsto=entity.data_termino_previsto,
            data_termino_real=entity.data_termino_real,
            status=entity.status
        )