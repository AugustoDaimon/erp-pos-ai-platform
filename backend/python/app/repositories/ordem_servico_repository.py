from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, and_

from ..interfaces.ordem_servico_repository import IOrdemServicoRepository
from ..entities.ordem_servico import OrdemServico, StatusOrdemServico
from ..models.ordem_servico_model import OrdemServicoModel
from ..infrastructure.database.db import db

class OrdemServicoRepository(IOrdemServicoRepository):

    def find_by_id(self, ordem_servico_id: int) -> Optional[OrdemServico]:
        model = db.session.get(OrdemServicoModel, ordem_servico_id)
        return model.to_entity() if model else None

    def create(self, ordem_servico: OrdemServico) -> OrdemServico:
        model = OrdemServicoModel.from_entity(ordem_servico)
        db.session.add(model)
        db.session.commit()
        return model.to_entity()

    def list_all(self) -> List[OrdemServico]:
        # Mantive a ordenação pela data de início para fazer sentido no contexto de agenda
        stmt = select(OrdemServicoModel).order_by(OrdemServicoModel.data_inicio_previsto.desc())
        models = db.session.scalars(stmt).all()
        return [m.to_entity() for m in models]

    def update(self, ordem_servico: OrdemServico) -> Optional[OrdemServico]:
        model = db.session.get(OrdemServicoModel, ordem_servico.id)
        if not model:
            return None

        model.servico_id = ordem_servico.servico_id
        model.data_inicio_previsto = ordem_servico.data_inicio_previsto
        model.data_termino_previsto = ordem_servico.data_termino_previsto
        model.data_termino_real = ordem_servico.data_termino_real
        model.status = ordem_servico.status

        db.session.commit()
        return model.to_entity()

    def delete(self, ordem_servico_id: int) -> bool:
        model = db.session.get(OrdemServicoModel, ordem_servico_id)
        if model:
            db.session.delete(model)
            db.session.commit()
            return True
        return False

    # ==================================================
    # Buscas Específicas do Domínio (Agendamento e Oficina)
    # ==================================================

    def find_by_pedido_id(self, pedido_id: int) -> List[OrdemServico]:
        stmt = select(OrdemServicoModel).where(OrdemServicoModel.pedido_id == pedido_id)
        models = db.session.scalars(stmt).all()
        return [m.to_entity() for m in models]

    def find_by_status(self, status: StatusOrdemServico) -> List[OrdemServico]:
        stmt = select(OrdemServicoModel).where(OrdemServicoModel.status == status)
        models = db.session.scalars(stmt).all()
        return [m.to_entity() for m in models]

    def find_by_period(self, data_inicio: datetime, data_fim: datetime) -> List[OrdemServico]:
        stmt = select(OrdemServicoModel).where(
            and_(
                OrdemServicoModel.data_inicio_previsto <= data_fim,
                OrdemServicoModel.data_termino_previsto >= data_inicio
            )
        ).order_by(OrdemServicoModel.data_inicio_previsto.asc())
        
        models = db.session.scalars(stmt).all()
        return [m.to_entity() for m in models]