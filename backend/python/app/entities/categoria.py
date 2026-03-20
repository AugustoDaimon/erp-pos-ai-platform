from datetime import datetime

class Categoria:
    def __init__(
            self, 
            nome: str, 
            id: int | None = None,
            criado_em: datetime | None = None
        ):

        self.id = id
        self.nome = nome
        self.criado_em = criado_em

    def __repr__(self):
        return f"<Categoria {self.id or 'Nova'} - {self.nome}>"