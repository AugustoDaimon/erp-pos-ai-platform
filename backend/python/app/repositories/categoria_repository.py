from sqlalchemy import func # Adicionado para fazer a busca case-insensitive
from ..interfaces.categoria_repository import ICategoriaRepository
from ..entities.categoria import Categoria
from ..models.categoria_model import CategoriaModel
from ..infrastructure.database.db import db

class CategoriaRepository(ICategoriaRepository):

    def find_by_id(self, id: int) -> Categoria | None:
        model = db.session.get(CategoriaModel, id)
        if model:
            return model.to_entity() 
        return None

    def create(self, categoria: Categoria) -> Categoria:
        model = CategoriaModel.from_entity(categoria)
        db.session.add(model)
        db.session.commit()
        return model.to_entity()

    def list_all(self) -> list[Categoria]:
        stmt = db.select(CategoriaModel).order_by(CategoriaModel.id)
        models = db.session.scalars(stmt).all()
        
        return [m.to_entity() for m in models]

    def update(self, categoria: Categoria) -> Categoria | None:
        model = db.session.get(CategoriaModel, categoria.id)
        if not model:
            return None
        model.nome = categoria.nome
        db.session.commit()
        return model.to_entity()

    def delete(self, id: int) -> None:
        model = db.session.get(CategoriaModel, id)
        if model:
            db.session.delete(model)
            db.session.commit()

    def get_by_nome(self, nome: str) -> Categoria | None:
        stmt = db.select(CategoriaModel).where(func.lower(CategoriaModel.nome) == nome.lower())
        model = db.session.scalars(stmt).first()
        
        if model:
            return model.to_entity()
        return None