from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Boolean, Text, DateTime, func
from ..infrastructure.database.db import db
from ..entities.cliente import Cliente

class ClienteModel(db.Model):
    __tablename__ = "clientes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nome: Mapped[str] = mapped_column(String(255), nullable=False)
    celular: Mapped[str | None] = mapped_column(String(20))
    sem_whatsapp: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    bike_info: Mapped[str | None] = mapped_column(Text)
    
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=func.now(), server_default=func.now())

    def to_entity(self) -> Cliente:
        return Cliente(
            id=self.id,
            nome=self.nome,
            celular=self.celular,
            sem_whatsapp=self.sem_whatsapp,
            bike_info=self.bike_info,
            criado_em=self.criado_em
        )

    @staticmethod
    def from_entity(entity: Cliente):
        return ClienteModel(
            id=entity.id,
            nome=entity.nome,
            celular=entity.celular,
            sem_whatsapp=entity.sem_whatsapp,
            bike_info=entity.bike_info,
            criado_em=entity.criado_em
        )