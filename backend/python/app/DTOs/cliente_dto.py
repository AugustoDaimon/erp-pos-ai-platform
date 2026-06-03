from dataclasses import dataclass

# DTO para CRIAÇÃO
@dataclass
class CreateClienteDTO:
    nome: str
    celular: str | None = None
    sem_whatsapp: bool = False
    bike_info: str | None = None


# DTO para ATUALIZAÇÃO
@dataclass
class UpdateClienteDTO:
    nome: str | None = None
    celular: str | None = None
    sem_whatsapp: bool | None = None
    bike_info: str | None = None

    def to_dict_exclude_none(self) -> dict:
        from dataclasses import asdict
        return {k: v for k, v in asdict(self).items() if v is not None}

# DTO para LEITURA
@dataclass
class ClienteResponseDTO:
    id: int
    nome: str
    celular: str | None
    sem_whatsapp: bool
    bike_info: str | None
    criado_em: str

    @classmethod
    def from_entity(cls, entity):
        return cls(
            id=entity.id,
            nome=entity.nome,
            celular=entity.celular,
            sem_whatsapp=entity.sem_whatsapp,
            bike_info=entity.bike_info,
            criado_em=entity.criado_em.strftime("%Y-%m-%d %H:%M:%S") if entity.criado_em else ""
        )
    
@dataclass
class FiltroClienteDTO:
    busca_nome: str | None = None
    sem_whatsapp: bool | None = None
    limite: int = 50
    pagina: int = 1