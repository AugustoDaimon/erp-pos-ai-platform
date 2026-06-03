from dataclasses import dataclass

@dataclass
class CreateServicoDTO:
    descricao: str
    preco: float
    tempo_estimado: int = 0

@dataclass
class UpdateServicoDTO:
    descricao: str | None = None
    preco: float | None = None
    tempo_estimado: int | None = None

    def to_dict_exclude_none(self) -> dict:
        from dataclasses import asdict
        return {k: v for k, v in asdict(self).items() if v is not None}

@dataclass
class ServicoResponseDTO:
    id: int
    descricao: str
    preco: float
    tempo_estimado: int
    criado_em: str
    tipo: str 

    @classmethod
    def from_entity(cls, entity):
        return cls(
            id=entity.id,
            descricao=entity.descricao,
            preco=entity.preco,
            tempo_estimado=entity.tempo_estimado,
            criado_em=entity.criado_em.strftime("%Y-%m-%d %H:%M:%S") if entity.criado_em else "",
            tipo=getattr(entity, 'tipo', 'servico')
        )

@dataclass
class FiltroServicoDTO:
    busca_descricao: str | None = None
    # Removido cliente_id e apenas_atrasados, pois já não fazem sentido no catálogo