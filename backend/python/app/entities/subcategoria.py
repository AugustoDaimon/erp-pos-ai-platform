from datetime import datetime

class Subcategoria:
    def __init__(
            self, 
            categoria_id: int, 
            nome: str, 
            id: int | None = None,
            criado_em: datetime | None = None
        ):

        self.id = id
        self.categoria_id = categoria_id
        self.nome = nome
        self.criado_em = criado_em

    def __repr__(self):
        return f"<Subcategoria {self.id or 'Nova'} - {self.nome} (Cat: {self.categoria_id})>"