from pydantic import BaseModel, Field

class CreateCategoriaRequest(BaseModel):
    nome: str = Field(
        ..., 
        min_length=2, 
        max_length=100, 
        description="Nome único da Categoria (Ex: Bicicletas, Acessórios)"
    )


class UpdateCategoriaRequest(BaseModel):
    nome: str | None = Field(
        None, 
        min_length=2, 
        max_length=100,
        description="Novo nome para a Categoria"
    )


class CategoriaResponse(BaseModel):
    id: int
    nome: str
    criado_em: str