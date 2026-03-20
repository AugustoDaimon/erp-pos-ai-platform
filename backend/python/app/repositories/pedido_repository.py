from ..interfaces.pedido_repository import IPedidoRepository
from ..entities.pedido import Pedido
from ..models.pedido_model import PedidoModel
from ..infrastructure.database.db import db

class PedidoRepository(IPedidoRepository):

    def get_by_id(self, id: int) -> Pedido | None:
        model = db.session.get(PedidoModel, id)
        if model:
            return model.to_entity() 
        return None

    def create(self, pedido: Pedido) -> Pedido:
        model = PedidoModel.from_entity(pedido)
        
        db.session.add(model)
        db.session.commit()
        
        return model.to_entity()

    def list_all(self) -> list[Pedido]:
        # Ordenamos do mais recente para o mais antigo, ideal para telas de histórico de vendas
        stmt = db.select(PedidoModel).order_by(PedidoModel.id.desc())
        models = db.session.scalars(stmt).all()
        
        return [m.to_entity() for m in models]

    def update(self, pedido: Pedido) -> Pedido | None:
        model = db.session.get(PedidoModel, pedido.id)
        if not model:
            return None

        # Atualiza os dados que podem mudar durante a vida útil do pedido
        model.cliente_id = pedido.cliente_id
        model.status_pedido = pedido.status_pedido
        model.metodo_pagamento = pedido.metodo_pagamento
        model.valor_pago = pedido.valor_pago
        model.emitir_nota_fiscal = pedido.emitir_nota_fiscal
        
        # Totais também são atualizados caso itens sejam adicionados/removidos do carrinho
        model.subtotal = pedido.subtotal
        model.taxas_cartao = pedido.taxas_cartao
        model.desconto = pedido.desconto
        model.valor_total = pedido.valor_total
        
        db.session.commit()
        return model.to_entity()

    def delete(self, id: int) -> None:
        model = db.session.get(PedidoModel, id)
        if model:
            db.session.delete(model)
            db.session.commit()