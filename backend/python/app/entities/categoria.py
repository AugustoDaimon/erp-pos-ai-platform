from datetime import datetime

class Categoria:
    """Entidade de domínio que representa uma categoria de produtos.

    Attributes:
        id (int | None): Identificador único da categoria.
        nome (str): Nome da categoria. (Máximo de 50 caracteres)
        criado_em (datetime | None): Data e hora de criação do registro.
    """

    MAX_SIZE_NOME = 50

    def __init__(
            self, 
            nome: str, 
            id: int | None = None, 
            criado_em: datetime | None = None):
        self.id = id
        self.criado_em = criado_em
        self.nome = nome

    # Encapsulamento de Nome
    @property
    def nome(self) -> str:
        return self._nome

    @nome.setter
    def nome(self, valor: str):
        if not valor or not str(valor).strip():
            raise ValueError("O nome da categoria é obrigatório e não pode ser vazio.")
        
        valor_limpo = str(valor).strip()
        if len(valor_limpo) > self.MAX_SIZE_NOME:
            raise ValueError(f"O nome da categoria não pode exceder {self.MAX_SIZE_NOME} caracteres.")
        
        self._nome = valor_limpo

    # Métodos mágicos
    def __repr__(self) -> str:
        return f"<Categoria {self.id or 'Nova'} - {self.nome}>"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Categoria):
            return False
        return self.id == other.id and self.nome == other.nome