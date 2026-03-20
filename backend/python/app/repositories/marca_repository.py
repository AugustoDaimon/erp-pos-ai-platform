from sqlalchemy import func
from ..interfaces.marca_repository import IMarcaRepository
from ..entities.marca import Marca
from ..models.marca_model import MarcaModel
from ..models.categoria_model import CategoriaModel # Precisamos importar para buscar as categorias reais
from ..infrastructure.database.db import db

class MarcaRepository(IMarcaRepository):

    def get_by_id(self, id: int) -> Marca | None:
        model = db.session.get(MarcaModel, id)
        return model.to_entity() if model else None

    def get_by_nome(self, nome: str) -> Marca | None:
        stmt = db.select(MarcaModel).where(func.lower(MarcaModel.nome) == nome.lower())
        model = db.session.scalars(stmt).first()
        return model.to_entity() if model else None

    def create(self, marca: Marca) -> Marca:
        model = MarcaModel(nome=marca.nome)
        
        # RELACIONAMENTO N:N -> Busca as categorias pelo ID e injeta no model da Marca
        if marca.categorias_vinculadas:
            stmt = db.select(CategoriaModel).where(CategoriaModel.id.in_(marca.categorias_vinculadas))
            categorias_db = db.session.scalars(stmt).all()
            model.categorias = list(categorias_db)

        db.session.add(model)
        db.session.commit()
        return model.to_entity()

    def list_all(self) -> list[Marca]:
        stmt = db.select(MarcaModel).order_by(MarcaModel.nome)
        models = db.session.scalars(stmt).all()
        return [m.to_entity() for m in models]

    def update(self, marca: Marca) -> Marca | None:
        model = db.session.get(MarcaModel, marca.id)
        if not model:
            return None

        model.nome = marca.nome

        # RELACIONAMENTO N:N -> Atualiza a lista de categorias
        stmt = db.select(CategoriaModel).where(CategoriaModel.id.in_(marca.categorias_vinculadas))
        categorias_db = db.session.scalars(stmt).all()
        model.categorias = list(categorias_db) # O SQLAlchemy apaga os antigos e insere os novos sozinho!

        db.session.commit()
        return model.to_entity()

    def delete(self, id: int) -> None:
        model = db.session.get(MarcaModel, id)
        if model:
            db.session.delete(model)
            db.session.commit()