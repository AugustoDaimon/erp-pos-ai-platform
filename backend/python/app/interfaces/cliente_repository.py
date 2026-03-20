from abc import ABC, abstractmethod
from ..entities import Cliente

class IClienteRepository(ABC):

    @abstractmethod
    def get_by_id(self, id: int) -> Cliente | None:
        pass

    @abstractmethod
    def create(self, cliente: Cliente) -> Cliente:
        pass

    @abstractmethod
    def list_all(self) -> list[Cliente]:
        pass

    @abstractmethod
    def update(self, cliente: Cliente) -> Cliente:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass