from datetime import datetime

class Marca:
    """Entidade de domínio que representa uma marca de produtos.

    Attributes:
        id (int | None): Identificador único da marca.
        nome (str): Nome da marca (Máximo de 50 caracteres).
        categorias_vinculadas (list[int]): Lista de IDs das categorias às quais esta marca pertence.
        criado_em (datetime | None): Data e hora de criação do registro.
    """

    MAX_SIZE_NOME = 50

    def __init__(
            self, 
            nome: str, 
            categorias_vinculadas: list[int] | None = None, 
            id: int | None = None,
            criado_em: datetime | None = None):
        self.id = id
        self.criado_em = criado_em
        self.nome = nome
        self.categorias_vinculadas = categorias_vinculadas 

    # Encapsulamento de Nome
    @property
    def nome(self) -> str:
        return self._nome

    @nome.setter
    def nome(self, valor: str):
        if not valor or not str(valor).strip():
            raise ValueError("O nome da marca é obrigatório.")
            
        valor_limpo = str(valor).strip()
        if len(valor_limpo) > self.MAX_SIZE_NOME:
            raise ValueError(f"O nome da marca não pode exceder {self.MAX_SIZE_NOME} caracteres.")
            
        self._nome = valor_limpo

    # Encapsulamento de Categorias Vinculadas
    @property
    def categorias_vinculadas(self) -> list[int]:
        return self._categorias_vinculadas

    @categorias_vinculadas.setter
    def categorias_vinculadas(self, valores: list[int] | None):
        if valores is None:
            self._categorias_vinculadas = []
            return

        if not isinstance(valores, list):
            raise TypeError("As categorias vinculadas devem ser fornecidas em formato de lista.")

        try:
            lista_limpa = list(set([int(v) for v in valores]))      # Faz conversão de itens para int e set() remove duplicatas
        except (TypeError, ValueError):
            raise ValueError("Todos os IDs de categorias vinculadas devem ser inteiros.")

        self._categorias_vinculadas = lista_limpa

    def __repr__(self) -> str:
        return f"<Marca {self.id or 'Nova'} - {self.nome} (Categorias: {self.categorias_vinculadas})>"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Marca):
            return False
            
        return (
            self.id == other.id and 
            self.nome == other.nome and
            sorted(self.categorias_vinculadas) == sorted(other.categorias_vinculadas)
        )