from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# ==========================================
# 1. Schemas dos Itens Aninhados
# ==========================================

class CreateItemPedidoRequest(BaseModel):
    """Schema para a linha do carrinho de compras vinda do frontend."""
    item_id: int = Field(..., gt=0, description="ID do produto ou serviço no catálogo")
    quantidade: int = Field(..., gt=0, description="A quantidade deve ser pelo menos 1")
    valor_unitario: float = Field(..., ge=0, description="O preço não pode ser negativo")
    
    # Opcional: Se o front mandar o subtotal da linha, podemos receber, 
    # mas o nosso Service vai recalcular para evitar fraudes.
    valor_total: float | None = Field(None, ge=0)

class ItemPedidoResponse(BaseModel):
    """Schema de saída para a linha do pedido."""
    id: int
    item_id: int
    quantidade: int
    valor_unitario: float
    valor_total: float

# ==========================================
# 2. Schemas do Pedido (Cabeçalho)
# ==========================================

class CreatePedidoRequest(BaseModel):
    """Schema de entrada para criar uma nova venda/OS."""
    cliente_id: int | None = Field(None, gt=0)
    
    # Valores Financeiros
    subtotal: float = Field(0.0, ge=0) # Opcional: O front manda para conferência
    taxas_cartao: float = Field(0.0, ge=0)
    desconto: float = Field(0.0, ge=0)
    valor_pago: float = Field(0.0, ge=0)
    
    # Configurações
    metodo_pagamento: str | None = Field(None, max_length=50)
    emitir_nota_fiscal: bool = False
    
    # Status (Poderíamos usar Enum aqui, mas string com documentação serve bem)
    status_pedido: str = Field("CONCLUIDO", description="PENDENTE, CONCLUIDO ou CANCELADO")
    status_oficina: str = Field("NAO_APLICAVEL", description="NAO_APLICAVEL, FILA, MANUTENCAO, PRONTO, ENTREGUE")
    
    # Datas
    data_prevista_retirada: datetime | None = None
    
    # A MÁGICA DO PYDANTIC: Valida a lista e garante que tem pelo menos 1 item
    itens: List[CreateItemPedidoRequest] = Field(..., min_length=1, description="O pedido deve ter pelo menos 1 item")

class UpdatePedidoRequest(BaseModel):
    """
    Schema para atualizações pontuais (PATCH).
    Geralmente usado para mudar status da oficina, dar baixa em pagamento ou mudar datas.
    """
    status_pedido: str | None = None
    status_oficina: str | None = None
    metodo_pagamento: str | None = None
    valor_pago: float | None = Field(None, ge=0)
    data_prevista_retirada: datetime | None = None
    data_entrega_real: datetime | None = None

class PedidoResponse(BaseModel):
    """
    Schema completo de saída. É este JSON que vai popular 
    o recibo e a tela de detalhes do Pedido no React.
    """
    id: int
    cliente_id: int | None
    
    # Resumo Financeiro
    subtotal: float
    taxas_cartao: float
    desconto: float
    valor_total: float
    valor_pago: float
    saldo_devedor: float  # Exposto pelas @property da sua Entity!
    
    # Informações
    metodo_pagamento: str | None
    emitir_nota_fiscal: bool
    status_pedido: str
    status_oficina: str
    
    # Datas formatadas
    esta_atrasado: bool   # Exposto pelas @property da sua Entity!
    data_prevista_retirada: datetime | None
    data_entrega_real: datetime | None
    criado_em: datetime
    
    # Lista de Itens
    itens: List[ItemPedidoResponse]

    class Config:
        # Se você estiver usando Pydantic V2, from_attributes substitui o antigo orm_mode
        from_attributes = True