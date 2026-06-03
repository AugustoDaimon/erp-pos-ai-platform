from typing import List, Optional
from sqlalchemy import select
from ..interfaces.item_catalogo_repository import IItemCatalogoRepository
from ..entities.item_catalogo import ItemCatalogo
from ..models.item_catalogo_model import ItemCatalogoModel
from ..infrastructure.database.db import db

class ItemCatalogoRepository(IItemCatalogoRepository):

    def find_by_id(self, item_id: int) -> Optional[ItemCatalogo]:
        model = db.session.get(ItemCatalogoModel, item_id)
        if not model:
            return None
        return ItemCatalogo(
            id=model.id,
            nome=model.nome,
            preco_venda=float(model.preco_venda),
            tipo=model.tipo
        )

    def search_by_nome(self, nome: str) -> List[ItemCatalogo]:
        stmt = select(ItemCatalogoModel).where(
            ItemCatalogoModel.nome.ilike(f"%{nome}%")
        ).order_by(ItemCatalogoModel.nome)
        
        models = db.session.scalars(stmt).all()
        
        return [
            ItemCatalogo(
                id=m.id, 
                nome=m.nome, 
                preco_venda=float(m.preco_venda), 
                tipo=m.tipo
            ) for m in models
        ]