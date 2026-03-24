from typing import List, Optional
from sqlalchemy import select
from ..interfaces.item_pedido_repository import IItemPedidoRepository
from ..entities.item_pedido import ItemPedido
from ..models.itens_pedido_model import ItensPedidoModel
from ..infrastructure.database.db import db

class ItemPedidoRepository(IItemPedidoRepository):

    def create(self, item_pedido: ItemPedido) -> ItemPedido:
        # Criamos o model a partir da entity
        model = ItensPedidoModel(
            pedido_id=item_pedido.pedido_id,
            item_catalogo_id=item_pedido.item_id, # Chave polimórfica
            quantidade=item_pedido.quantidade,
            valor_unitario=item_pedido.valor_unitario,
            valor_total=item_pedido.valor_total
        )
        
        db.session.add(model)
        db.session.commit()
        
        # Atribuímos o ID gerado pelo banco de volta à entity
        item_pedido.id = model.id
        return item_pedido

    def update(self, item_pedido: ItemPedido) -> Optional[ItemPedido]:
        model = db.session.get(ItensPedidoModel, item_pedido.id)
        if not model:
            return None

        # Em itens de pedido, geralmente só permitimos alterar quantidade e valores
        # ou trocar o item do catálogo (ex: errei o pneu no lançamento)
        model.quantidade = item_pedido.quantidade
        model.valor_unitario = item_pedido.valor_unitario
        model.valor_total = item_pedido.valor_total
        model.item_catalogo_id = item_pedido.item_id
        
        db.session.commit()
        
        # Usamos o método auxiliar de mapeamento que está no model (ou manual)
        return self._to_entity(model)

    def delete(self, item_id: int) -> bool:
        model = db.session.get(ItensPedidoModel, item_id)
        if model:
            db.session.delete(model)
            db.session.commit()
            return True
        return False

    def find_by_id(self, item_id: int) -> Optional[ItemPedido]:
        model = db.session.get(ItensPedidoModel, item_id)
        return self._to_entity(model) if model else None

    def list_by_pedido_id(self, pedido_id: int) -> List[ItemPedido]:
        stmt = select(ItensPedidoModel).where(ItensPedidoModel.pedido_id == pedido_id).order_by(ItensPedidoModel.id)
        models = db.session.scalars(stmt).all()
        return [self._to_entity(m) for m in models]

    def list_all(self) -> List[ItemPedido]:
        stmt = select(ItensPedidoModel).order_by(ItensPedidoModel.id.desc())
        models = db.session.scalars(stmt).all()
        return [self._to_entity(m) for m in models]

    def _to_entity(self, model: ItensPedidoModel) -> ItemPedido:
        """Método auxiliar interno para evitar repetição de mapeamento."""
        return ItemPedido(
            id=model.id,
            pedido_id=model.pedido_id,
            item_id=model.item_catalogo_id,
            quantidade=model.quantidade,
            valor_unitario=float(model.valor_unitario),
            valor_total=float(model.valor_total)
        )