from ..interfaces.item_pedido_repository import IItemPedidoRepository
from ..entities.item_pedido import ItemPedido
from ..models.item_pedido_model import ItemPedidoModel
from ..infrastructure.database.db import db

class ItemPedidoRepository(IItemPedidoRepository):

    def get_by_id(self, id: int) -> ItemPedido | None:
        model = db.session.get(ItemPedidoModel, id)
        if model:
            return model.to_entity() 
        return None

    def create(self, item_pedido: ItemPedido) -> ItemPedido:
        model = ItemPedidoModel.from_entity(item_pedido)
        
        db.session.add(model)
        db.session.commit()
        
        return model.to_entity()

    def list_all(self) -> list[ItemPedido]:
        stmt = db.select(ItemPedidoModel).order_by(ItemPedidoModel.id)
        models = db.session.scalars(stmt).all()
        
        return [m.to_entity() for m in models]

    def update(self, item_pedido: ItemPedido) -> ItemPedido | None:
        model = db.session.get(ItemPedidoModel, item_pedido.id)
        if not model:
            return None

        # Apenas quantidade e valores costumam ser alterados em um item já criado
        model.quantidade = item_pedido.quantidade
        model.valor_unitario = item_pedido.valor_unitario
        model.valor_total = item_pedido.valor_total
        
        db.session.commit()
        return model.to_entity()

    def delete(self, id: int) -> None:
        model = db.session.get(ItemPedidoModel, id)
        if model:
            db.session.delete(model)
            db.session.commit()

    # ==========================================
    # Método Específico de Domínio
    # ==========================================
    def list_by_pedido_id(self, pedido_id: int) -> list[ItemPedido]:
        """Busca no banco de dados exclusivamente os itens atrelados a um pedido."""
        stmt = db.select(ItemPedidoModel).where(ItemPedidoModel.pedido_id == pedido_id).order_by(ItemPedidoModel.id)
        models = db.session.scalars(stmt).all()
        
        return [m.to_entity() for m in models]