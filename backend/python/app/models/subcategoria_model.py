from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, ForeignKey, func
from ..infrastructure.database.db import db
from ..entities.subcategoria import Subcategoria

class SubcategoriaModel(db.Model):
    __tablename__ = "subcategorias"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    # A Chave Estrangeira (Foreign Key)
    categoria_id: Mapped[int] = mapped_column(
        ForeignKey("categorias.id", ondelete="CASCADE"), 
        nullable=False
    )
    
    nome: Mapped[str] = mapped_column(String(100), nullable=False)
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=func.now(), server_default=func.now())

    def to_entity(self) -> Subcategoria:
        return Subcategoria(
            id=self.id,
            categoria_id=self.categoria_id,
            nome=self.nome,
            criado_em=self.criado_em
        )

    @staticmethod
    def from_entity(entity: Subcategoria):
        return SubcategoriaModel(
            id=entity.id,
            categoria_id=entity.categoria_id,
            nome=entity.nome,
            criado_em=entity.criado_em
        )