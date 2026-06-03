from pydantic import BaseModel, Field

class CreateSubcategoriaRequest(BaseModel):
    categoria_id: int = Field(
        ..., 
        gt=0, 
        description="ID numérico da Categoria Pai ao qual esta subcategoria pertence"
    )
    nome: str = Field(
        ..., 
        min_length=2, 
        max_length=100, 
        description="Nome único da Subcategoria dentro da Categoria Pai"
    )

class UpdateSubcategoriaRequest(BaseModel):
    categoria_id: int | None = Field(
        None, 
        gt=0, 
        description="Novo ID da Categoria Pai (caso queira mover a subcategoria)"
    )
    nome: str | None = Field(
        None, 
        min_length=2, 
        max_length=100,
        description="Novo nome para a Subcategoria"
    )

class SubcategoriaResponse(BaseModel):
    id: int
    categoria_id: int
    nome: str
    criado_em: str