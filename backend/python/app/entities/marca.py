from datetime import datetime

class Marca:
    def __init__(
            self, 
            nome: str, 
            categorias_vinculadas: list[int] = None, 
            id: int | None = None,
            criado_em: datetime | None = None
        ):
        self.id = id
        self.nome = nome
        # Se não vier nada, inicializa como lista vazia
        self.categorias_vinculadas = categorias_vinculadas or [] 
        self.criado_em = criado_em

    def __repr__(self):
        return f"<Marca {self.id or 'Nova'} - {self.nome} (Categorias: {self.categorias_vinculadas})>"