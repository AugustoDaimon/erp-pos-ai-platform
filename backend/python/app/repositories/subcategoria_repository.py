from sqlalchemy import func # Adicionado para fazer a busca case-insensitive
from ..interfaces.subcategoria_repository import ISubcategoriaRepository
from ..entities.subcategoria import Subcategoria
from ..models.subcategoria_model import SubcategoriaModel
from ..infrastructure.database.db import db

class SubcategoriaRepository(ISubcategoriaRepository):

    def get_by_id(self, id: int) -> Subcategoria | None:
        model = db.session.get(SubcategoriaModel, id)
        if model:
            return model.to_entity() 
        return None

    def create(self, subcategoria: Subcategoria) -> Subcategoria:
        model = SubcategoriaModel.from_entity(subcategoria)
        db.session.add(model)
        db.session.commit()
        return model.to_entity()

    def list_all(self) -> list[Subcategoria]:
        stmt = db.select(SubcategoriaModel).order_by(SubcategoriaModel.id)
        models = db.session.scalars(stmt).all()
        return [m.to_entity() for m in models]

    def update(self, subcategoria: Subcategoria) -> Subcategoria | None:
        model = db.session.get(SubcategoriaModel, subcategoria.id)
        if not model:
            return None

        # Na atualização de subcategoria, podemos mudar o nome e trocar a qual categoria ela pertence!
        model.nome = subcategoria.nome
        model.categoria_id = subcategoria.categoria_id

        db.session.commit()
        return model.to_entity()

    def delete(self, id: int) -> None:
        model = db.session.get(SubcategoriaModel, id)
        if model:
            db.session.delete(model)
            db.session.commit()

    def get_by_nome_e_categoria(self, nome: str, categoria_id: int) -> Subcategoria | None:
        from sqlalchemy import func
        stmt = db.select(SubcategoriaModel).where(
            func.lower(SubcategoriaModel.nome) == nome.lower(),
            SubcategoriaModel.categoria_id == categoria_id
        )
        model = db.session.scalars(stmt).first()
        
        if model:
            return model.to_entity()
        return None