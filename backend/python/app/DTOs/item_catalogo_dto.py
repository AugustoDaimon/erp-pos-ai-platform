from dataclasses import dataclass

# DTO para CRIAÇÃO (Geralmente herdado ou usado em rotas genéricas)
@dataclass
class CreateItemCatalogoDTO:
    """Dados básicos necessários para registrar qualquer item vendável."""
    nome: str
    preco_venda: float
    tipo: str  # 'produto' ou 'servico'


# DTO para ATUALIZAÇÃO
@dataclass
class UpdateItemCatalogoDTO:
    """
    Campos opcionais para atualização genérica no catálogo.
    """
    nome: str | None = None
    preco_venda: float | None = None
    tipo: str | None = None

    def to_dict_exclude_none(self) -> dict:
        from dataclasses import asdict
        return {k: v for k, v in asdict(self).items() if v is not None}


# DTO para LEITURA (O mais usado no PDV / Frente de Caixa)
@dataclass
class ItemCatalogoResponseDTO:
    """Formata os dados da Entidade base do Catálogo para saída."""
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


# DTO para FILTROS/BUSCA (Essencial para o Autocomplete da venda)
@dataclass
class FiltroItemCatalogoDTO:
    """Parâmetros de paginação e busca para a listagem do catálogo."""
    busca_nome: str | None = None
    tipo: str | None = None  # Permite filtrar apenas 'produto' ou apenas 'servico'
    limite: int = 50
    pagina: int = 1