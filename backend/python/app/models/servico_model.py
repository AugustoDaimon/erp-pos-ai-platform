from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .item_catalogo_model import ItemCatalogoModel
from ..entities.servico import Servico

class ServicoModel(ItemCatalogoModel):
    __tablename__ = 'servicos'
    
    id: Mapped[int] = mapped_column(ForeignKey("itens_catalogo.id", ondelete="CASCADE"), primary_key=True)
    
    # Único campo exclusivo do serviço no catálogo
    tempo_estimado: Mapped[int] = mapped_column(Integer, default=0)

    __mapper_args__ = {
        "polymorphic_identity": "servico",
    }

    def to_entity(self) -> Servico:
        return Servico(
            id=self.id,
            descricao=self.nome, 
            preco=float(self.preco_venda),
            tempo_estimado=self.tempo_estimado,
            criado_em=self.criado_em
        )

    @staticmethod
    def from_entity(entity: Servico):
        return ServicoModel(
            id=entity.id,
            nome=entity.descricao,
            preco_venda=entity.preco,
            tempo_estimado=entity.tempo_estimado
        )