from pydantic import BaseModel, Field

class CreateMarcaRequest(BaseModel):
    nome: str = Field(
        ..., 
        min_length=2, 
        max_length=100, 
        description="Nome único da Marca (Ex: Shimano, Maxxis)"
    )
    # Se o frontend não enviar nada, o default_factory garante que vire uma lista vazia []
    categorias_vinculadas: list[int] = Field(
        default_factory=list,
        description="Lista de IDs das categorias às quais esta marca pertence"
    )

class UpdateMarcaRequest(BaseModel):
    nome: str | None = Field(
        None, 
        min_length=2, 
        max_length=100,
        description="Novo nome para a Marca"
    )
    categorias_vinculadas: list[int] | None = Field(
        None,
        description="Nova lista completa de IDs de categorias"
    )

class MarcaResponse(BaseModel):
    id: int
    nome: str
    categorias_vinculadas: list[int]
    criado_em: str