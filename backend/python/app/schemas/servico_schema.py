from pydantic import BaseModel, Field

class CreateServicoRequest(BaseModel):
    descricao: str = Field(..., min_length=2, max_length=255, description="Nome ou descrição do serviço")
    preco: float = Field(..., ge=0, description="Preço cobrado pelo serviço")
    tempo_estimado: int = Field(0, ge=0, description="Tempo estimado em minutos para a conclusão do serviço")

class UpdateServicoRequest(BaseModel):
    descricao: str | None = Field(None, min_length=2, max_length=255)
    preco: float | None = Field(None, ge=0)
    tempo_estimado: int | None = Field(None, ge=0)

class ServicoResponse(BaseModel):
    id: int
    descricao: str
    preco: float
    tempo_estimado: int
    criado_em: str
    tipo: str = "servico"