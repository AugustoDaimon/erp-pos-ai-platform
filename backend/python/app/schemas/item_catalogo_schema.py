from pydantic import BaseModel, Field
from datetime import datetime

class CreateItemCatalogoRequest(BaseModel):
    """
    Nota arquitetural: Geralmente não usado diretamente pela API, 
    pois cria-se Produtos ou Serviços específicos. Mantido para consistência.
    """
    nome: str = Field(..., min_length=2, max_length=255, description="Nome do item ou serviço")
    preco_venda: float = Field(..., ge=0, description="Preço final para o cliente")
    tipo: str = Field(..., pattern="^(produto|servico)$", description="Deve ser 'produto' ou 'servico'")

class UpdateItemCatalogoRequest(BaseModel):
    """Schema para atualizações genéricas no catálogo (PATCH)."""
    nome: str | None = Field(None, min_length=2, max_length=255)
    preco_venda: float | None = Field(None, ge=0)
    tipo: str | None = Field(None, pattern="^(produto|servico)$")

class ItemCatalogoResponse(BaseModel):
    """
    O Schema MAIS IMPORTANTE do catálogo. 
    Usado para o Autocomplete/Busca rápida na tela de Frente de Caixa (PDV).
    """
    id: int
    nome: str
    preco_venda: float
    tipo: str
    criado_em: datetime

    class Config:
        # Permite que o Pydantic leia diretamente dos objetos do SQLAlchemy/Entities
        from_attributes = True