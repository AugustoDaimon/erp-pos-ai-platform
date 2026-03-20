from dataclasses import dataclass

@dataclass
class CreateSubcategoriaDTO:
    categoria_id: int
    nome: str

@dataclass
class UpdateSubcategoriaDTO:
    categoria_id: int | None = None
    nome: str | None = None

    def to_dict_exclude_none(self) -> dict:
        from dataclasses import asdict
        return {k: v for k, v in asdict(self).items() if v is not None}

@dataclass
class SubcategoriaResponseDTO:
    id: int
    categoria_id: int
    nome: str
    criado_em: str

    @classmethod
    def from_entity(cls, entity):
        return cls(
            id=entity.id,
            categoria_id=entity.categoria_id,
            nome=entity.nome,
            criado_em=entity.criado_em.strftime("%Y-%m-%d %H:%M:%S") if entity.criado_em else ""
        )

@dataclass
class FiltroSubcategoriaDTO:
    categoria_id: int | None = None # Super útil para listar só as subcategorias de uma categoria específica!
    busca_nome: str | None = None