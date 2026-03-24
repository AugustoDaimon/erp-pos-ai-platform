from datetime import datetime
from ..entities.item_pedido import ItemPedido

class Pedido:
    def __init__(
        self,
        id: int | None = None,
        cliente_id: int | None = None,
        subtotal: float = 0.0,
        taxas_cartao: float = 0.0,
        desconto: float = 0.0,
        valor_total: float = 0.0,
        valor_pago: float = 0.0,
        metodo_pagamento: str | None = None,
        emitir_nota_fiscal: bool = False,
        status_pedido: str = "CONCLUIDO",
        status_oficina: str = "NAO_APLICAVEL",
        data_prevista_retirada: datetime | None = None,
        data_entrega_real: datetime | None = None,
        criado_em: datetime | None = None,
        itens: list[ItemPedido] | None = None
    ):
        self.id = id
        self.cliente_id = cliente_id
        self.subtotal = subtotal
        self.taxas_cartao = taxas_cartao
        self.desconto = desconto
        self.valor_total = valor_total
        self.valor_pago = valor_pago
        self.metodo_pagamento = metodo_pagamento
        self.emitir_nota_fiscal = emitir_nota_fiscal
        self.status_pedido = status_pedido
        self.status_oficina = status_oficina
        self.data_prevista_retirada = data_prevista_retirada
        self.data_entrega_real = data_entrega_real
        self.criado_em = criado_em
        self.itens = itens or []

    @property
    def saldo_devedor(self) -> float:
        """Calcula quanto falta o cliente pagar na retirada."""
        return max(0.0, self.valor_total - self.valor_pago)

    @property
    def esta_atrasado(self) -> bool:
        """Verifica se a bike deveria ter sido entregue e não foi."""
        if self.data_prevista_retirada and self.status_oficina != "ENTREGUE":
            return datetime.now() > self.data_prevista_retirada
        return False

    def calcular_totais(self):
        """Atualiza o subtotal e o valor_total com base nos itens e descontos."""
        self.subtotal = sum(item.valor_total for item in self.itens)
        # Lógica: (Subtotal + Taxas) - Desconto
        self.valor_total = (self.subtotal + self.taxas_cartao) - self.desconto