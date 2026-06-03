from datetime import datetime

class ItemCatalogo:
    """Entidade de domínio que representa um item (produto, bicicleta ou serviço).
    
    Obs: 
        Esta abstração serve como classe pai para Produto, Bicicleta e Serviço, 
        evita a repetição de atributos comuns: id, nome e preço
        permite a listagem e operações unificadas desses itens

    Attributes:
        id (int | None): Identificador único do item.
        nome (str): Nome do item (Máximo de 100 caracteres).
        preco_venda (float): Preço de venda do item. Não pode ser negativo.
        tipo (str): Categoria do item, restritamente 'produto', 'bicicleta' ou 'servico'.
        criado_em (datetime | None): Data e hora de criação do registro.
    """

    MAX_SIZE_NOME = 100

    def __init__(
            self,
            nome: str,
            preco_venda: float,
            tipo: str,
            id: int | None = None,
            criado_em: datetime | None = None):
        self.id = id
        self.criado_em = criado_em
        self.nome = nome
        self.preco_venda = preco_venda
        self.tipo = tipo

    # Encapsulamento de Nome
    @property
    def nome(self) -> str:
        return self._nome

    @nome.setter
    def nome(self, valor: str):
        if not valor or not str(valor).strip():
            raise ValueError("O nome do item é obrigatório.")
        
        valor_limpo = str(valor).strip()
        if len(valor_limpo) > self.MAX_SIZE_NOME:
            raise ValueError(f"O nome do item não pode exceder {self.MAX_SIZE_NOME} caracteres.")
        
        self._nome = valor_limpo

    # Encapsulamento de Preço de Venda
    @property
    def preco_venda(self) -> float:
        return self._preco_venda

    @preco_venda.setter
    def preco_venda(self, valor: float):
        try:
            valor_float = float(valor)
        except (TypeError, ValueError):
            raise ValueError("O preço de venda deve ser um número válido.")
            
        if valor_float < 0:
            raise ValueError("O preço de venda não pode ser negativo.")
            
        self._preco_venda = valor_float

    # Encapsulamento de Tipo
    @property
    def tipo(self) -> str:
        return self._tipo

    @tipo.setter
    def tipo(self, valor: str):
        if not valor or not str(valor).strip():
            raise ValueError("O tipo do item é obrigatório.")
            
        valor_limpo = str(valor).strip().lower()
        if valor_limpo not in ['produto', 'servico', 'bicicleta']:          # TODO: Refatorar com Enum de Strings para garantir segurança de tipos 
            raise ValueError("O tipo do item deve ser estritamente 'produto', 'bicicleta' ou 'servico'.")
            
        self._tipo = valor_limpo

    def __repr__(self) -> str:
        tipo_formatado = self.tipo.capitalize() if hasattr(self, '_tipo') else 'Item'
        return f"<{tipo_formatado} {self.id or 'Novo'}: {self.nome} (R$ {self.preco_venda:.2f})>"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, ItemCatalogo):
            return False
            
        return (
            self.id == other.id and 
            self.nome == other.nome and
            self.tipo == other.tipo and
            self.preco_venda == other.preco_venda
        )