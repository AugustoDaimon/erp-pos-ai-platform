from dataclasses import dataclass

# DTO para CRIAÇÃO
@dataclass
class CreateCategoriaDTO:
    """Dados necessários para registrar uma nova categoria."""
    nome: str


# DTO para ATUALIZAÇÃO
@dataclass
class UpdateCategoriaDTO:
    """
    Campos opcionais para atualização. 
    Na Categoria, apenas o nome pode ser alterado.
    """
    nome: str | None = None

    def to_dict_exclude_none(self) -> dict:
        from dataclasses import asdict
        return {k: v for k, v in asdict(self).items() if v is not None}


# DTO para LEITURA
@dataclass
class CategoriaResponseDTO:
    """Formata os dados da Entidade Categoria para saída."""
    id: int
    nome: str
    criado_em: str

    @classmethod
    def from_entity(cls, entity):
        return cls(
            id=entity.id,
            nome=entity.nome,
            criado_em=entity.criado_em.strftime("%Y-%m-%d %H:%M:%S") if entity.criado_em else ""
        )


# DTO para FILTROS/BUSCA
@dataclass
class FiltroCategoriaDTO:
    """Parâmetros de paginação e busca para listagem de categorias."""
    busca_nome: str | None = None
    limite: int = 50
    pagina: int = 1