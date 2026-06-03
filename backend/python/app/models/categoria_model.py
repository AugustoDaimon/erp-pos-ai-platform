from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, func
from ..infrastructure.database.db import db
from ..entities.categoria import Categoria

class CategoriaModel(db.Model):
    __tablename__ = "categorias"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nome: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=func.now(), server_default=func.now())

    def to_entity(self) -> Categoria:
        return Categoria(
            id=self.id,
            nome=self.nome,
            criado_em=self.criado_em
        )

    @staticmethod
    def from_entity(entity: Categoria):
        return CategoriaModel(
            id=entity.id,
            nome=entity.nome,
            criado_em=entity.criado_em
        )