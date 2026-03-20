from dataclasses import dataclass

# DTO para CRIAÇÃO (Create)
@dataclass
class CreateClienteDTO:
    """
    Dados estritamente necessários para registrar um novo cliente.
    O ID e a data de criação não entram aqui, pois são gerados pelo banco.
    """
    nome: str
    celular: str | None = None
    sem_whatsapp: bool = False
    bike_info: str | None = None


# DTO para ATUALIZAÇÃO (Update / PATCH)
@dataclass
class UpdateClienteDTO:
    """
    Todos os campos são opcionais. 
    Isso permite que o frontend envie apenas o que mudou 
    (ex: o cliente apenas trocou de celular ou adicionou uma nova bike).
    """
    nome: str | None = None
    celular: str | None = None
    sem_whatsapp: bool | None = None
    bike_info: str | None = None

    def to_dict_exclude_none(self) -> dict:
        """
        Método utilitário excelente para o seu Service!
        Retorna apenas os campos que foram realmente enviados (não são None),
        evitando que você sobrescreva dados existentes com 'None' acidentalmente.
        """
        from dataclasses import asdict
        return {k: v for k, v in asdict(self).items() if v is not None}

# DTO para LEITURA
@dataclass
class ClienteResponseDTO:
    """
    DTO de Saída. É o que o Service devolve para o Controller.
    Ele formata os dados da Entidade para ficarem prontos para virar JSON.
    """
    id: int
    nome: str
    celular: str | None
    sem_whatsapp: bool
    bike_info: str | None
    criado_em: str # Note que aqui já transformamos o datetime em String!

    @classmethod
    def from_entity(cls, entity):
        """Um método ajudante para converter a Entidade neste DTO rapidamente"""
        return cls(
            id=entity.id,
            nome=entity.nome,
            celular=entity.celular,
            sem_whatsapp=entity.sem_whatsapp,
            bike_info=entity.bike_info,
            criado_em=entity.criado_em.strftime("%Y-%m-%d %H:%M:%S") if entity.criado_em else ""
        )
    
@dataclass
class FiltroClienteDTO:
    busca_nome: str | None = None
    sem_whatsapp: bool | None = None
    limite: int = 50
    pagina: int = 1