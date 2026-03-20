from sqlalchemy import func # Adicionado para fazer a busca case-insensitive
from ..interfaces.categoria_repository import ICategoriaRepository
from ..entities.categoria import Categoria
from ..models.categoria_model import CategoriaModel
from ..infrastructure.database.db import db

class CategoriaRepository(ICategoriaRepository):

    def get_by_id(self, id: int) -> Categoria | None:
        # Sintaxe SQLAlchemy 2.0
        model = db.session.get(CategoriaModel, id)
        if model:
            return model.to_entity() 
        return None

    def create(self, categoria: Categoria) -> Categoria:
        # Converte a entidade de domínio pura para o modelo do banco
        model = CategoriaModel.from_entity(categoria)
        
        db.session.add(model)
        db.session.commit()
        
        # O model agora tem o 'id' e 'criado_em' preenchidos pelo banco
        return model.to_entity()

    def list_all(self) -> list[Categoria]:
        # Ordenando por ID para manter a lista sempre na mesma sequência
        stmt = db.select(CategoriaModel).order_by(CategoriaModel.id)
        models = db.session.scalars(stmt).all()
        
        return [m.to_entity() for m in models]

    def update(self, categoria: Categoria) -> Categoria | None:
        model = db.session.get(CategoriaModel, categoria.id)
        if not model:
            return None

        # Atualizamos apenas os campos permitidos
        model.nome = categoria.nome

        # Não atualizamos o ID nem a data de criação (criado_em)
        db.session.commit()
        return model.to_entity()

    def delete(self, id: int) -> None:
        model = db.session.get(CategoriaModel, id)
        if model:
            db.session.delete(model)
            db.session.commit()

    # ==========================================
    # NOVO MÉTODO: Busca exata pelo nome
    # ==========================================
    def get_by_nome(self, nome: str) -> Categoria | None:
        """
        Busca uma categoria pelo nome ignorando maiúsculas e minúsculas.
        Essencial para a validação de unicidade no Service.
        """
        stmt = db.select(CategoriaModel).where(func.lower(CategoriaModel.nome) == nome.lower())
        model = db.session.scalars(stmt).first()
        
        if model:
            return model.to_entity()
        return None