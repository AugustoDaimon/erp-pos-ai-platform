from datetime import datetime

class Pedido:
    def __init__(
            self, 
            cliente_id: int | None = None,
            subtotal: float = 0.0,
            taxas_cartao: float = 0.0,
            desconto: float = 0.0,
            valor_total: float = 0.0,
            valor_pago: float = 0.0,
            metodo_pagamento: str | None = None,
            emitir_nota_fiscal: bool = False,
            status_pedido: str = 'CONCLUIDO',
            id: int | None = None,
            criado_em: datetime | None = None
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
        self.criado_em = criado_em

    def __repr__(self):
        return f"<Pedido {self.id or 'Novo'} - Total: R$ {self.valor_total:.2f} ({self.status_pedido})>"