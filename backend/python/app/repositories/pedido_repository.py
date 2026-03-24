from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, func
from ..interfaces.pedido_repository import IPedidoRepository
from ..entities.pedido import Pedido
from ..entities.item_pedido import ItemPedido
from ..models.pedido_model import PedidoModel
from ..models.itens_pedido_model import ItensPedidoModel
from ..infrastructure.database.db import db

class PedidoRepository(IPedidoRepository):

    def create(self, pedido: Pedido) -> Pedido:
        # 1. Converte a Entity Pedido para o Model
        model = PedidoModel(
            cliente_id=pedido.cliente_id,
            subtotal=pedido.subtotal,
            taxas_cartao=pedido.taxas_cartao,
            desconto=pedido.desconto,
            valor_total=pedido.valor_total,
            valor_pago=pedido.valor_pago,
            metodo_pagamento=pedido.metodo_pagamento,
            emitir_nota_fiscal=pedido.emitir_nota_fiscal,
            status_pedido=pedido.status_pedido,
            status_oficina=pedido.status_oficina,
            data_prevista_retirada=pedido.data_prevista_retirada
        )

        # 2. Converte e anexa os itens (O SQLAlchemy cuidará das FKs automaticamente)
        for item_entity in pedido.itens:
            item_model = ItensPedidoModel(
                item_catalogo_id=item_entity.item_id,
                quantidade=item_entity.quantidade,
                valor_unitario=item_entity.valor_unitario,
                valor_total=item_entity.valor_total
            )
            model.itens.append(item_model)

        db.session.add(model)
        db.session.commit()
        
        # 3. Retorna a entity com o ID gerado pelo banco
        return self._map_to_entity(model)

    def find_by_id(self, pedido_id: int) -> Optional[Pedido]:
        model = db.session.get(PedidoModel, pedido_id)
        return self._map_to_entity(model) if model else None

    def update_status(self, pedido_id: int, novo_status: str) -> bool:
        model = db.session.get(PedidoModel, pedido_id)
        if not model:
            return False
        
        model.status_pedido = novo_status
        db.session.commit()
        return True

    def find_by_cliente(self, cliente_id: int) -> List[Pedido]:
        stmt = select(PedidoModel).where(PedidoModel.cliente_id == cliente_id).order_by(PedidoModel.id.desc())
        models = db.session.scalars(stmt).all()
        return [self._map_to_entity(m) for m in models]

    def list_by_status_oficina(self, status: str) -> List[Pedido]:
        stmt = select(PedidoModel).where(PedidoModel.status_oficina == status)
        models = db.session.scalars(stmt).all()
        return [self._map_to_entity(m) for m in models]

    def list_atrasados(self) -> List[Pedido]:
        # Filtra: data prevista menor que agora E não foi entregue
        stmt = select(PedidoModel).where(
            PedidoModel.data_prevista_retirada < func.now(),
            PedidoModel.status_oficina != 'ENTREGUE',
            PedidoModel.status_pedido != 'CANCELADO'
        )
        models = db.session.scalars(stmt).all()
        return [self._map_to_entity(m) for m in models]

    def _map_to_entity(self, model: PedidoModel) -> Pedido:
        """Método auxiliar para converter o Model (e seus itens) de volta para Entity."""
        itens_entities = [
            ItemPedido(
                id=m.id,
                item_id=m.item_catalogo_id,
                quantidade=m.quantidade,
                valor_unitario=float(m.valor_unitario),
                valor_total=float(m.valor_total),
                pedido_id=m.pedido_id
            ) for m in model.itens
        ]

        return Pedido(
            id=model.id,
            cliente_id=model.cliente_id,
            subtotal=float(model.subtotal),
            taxas_cartao=float(model.taxas_cartao),
            desconto=float(model.desconto),
            valor_total=float(model.valor_total),
            valor_pago=float(model.valor_pago),
            metodo_pagamento=model.metodo_pagamento,
            emitir_nota_fiscal=model.emitir_nota_fiscal,
            status_pedido=model.status_pedido,
            status_oficina=model.status_oficina,
            data_prevista_retirada=model.data_prevista_retirada,
            data_entrega_real=model.data_entrega_real,
            criado_em=model.criado_em,
            itens=itens_entities
        )