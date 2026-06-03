from pydantic import BaseModel, Field
from datetime import datetime

class CreateItemCatalogoRequest(BaseModel):
    """
    Nota arquitetural: NAO deve ser usado diretamente pela API, 
    pois cria-se Produtos ou Serviços específicos. Mantido para consistência e debug.
    """
    nome: str = Field(..., min_length=2, max_length=255, description="Nome do item ou serviço")
    preco_venda: float = Field(..., ge=0, description="Preço final para o cliente")
    tipo: str = Field(..., pattern="^(produto|servico)$", description="Deve ser 'produto' ou 'servico'")

class UpdateItemCatalogoRequest(BaseModel):
    nome: str | None = Field(None, min_length=2, max_length=255)
    preco_venda: float | None = Field(None, ge=0)
    tipo: str | None = Field(None, pattern="^(produto|servico)$")

class ItemCatalogoResponse(BaseModel):
    """Usado para o Autocomplete na tela de Frente de Caixa."""
    id: int
    nome: str
    preco_venda: float
    tipo: str
    criado_em: datetime

    class Config:
        from_attributes = True