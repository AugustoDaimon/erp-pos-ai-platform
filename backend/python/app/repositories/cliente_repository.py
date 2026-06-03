from ..interfaces.cliente_repository import IClienteRepository
from ..entities.cliente import Cliente
from ..models.cliente_model import ClienteModel
from ..infrastructure.database.db import db

class ClienteRepository(IClienteRepository):

    def get_by_id(self, id: int) -> Cliente | None:
        model = db.session.get(ClienteModel, id)
        if model:
            return model.to_entity() 
        return None

    def create(self, cliente: Cliente) -> Cliente:
        model = ClienteModel.from_entity(cliente)
        db.session.add(model)
        db.session.commit()
        return model.to_entity()

    def list_all(self) -> list[Cliente]:
        stmt = db.select(ClienteModel).order_by(ClienteModel.id)
        models = db.session.scalars(stmt).all()
        return [m.to_entity() for m in models]

    def update(self, cliente: Cliente) -> Cliente | None:
        model = db.session.get(ClienteModel, cliente.id)
        if not model:
            return None

        model.nome = cliente.nome
        model.celular = cliente.celular
        model.sem_whatsapp = cliente.sem_whatsapp
        model.bike_info = cliente.bike_info        
        db.session.commit()
        return model.to_entity()

    def delete(self, id: int) -> None:
        model = db.session.get(ClienteModel, id)
        if model:
            db.session.delete(model)
            db.session.commit()