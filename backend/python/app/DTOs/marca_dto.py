from dataclasses import dataclass, field

@dataclass
class CreateMarcaDTO:
    nome: str
    categorias_vinculadas: list[int] = field(default_factory=list)

@dataclass
class UpdateMarcaDTO:
    nome: str | None = None
    categorias_vinculadas: list[int] | None = None

    def to_dict_exclude_none(self) -> dict:
        from dataclasses import asdict
        return {k: v for k, v in asdict(self).items() if v is not None}

@dataclass
class MarcaResponseDTO:
    id: int
    nome: str
    categorias_vinculadas: list[int]
    criado_em: str

    @classmethod
    def from_entity(cls, entity):
        return cls(
            id=entity.id,
            nome=entity.nome,
            categorias_vinculadas=entity.categorias_vinculadas,
            criado_em=entity.criado_em.strftime("%Y-%m-%d %H:%M:%S") if entity.criado_em else ""
        )