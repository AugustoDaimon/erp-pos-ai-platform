from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CreateItemPedidoRequest(BaseModel):
    item_id: int = Field(..., gt=0, description="ID do produto ou serviço no catálogo")
    quantidade: int = Field(..., gt=0, description="A quantidade deve ser pelo menos 1")
    valor_unitario: float = Field(..., ge=0, description="O preço não pode ser negativo")
    valor_total: float | None = Field(None, ge=0)

class ItemPedidoResponse(BaseModel):
    id: int
    item_id: int
    quantidade: int
    valor_unitario: float
    valor_total: float

class CreatePedidoRequest(BaseModel):
    cliente_id: int | None = Field(None, gt=0)
    
    subtotal: float = Field(0.0, ge=0)
    taxas_cartao: float = Field(0.0, ge=0)
    desconto: float = Field(0.0, ge=0)
    valor_pago: float = Field(0.0, ge=0)
    
    metodo_pagamento: str | None = Field(None, max_length=50)
    emitir_nota_fiscal: bool = False
    
    status_pedido: str = Field("CONCLUIDO", description="PENDENTE, CONCLUIDO ou CANCELADO")
    status_oficina: str = Field("NAO_APLICAVEL", description="NAO_APLICAVEL, FILA, MANUTENCAO, PRONTO, ENTREGUE")    
    data_prevista_retirada: datetime | None = None    
    itens: List[CreateItemPedidoRequest] = Field(..., min_length=1, description="O pedido deve ter pelo menos 1 item")

class UpdatePedidoRequest(BaseModel):
    status_pedido: str | None = None
    status_oficina: str | None = None
    metodo_pagamento: str | None = None
    valor_pago: float | None = Field(None, ge=0)
    data_prevista_retirada: datetime | None = None
    data_entrega_real: datetime | None = None

class PedidoResponse(BaseModel):
    id: int
    cliente_id: int | None
    
    subtotal: float
    taxas_cartao: float
    desconto: float
    valor_total: float
    valor_pago: float
    saldo_devedor: float 
    
    metodo_pagamento: str | None
    emitir_nota_fiscal: bool
    status_pedido: str
    status_oficina: str
    
    esta_atrasado: bool = False
    data_prevista_retirada: datetime | None
    data_entrega_real: datetime | None
    criado_em: datetime
    
    itens: List[ItemPedidoResponse]

    class Config:
        from_attributes = True