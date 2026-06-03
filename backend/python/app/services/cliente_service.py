from ..entities.cliente import Cliente
from ..interfaces.cliente_repository import IClienteRepository

from ..DTOs.cliente_dto import (
    CreateClienteDTO, 
    UpdateClienteDTO, 
    ClienteResponseDTO,
    FiltroClienteDTO 
)

# Exceções de Domínio
class ClienteNotFoundError(Exception):
    pass

class InvalidClienteDataError(Exception):
    pass

# Caso de Uso
class ClienteService:
    def __init__(self, repo: IClienteRepository):
        self.repo = repo

    def create_cliente(self, dto: CreateClienteDTO) -> ClienteResponseDTO:
        if not dto.nome or dto.nome.strip() == "":
            raise InvalidClienteDataError("O nome do cliente é obrigatório.")

        if not dto.sem_whatsapp and (not dto.celular or dto.celular.strip() == ""):
            raise InvalidClienteDataError(
                "O número de celular é obrigatório para clientes que utilizam WhatsApp. "
                "Caso o cliente não tenha, marque a opção 'Sem Whatsapp'."
            )

        novo_cliente = Cliente(
            nome=dto.nome,
            celular=dto.celular,
            sem_whatsapp=dto.sem_whatsapp,
            bike_info=dto.bike_info
        )

        salvo = self.repo.create(novo_cliente)
        return ClienteResponseDTO.from_entity(salvo)

    def get_cliente(self, cliente_id: int) -> ClienteResponseDTO:
        cliente = self.repo.get_by_id(cliente_id)
        if not cliente:
            raise ClienteNotFoundError(f"Cliente com ID '{cliente_id}' não foi encontrado.")
        
        return ClienteResponseDTO.from_entity(cliente)

    def list_clientes(self, filtro: FiltroClienteDTO = None) -> list[ClienteResponseDTO]:
        filtro = filtro or FiltroClienteDTO()
        
        lista = self.repo.list_all()
        if lista is None:
            raise RuntimeError("Erro: O repositório retornou None ao listar clientes.")
            
        return [ClienteResponseDTO.from_entity(c) for c in lista]

    def update_cliente(self, cliente_id: int, dto: UpdateClienteDTO) -> ClienteResponseDTO:
        cliente = self.repo.get_by_id(cliente_id)
        if not cliente:
            raise ClienteNotFoundError(f"Cliente com ID '{cliente_id}' não encontrado para atualização.")

        dados = dto.to_dict_exclude_none()

        for campo, valor in dados.items():
            if hasattr(cliente, campo) and campo not in ('id', 'criado_em'):
                setattr(cliente, campo, valor)

        if not cliente.sem_whatsapp and (not cliente.celular or str(cliente.celular).strip() == ""):
            raise InvalidClienteDataError(
                "Não é possível remover o celular sem marcar a opção 'Sem Whatsapp'."
            )

        atualizado = self.repo.update(cliente)
        if not atualizado:
            raise RuntimeError("Falha no banco de dados ao atualizar o cliente.")

        return ClienteResponseDTO.from_entity(atualizado)

    def delete_cliente(self, cliente_id: int) -> bool:
        cliente = self.repo.get_by_id(cliente_id)
        if not cliente:
            raise ClienteNotFoundError(f"Cliente com ID '{cliente_id}' não encontrado para exclusão.")

        self.repo.delete(cliente_id)
        return True