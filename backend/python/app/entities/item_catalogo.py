from datetime import datetime

class ItemCatalogo:
    def __init__(
        self,
        nome: str,
        preco_venda: float,
        tipo: str, # 'produto' ou 'servico'
        id: int | None = None,
        criado_em: datetime | None = None
    ):
        self.id = id
        self.nome = nome
        self.preco_venda = preco_venda
        self.tipo = tipo
        self.criado_em = criado_em

    def __repr__(self):
        return f"<{self.tipo.capitalize()} {self.id or 'Novo'}: {self.nome} (R$ {self.preco_venda})>"