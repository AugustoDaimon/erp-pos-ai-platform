from datetime import datetime
from ..entities.item_catalogo import ItemCatalogo

class Produto(ItemCatalogo):
    """Entidade de domínio que representa um produto físico vendido na loja.
    Obs: Herda características base de ItemCatalogo (nome, preço).

    Attributes:
        descricao (str): Apelido para o atributo 'nome' herdado.
        valor_venda (float): Apelido para o atributo 'preco_venda' herdado.
        categoria_id (int | None): ID da categoria do produto.
        subcategoria_id (int | None): ID da subcategoria do produto.
        marca_id (int | None): ID da marca do produto.
        observacao (str | None): Notas internas do produto (Máximo de 200 caracteres).
        sku (str | None): Código único de estoque (Máximo de 20 caracteres).
        valor_instalacao (float): Preço cobrado pela mão de obra de instalação.
        custo_compra (float): Custo pago ao fornecedor.
        estoque_atual (int): Quantidade física disponível.
        estoque_minimo (int): Ponto de alerta para reposição.
        especificacao_1 (str | None): Detalhe técnico 1 (Cor, Tam, Tipo, Modelo, etc..) (Máximo de 100 caracteres).
        especificacao_2 (str | None): Detalhe técnico 2 (Máximo de 100 caracteres).
        especificacao_3 (str | None): Detalhe técnico 3 (Máximo de 100 caracteres).
        imagem_url (str | None): Link para a foto do produto.
    """

    MAX_SIZE_SKU = 20
    MAX_SIZE_OBSERVACAO = 200
    MAX_SIZE_ESPECIFICACAO = 100
    MAX_SIZE_URL = 2048

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
            criado_em: datetime | None = None):
        
        super().__init__(         # Inicializa o ItemCatalogo que valida nome, preço e ID.
            nome=descricao, 
            preco_venda=valor_venda, 
            tipo='produto',     # TODO: enum TipoItem.PRODUTO futuramente
            id=id, 
            criado_em=criado_em
        )
        
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

    # Apelidos para atributos herdados
    @property
    def descricao(self) -> str:
        return self.nome

    @descricao.setter
    def descricao(self, valor: str):
        self.nome = valor  

    @property
    def valor_venda(self) -> float:
        return self.preco_venda

    @valor_venda.setter
    def valor_venda(self, valor: float):
        self.preco_venda = valor 

    # Encapsulamento Financeiro e Estoque
    @property
    def valor_instalacao(self) -> float: return self._valor_instalacao
    @valor_instalacao.setter
    def valor_instalacao(self, valor: float):
        val = float(valor)
        if val < 0: raise ValueError("O valor de instalação não pode ser negativo.")
        self._valor_instalacao = val

    @property
    def custo_compra(self) -> float: return self._custo_compra
    @custo_compra.setter
    def custo_compra(self, valor: float):
        val = float(valor)
        if val < 0: raise ValueError("O custo de compra não pode ser negativo.")
        self._custo_compra = val

    @property
    def estoque_atual(self) -> int: return self._estoque_atual
    @estoque_atual.setter
    def estoque_atual(self, valor: int):
        val = int(valor)
        if val < 0: raise ValueError("O estoque atual não pode ser negativo.")
        self._estoque_atual = val

    @property
    def estoque_minimo(self) -> int: return self._estoque_minimo
    @estoque_minimo.setter
    def estoque_minimo(self, valor: int):
        val = int(valor)
        if val < 0: raise ValueError("O estoque mínimo não pode ser negativo.")
        self._estoque_minimo = val

    # Encapsulamento de Strings Limitadas
    @property
    def sku(self) -> str | None: return self._sku
    @sku.setter
    def sku(self, valor: str | None):
        if not valor or not str(valor).strip():
            self._sku = None
        else:
            val_limpo = str(valor).strip().upper()
            if len(val_limpo) > self.MAX_SIZE_SKU:
                raise ValueError(f"SKU não pode exceder {self.MAX_SIZE_SKU} caracteres.")
            self._sku = val_limpo

    def _set_string(self, valor, limite):
        if valor and len(valor) > limite and not valor.startswith("data:image/"):
            raise ValueError(f"O texto excede o limite de {limite} caracteres.")
        return valor

    @property
    def observacao(self) -> str | None: return self._observacao
    @observacao.setter
    def observacao(self, valor: str | None):
        self._observacao = self._set_string(valor, self.MAX_SIZE_OBSERVACAO)

    @property
    def especificacao_1(self) -> str | None: return self._especificacao_1
    @especificacao_1.setter
    def especificacao_1(self, valor: str | None):
        self._especificacao_1 = self._set_string(valor, self.MAX_SIZE_ESPECIFICACAO)

    @property
    def especificacao_2(self) -> str | None: return self._especificacao_2
    @especificacao_2.setter
    def especificacao_2(self, valor: str | None):
        self._especificacao_2 = self._set_string(valor, self.MAX_SIZE_ESPECIFICACAO)

    @property
    def especificacao_3(self) -> str | None: return self._especificacao_3
    @especificacao_3.setter
    def especificacao_3(self, valor: str | None):
        self._especificacao_3 = self._set_string(valor, self.MAX_SIZE_ESPECIFICACAO)

    @property
    def imagem_url(self) -> str | None: return self._imagem_url
    @imagem_url.setter
    def imagem_url(self, valor: str | None):
        self._imagem_url = self._set_string(valor, self.MAX_SIZE_URL)

    def __repr__(self) -> str:
        """Dois produtos são iguais se tiverem mesmo ID, Nome, Preço e SKU."""
        return f"<Produto {self.id or 'Novo'} | SKU: {self.sku or 'S/N'} | {self.descricao} (R$ {self.valor_venda:.2f})>"

    def __eq__(self, other: object) -> bool:

        if not isinstance(other, Produto):
            return False
            
        return super().__eq__(other) and self.sku == other.sku         # Compara ID, Nome, Preço com o __eq__ herdado, e depois compara o SKU
