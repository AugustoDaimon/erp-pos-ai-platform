from pydantic import BaseModel, Field

class CreateProdutoRequest(BaseModel):
    descricao: str = Field(..., min_length=2, max_length=255)
    valor_venda: float = Field(..., ge=0) # Perfeito o uso do ge=0!
    
    # Chaves Estrangeiras Opcionais
    categoria_id: int | None = Field(None, gt=0)
    subcategoria_id: int | None = Field(None, gt=0)
    marca_id: int | None = Field(None, gt=0)
    
    # Textos
    observacao: str | None = None
    sku: str | None = None
    imagem_url: str | None = None
    
    # Valores Opcionais com default 0
    valor_instalacao: float = Field(0.0, ge=0)
    custo_compra: float = Field(0.0, ge=0)
    estoque_atual: int = Field(0, ge=0)
    estoque_minimo: int = Field(0, ge=0)
    
    # Especificações
    especificacao_1: str | None = None
    especificacao_2: str | None = None
    especificacao_3: str | None = None

class UpdateProdutoRequest(BaseModel):
    # Todos os campos opcionais (PATCH perfeito)
    descricao: str | None = Field(None, min_length=2, max_length=255)
    valor_venda: float | None = Field(None, ge=0)
    categoria_id: int | None = Field(None, gt=0)
    subcategoria_id: int | None = Field(None, gt=0)
    marca_id: int | None = Field(None, gt=0)
    observacao: str | None = None
    sku: str | None = None
    valor_instalacao: float | None = Field(None, ge=0)
    custo_compra: float | None = Field(None, ge=0)
    estoque_atual: int | None = Field(None, ge=0)
    estoque_minimo: int | None = Field(None, ge=0)
    especificacao_1: str | None = None
    especificacao_2: str | None = None
    especificacao_3: str | None = None
    imagem_url: str | None = None

class ProdutoResponse(BaseModel):
    id: int
    categoria_id: int | None
    subcategoria_id: int | None
    marca_id: int | None
    descricao: str
    observacao: str | None
    sku: str | None
    valor_venda: float
    valor_instalacao: float
    custo_compra: float
    estoque_atual: int
    estoque_minimo: int
    especificacao_1: str | None
    especificacao_2: str | None
    especificacao_3: str | None
    imagem_url: str | None
    criado_em: str
    tipo: str = "produto" 