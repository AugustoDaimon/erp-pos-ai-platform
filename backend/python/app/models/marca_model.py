from datetime import datetime
from sqlalchemy import String, DateTime, func, Table, Column, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..infrastructure.database.db import db
from ..entities.marca import Marca

categorias_marcas_table = Table(
    "categorias_marcas",
    db.metadata,
    Column("categoria_id", Integer, ForeignKey("categorias.id", ondelete="CASCADE"), primary_key=True),
    Column("marca_id", Integer, ForeignKey("marcas.id", ondelete="CASCADE"), primary_key=True)
)

class MarcaModel(db.Model):
    __tablename__ = "marcas"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nome: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=func.now(), server_default=func.now())

    categorias = relationship("CategoriaModel", secondary=categorias_marcas_table, lazy="selectin")

    def to_entity(self) -> Marca:
        ids_categorias = [cat.id for cat in self.categorias]
        return Marca(
            id=self.id,
            nome=self.nome,
            categorias_vinculadas=ids_categorias,
            criado_em=self.criado_em
        )