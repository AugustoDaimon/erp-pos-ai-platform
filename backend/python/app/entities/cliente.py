from datetime import datetime

class Cliente:
    """Entidade de domínio que representa um cliente da oficina.

    Attributes:
        id (int | None): Identificador único do cliente.
        nome (str): Nome do cliente (Máximo de 50 caracteres).
        celular (str | None): Número de contato do cliente (Máximo de 20 caracteres).
        sem_whatsapp (bool): Flag indicando se o cliente não utiliza WhatsApp.
        bike_info (str | None): Descrição rápida da bicicleta principal (Máximo de 80 caracteres).
        criado_em (datetime | None): Data e hora de criação do registro.
    """

    MAX_SIZE_NOME = 50
    MAX_SIZE_CELULAR = 20
    MAX_SIZE_BIKE_INFO = 80

    def __init__(
            self, 
            nome: str, 
            celular: str | None = None,
            sem_whatsapp: bool = False,
            bike_info: str | None = None,
            id: int | None = None,
            criado_em: datetime | None = None):
        self.id = id
        self.criado_em = criado_em
        self.sem_whatsapp = sem_whatsapp
        self.nome = nome
        self.celular = celular
        self.bike_info = bike_info

    # Encapsulamento de Nome
    @property
    def nome(self) -> str:
        return self._nome

    @nome.setter
    def nome(self, valor: str):
        if not valor or not str(valor).strip():
            raise ValueError("O nome do cliente é obrigatório.")
        
        valor_limpo = str(valor).strip()
        if len(valor_limpo) > self.MAX_SIZE_NOME:
            raise ValueError(f"O nome do cliente não pode exceder {self.MAX_SIZE_NOME} caracteres.")
        
        self._nome = valor_limpo

    # Encapsulamento de Celular
    @property
    def celular(self) -> str | None:
        return self._celular

    @celular.setter
    def celular(self, valor: str | None):
        if not valor or not str(valor).strip():
            self._celular = None
            return
            
        valor_limpo = str(valor).strip()
        if len(valor_limpo) > self.MAX_SIZE_CELULAR:
            raise ValueError(f"O celular não pode exceder {self.MAX_SIZE_CELULAR} caracteres.")
            
        self._celular = valor_limpo

    # Encapsulamento de Bike Info 
    @property
    def bike_info(self) -> str | None:
        return self._bike_info

    @bike_info.setter
    def bike_info(self, valor: str | None):
        if not valor or not str(valor).strip():
            self._bike_info = None
            return
            
        valor_limpo = str(valor).strip()
        if len(valor_limpo) > self.MAX_SIZE_BIKE_INFO:
            raise ValueError(f"As informações da bike não podem exceder {self.MAX_SIZE_BIKE_INFO} caracteres.")
            
        self._bike_info = valor_limpo

    def __repr__(self) -> str:
        return f"<Cliente {self.id or 'Novo'} - {self.nome}>"

    def __eq__(self, other: object) -> bool:
        """Dois clientes são considerados iguais se possuírem o mesmo ID, Nome e Celular."""
        if not isinstance(other, Cliente):
            return False
            
        return (
            self.id == other.id and 
            self.nome == other.nome and
            self.celular == other.celular
        )