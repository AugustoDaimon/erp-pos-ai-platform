from pydantic import BaseModel, Field

class CreateItemPedidoRequest(BaseModel):
    produto_id: int = Field(..., description="ID do produto ou serviço")
    pedido_id: int | None = Field(None, description="ID do pedido ao qual este item pertence")
    
    # gt=0 garante que a quantidade seja estritamente maior que zero
    quantidade: int = Field(..., gt=0, description="Quantidade comprada")
    
    # ge=0.0 garante que o valor não seja negativo, mas permite itens gratuitos (R$ 0,00)
    valor_unitario: float = Field(..., ge=0.0, description="Valor cobrado no momento da venda")

class UpdateItemPedidoRequest(BaseModel):
    # Usa caso altere a quantidade de um item que já está no carrinho
    quantidade: int | None = Field(None, gt=0)
    valor_unitario: float | None = Field(None, ge=0.0)

class ItemPedidoResponse(BaseModel):
    id: int
    pedido_id: int | None
    produto_id: int
    quantidade: int
    valor_unitario: float
    valor_total: float
    criado_em: str