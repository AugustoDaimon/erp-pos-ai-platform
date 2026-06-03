from dataclasses import dataclass

@dataclass
class CreateProdutoDTO:
    descricao: str
    valor_venda: float
    categoria_id: int | None = None
    subcategoria_id: int | None = None
    marca_id: int | None = None
    observacao: str | None = None
    sku: str | None = None
    valor_instalacao: float = 0.0
    custo_compra: float = 0.0
    estoque_atual: int = 0
    estoque_minimo: int = 0
    especificacao_1: str | None = None
    especificacao_2: str | None = None
    especificacao_3: str | None = None
    imagem_url: str | None = None

@dataclass
class UpdateProdutoDTO:
    descricao: str | None = None
    valor_venda: float | None = None
    categoria_id: int | None = None
    subcategoria_id: int | None = None
    marca_id: int | None = None
    observacao: str | None = None
    sku: str | None = None
    valor_instalacao: float | None = None
    custo_compra: float | None = None
    estoque_atual: int | None = None
    estoque_minimo: int | None = None
    especificacao_1: str | None = None
    especificacao_2: str | None = None
    especificacao_3: str | None = None
    imagem_url: str | None = None

    def to_dict_exclude_none(self) -> dict:
        from dataclasses import asdict
        return {k: v for k, v in asdict(self).items() if v is not None}

@dataclass
class ProdutoResponseDTO:
    id: int
    categoria_id: int | None
    subcategoria_id: int | None
    marca_id: int | None
    descricao: str
    observacao: str | None
    sku: str | None
    valor_venda: float
    valor_instalacao: float
    custo_compra: float
    estoque_atual: int
    estoque_minimo: int
    especificacao_1: str | None
    especificacao_2: str | None
    especificacao_3: str | None
    imagem_url: str | None
    criado_em: str
    tipo: str 

    @classmethod
    def from_entity(cls, entity):
        return cls(
            id=entity.id,
            categoria_id=entity.categoria_id,
            subcategoria_id=entity.subcategoria_id,
            marca_id=entity.marca_id,
            descricao=entity.descricao,
            observacao=entity.observacao,
            sku=entity.sku,
            valor_venda=entity.valor_venda,
            valor_instalacao=entity.valor_instalacao,
            custo_compra=entity.custo_compra,
            estoque_atual=entity.estoque_atual,
            estoque_minimo=entity.estoque_minimo,
            especificacao_1=entity.especificacao_1,
            especificacao_2=entity.especificacao_2,
            especificacao_3=entity.especificacao_3,
            imagem_url=entity.imagem_url,
            criado_em=entity.criado_em.strftime("%Y-%m-%d %H:%M:%S") if entity.criado_em else "",
            tipo=getattr(entity, 'tipo', 'produto')
        )

@dataclass
class FiltroProdutoDTO:
    categoria_id: int | None = None
    marca_id: int | None = None
    busca_descricao: str | None = None
    estoque_baixo: bool = False