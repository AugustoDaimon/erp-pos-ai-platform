from datetime import datetime
from ..entities.item_catalogo import ItemCatalogo


class Produto(ItemCatalogo):
    def __init__(
        self,
        descricao: str,
        valor_venda: float,
        categoria_id: int | None = None,
        subcategoria_id: int | None = None,
        marca_id: int | None = None,
        observacao: str | None = None,
        sku: str | None = None,
        valor_instalacao: float = 0.0,
        custo_compra: float = 0.0,
        estoque_atual: int = 0,
        estoque_minimo: int = 0,
        especificacao_1: str | None = None,
        especificacao_2: str | None = None,
        especificacao_3: str | None = None,
        imagem_url: str | None = None,
        id: int | None = None,
        criado_em: datetime | None = None
    ):
        # Inicializa o pai (ItemCatalogo)
        super().__init__(
            nome=descricao, 
            preco_venda=valor_venda, 
            tipo='produto', 
            id=id, 
            criado_em=criado_em
        )
        
        # Atributos específicos de Produto
        self.descricao = descricao # Mantemos para compatibilidade
        self.valor_venda = valor_venda
        self.categoria_id = categoria_id
        self.subcategoria_id = subcategoria_id
        self.marca_id = marca_id
        self.observacao = observacao
        self.sku = sku
        self.valor_instalacao = valor_instalacao
        self.custo_compra = custo_compra
        self.estoque_atual = estoque_atual
        self.estoque_minimo = estoque_minimo
        self.especificacao_1 = especificacao_1
        self.especificacao_2 = especificacao_2
        self.especificacao_3 = especificacao_3
        self.imagem_url = imagem_url