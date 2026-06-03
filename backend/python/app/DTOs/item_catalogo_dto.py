from dataclasses import dataclass

# DTO para CRIAÇÃO
@dataclass
class CreateItemCatalogoDTO:
    nome: str
    preco_venda: float
    tipo: str  # 'produto' ou 'servico'


# DTO para ATUALIZAÇÃO
@dataclass
class UpdateItemCatalogoDTO:
    nome: str | None = None
    preco_venda: float | None = None
    tipo: str | None = None

    def to_dict_exclude_none(self) -> dict:
        from dataclasses import asdict
        return {k: v for k, v in asdict(self).items() if v is not None}


# DTO para LEITURA 
@dataclass
class ItemCatalogoResponseDTO:
    id: int
    nome: str
    preco_venda: float
    tipo: str
    criado_em: str

    @classmethod
    def from_entity(cls, entity):
        return cls(
            id=entity.id,
            nome=entity.nome,
            preco_venda=entity.preco_venda,
            tipo=entity.tipo,
            criado_em=entity.criado_em.strftime("%Y-%m-%d %H:%M:%S") if entity.criado_em else ""
        )


# DTO para FILTROS/BUSCA
@dataclass
class FiltroItemCatalogoDTO:
    busca_nome: str | None = None
    tipo: str | None = None  # Permite filtrar apenas 'produto' ou apenas 'servico'
    limite: int = 50
    pagina: int = 1