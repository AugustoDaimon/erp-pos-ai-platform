from pydantic import BaseModel, Field

class CreatePedidoRequest(BaseModel):
    # Cliente é opcional (venda avulsa)
    cliente_id: int | None = Field(None, description="ID do cliente. Nulo se for venda sem cadastro.")
    
    # Valores financeiros não podem ser negativos (ge=0.0)
    subtotal: float = Field(..., ge=0.0, description="Soma do valor dos itens")
    taxas_cartao: float = Field(default=0.0, ge=0.0)
    desconto: float = Field(default=0.0, ge=0.0)
    valor_pago: float = Field(default=0.0, ge=0.0)
    
    metodo_pagamento: str | None = Field(None, max_length=50, description="Ex: PIX, DINHEIRO, CARTAO_CREDITO")
    emitir_nota_fiscal: bool = Field(default=False)
    status_pedido: str = Field(default='CONCLUIDO', max_length=50)

class UpdatePedidoRequest(BaseModel):
    # Geralmente usado para atualizar o status do pagamento ou do pedido
    status_pedido: str | None = Field(None, max_length=50)
    metodo_pagamento: str | None = Field(None, max_length=50)
    valor_pago: float | None = Field(None, ge=0.0)
    emitir_nota_fiscal: bool | None = None

class PedidoResponse(BaseModel):
    # Formato de saída para o JSON
    id: int
    cliente_id: int | None
    subtotal: float
    taxas_cartao: float
    desconto: float
    valor_total: float
    valor_pago: float
    troco: float
    metodo_pagamento: str | None
    emitir_nota_fiscal: bool
    status_pedido: str
    criado_em: str