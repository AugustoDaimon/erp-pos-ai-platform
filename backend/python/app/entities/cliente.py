from datetime import datetime


class Cliente:
    def __init__(
            self, 
            nome: str, 
            celular: str | None = None,
            sem_whatsapp: bool = False,
            bike_info: str | None = None,
            id: int | None = None,
            criado_em: datetime | None = None
        ):

        self.id = id
        self.nome = nome
        self.celular = celular
        self.sem_whatsapp = sem_whatsapp
        self.bike_info = bike_info
        self.criado_em = criado_em

    def __repr__(self):
        return f"<Cliente {self.id or 'Novo'} - {self.nome}>"