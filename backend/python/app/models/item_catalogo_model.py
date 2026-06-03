from datetime import datetime
from sqlalchemy import DateTime, String, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column
from ..infrastructure.database.db import db

class ItemCatalogoModel(db.Model):
    """
    Classe base para tudo o que pode ser vendido (Produtos, Serviços, etc).
    Utilizando Joint Table Inheritance (JTI).
    """
    __tablename__ = "itens_catalogo"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    # Este campo 'tipo' dirá ao SQLAlchemy se a linha é um Produto ou Serviço
    tipo: Mapped[str] = mapped_column(String(30), nullable=False) 
    
    # Atributos que TODO item de venda possui
    nome: Mapped[str] = mapped_column(String(255), nullable=False)
    preco_venda: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=func.now(), server_default=func.now())
    
    # Configuração de Polimorfismo
    __mapper_args__ = {
        "polymorphic_identity": "item_catalogo",
        "polymorphic_on": tipo,
    }

    def __repr__(self):
        return f"<ItemCatalogo {self.nome} (Type: {self.tipo})>"