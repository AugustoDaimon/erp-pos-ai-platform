from datetime import datetime

class Subcategoria:
    """Entidade de domínio que representa uma subcategoria de produtos.
    Obs: Sempre deve estar vinculada a uma Categoria.

    Attributes:
        id (int | None): Identificador único da subcategoria.
        categoria_id (int): ID da Categoria em que a subcategoria pertence.
        nome (str): Nome da subcategoria (Máximo de 50 caracteres).
        criado_em (datetime | None): Data e hora de criação do registro.
    """

    MAX_SIZE_NOME = 50 # TODO: LP Revisar essas variaveis em todas entidades

    def __init__(
            self, 
            categoria_id: int, 
            nome: str, 
            id: int | None = None,
            criado_em: datetime | None = None):
        self.id = id
        self.criado_em = criado_em
        self.categoria_id = categoria_id
        self.nome = nome

    # Encapsulamento de Categoria
    @property
    def categoria_id(self) -> int:
        return self._categoria_id

    @categoria_id.setter
    def categoria_id(self, valor: int):
        if valor is None:
            raise ValueError("O ID da categoria é obrigatório.")
            
        try:
            val_int = int(valor)
        except (TypeError, ValueError):
            raise ValueError("O ID da categoria deve ser um número inteiro válido.")
            
        if val_int <= 0:
            raise ValueError("O ID da categoria deve ser um número positivo.")
            
        self._categoria_id = val_int

    # Encapsulamento de Nome
    @property
    def nome(self) -> str:
        return self._nome

    @nome.setter
    def nome(self, valor: str):
        if not valor or not str(valor).strip():
            raise ValueError("O nome da subcategoria é obrigatório.")
            
        valor_limpo = str(valor).strip()
        
        if len(valor_limpo) > self.MAX_SIZE_NOME:
            raise ValueError(f"O nome da subcategoria não pode exceder {self.MAX_SIZE_NOME} caracteres.")
            
        self._nome = valor_limpo

    # Métodos Mágicos
    def __repr__(self) -> str:
        return f"<Subcategoria {self.id or 'Nova'} - {self.nome} (Cat Pai: {self.categoria_id})>"

    def __eq__(self, other: object) -> bool:
        """Duas subcategorias são iguais se possuírem mesmo ID, Nome e pertencerem à mesma Categoria."""
        if not isinstance(other, Subcategoria):
            return False
            
        return (
            self.id == other.id and 
            self.categoria_id == other.categoria_id and
            self.nome == other.nome
        )
