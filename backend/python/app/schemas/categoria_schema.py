from pydantic import BaseModel, Field

class CreateCategoriaRequest(BaseModel):
    # O max_length=100 reflete a restrição VARCHAR(100) do banco de dados
    nome: str = Field(
        ..., 
        min_length=2, 
        max_length=100, 
        description="Nome único da Categoria (Ex: Bicicletas, Acessórios)"
    )


class UpdateCategoriaRequest(BaseModel):
    # Todos os campos opcionais para permitir o PATCH
    nome: str | None = Field(
        None, 
        min_length=2, 
        max_length=100,
        description="Novo nome para a Categoria"
    )


class CategoriaResponse(BaseModel):
    # Formato final que será convertido em JSON para o Frontend
    id: int
    nome: str
    criado_em: str