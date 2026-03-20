from ..interfaces.cliente_repository import IClienteRepository
from ..entities.cliente import Cliente
from ..models.cliente_model import ClienteModel
from ..infrastructure.database.db import db

class ClienteRepository(IClienteRepository):

    def get_by_id(self, id: int) -> Cliente | None:
        # Sintaxe SQLAlchemy 2.0 (substitui o antigo .query.get)
        model = db.session.get(ClienteModel, id)
        if model:
            return model.to_entity() 
        return None

    def create(self, cliente: Cliente) -> Cliente:
        # Usamos o helper que criamos no Model para evitar repetição de código
        model = ClienteModel.from_entity(cliente)
        
        db.session.add(model)
        db.session.commit()
        
        # O model agora tem o 'id' e 'criado_em' preenchidos pelo banco, 
        # então retornamos a entidade atualizada.
        return model.to_entity()

    def list_all(self) -> list[Cliente]:
        # Sintaxe SQLAlchemy 2.0 (substitui o antigo .query.all)
        stmt = db.select(ClienteModel).order_by(ClienteModel.id)
        models = db.session.scalars(stmt).all()
        
        return [m.to_entity() for m in models]

    def update(self, cliente: Cliente) -> Cliente | None:
        model = db.session.get(ClienteModel, cliente.id)
        if not model:
            return None

        # Atualizamos os campos do model com os dados da entidade
        model.nome = cliente.nome
        model.celular = cliente.celular
        model.sem_whatsapp = cliente.sem_whatsapp
        model.bike_info = cliente.bike_info

        # Não atualizamos o ID nem a data de criação (criado_em)
        
        db.session.commit()
        return model.to_entity()

    def delete(self, id: int) -> None:
        model = db.session.get(ClienteModel, id)
        if model:
            db.session.delete(model)
            db.session.commit()