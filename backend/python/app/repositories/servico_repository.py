from typing import List, Optional
from sqlalchemy import select
from ..interfaces.servico_repository import IServicoRepository 
from ..entities.servico import Servico
from ..models.servico_model import ServicoModel
from ..infrastructure.database.db import db

class ServicoRepository(IServicoRepository):

    def find_by_id(self, servico_id: int) -> Optional[Servico]:
        model = db.session.get(ServicoModel, servico_id)
        return model.to_entity() if model else None

    def create(self, servico: Servico) -> Servico:
        model = ServicoModel.from_entity(servico)
        db.session.add(model)
        db.session.commit()
        return model.to_entity()

    def list_all(self) -> List[Servico]:
        stmt = select(ServicoModel).order_by(ServicoModel.id.desc())
        models = db.session.scalars(stmt).all()
        return [m.to_entity() for m in models]

    def update(self, servico: Servico) -> Optional[Servico]:
        model = db.session.get(ServicoModel, servico.id)
        if not model:
            return None

        model.nome = servico.descricao
        model.preco_venda = servico.preco
        model.tempo_estimado = servico.tempo_estimado

        db.session.commit()
        return model.to_entity()

    def delete(self, servico_id: int) -> bool:
        model = db.session.get(ServicoModel, servico_id)
        if model:
            db.session.delete(model)
            db.session.commit()
            return True
        return False