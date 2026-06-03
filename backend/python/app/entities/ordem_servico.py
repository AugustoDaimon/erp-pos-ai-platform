from datetime import datetime
from enum import Enum
from typing import Optional

class StatusOrdemServico(str, Enum):
    # TODO: Status "RASCUNHO" e implementação. Para salvar ordem de servicos em pedidos que ainda não foram finalizados. (Ex: Orçamentos aguardando confirmação)
    NA_FILA = "na_fila"
    EM_MANUTENCAO = "em_manutencao"
    AGUARDANDO_PECA = "aguardando_peca"
    PRONTO = "pronto"
    ENTREGUE = "entregue"

class OrdemServico:
    """Entidade que representa a execução de um serviço.

    Attributes:
        id (int | None): Identificador único da ordem de serviço.
        pedido_id (int): Referência ao Pedido (transação comercial).
        servico_id (int): Referência ao Serviço (catálogo/modelo).
        data_inicio_previsto (datetime): Quando o mecânico deve começar.
        data_termino_previsto (datetime): Quando o mecânico deve terminar.
        data_termino_real (datetime | None): Quando o serviço foi efetivamente finalizado.
        status (StatusOrdemServico): Estado atual na bancada da oficina.
    """

    def __init__(
            self,
            pedido_id: int,
            servico_id: int,
            data_inicio_previsto: datetime,
            data_termino_previsto: datetime,
            status: str | StatusOrdemServico = StatusOrdemServico.NA_FILA,
            data_termino_real: Optional[datetime] = None,
            id: Optional[int] = None):
        
        self.id = id
        self.pedido_id = pedido_id
        self.servico_id = servico_id
        self.data_inicio_previsto = data_inicio_previsto
        self.data_termino_previsto = data_termino_previsto
        self.status = status
        self.data_termino_real = data_termino_real

    @property
    def pedido_id(self) -> int:
        return self._pedido_id

    @pedido_id.setter
    def pedido_id(self, valor: int):
        if not valor or int(valor) <= 0:
            raise ValueError("O ID do pedido associado é obrigatório.")
        self._pedido_id = int(valor)

    @property
    def servico_id(self) -> int:
        return self._servico_id

    @servico_id.setter
    def servico_id(self, valor: int):
        if not valor or int(valor) <= 0:
            raise ValueError("O ID do serviço associado é obrigatório.")
        self._servico_id = int(valor)

    @property
    def data_inicio_previsto(self) -> datetime:
        return self._data_inicio_previsto

    @data_inicio_previsto.setter
    def data_inicio_previsto(self, valor: datetime):
        if not isinstance(valor, datetime):
            raise ValueError("A data de início previsto deve ser um objeto datetime válido.")
        self._data_inicio_previsto = valor
        self._validar_cronograma()

    @property
    def data_termino_previsto(self) -> datetime:
        return self._data_termino_previsto

    @data_termino_previsto.setter
    def data_termino_previsto(self, valor: datetime):
        if not isinstance(valor, datetime):
            raise ValueError("A data de término previsto deve ser um objeto datetime válido.")
        self._data_termino_previsto = valor
        self._validar_cronograma()

    def _validar_cronograma(self):
        """Garante que a data de término não seja anterior à data de início."""
        if hasattr(self, '_data_inicio_previsto') and hasattr(self, '_data_termino_previsto'):
            if self._data_termino_previsto < self._data_inicio_previsto:
                raise ValueError("A data de término previsto não pode ser anterior à data de início.")

    @property
    def data_termino_real(self) -> Optional[datetime]:
        return self._data_termino_real

    @data_termino_real.setter
    def data_termino_real(self, valor: Optional[datetime]):
        if valor is not None and not isinstance(valor, datetime):
            raise ValueError("A data de término real deve ser um objeto datetime ou None.")
        
        if valor is not None and getattr(self, '_status', None) in [StatusOrdemServico.NA_FILA, StatusOrdemServico.EM_MANUTENCAO]:
             self._status = StatusOrdemServico.PRONTO

        self._data_termino_real = valor

    @property
    def status(self) -> StatusOrdemServico:
        return self._status

    @status.setter
    def status(self, valor: str | StatusOrdemServico):
        if isinstance(valor, str):
            try:
                valor = StatusOrdemServico(valor.lower())
            except ValueError:
                raise ValueError(f"Status '{valor}' inválido para Ordem de Serviço.")
        
        if not isinstance(valor, StatusOrdemServico):
            raise ValueError("O status deve ser do tipo StatusOrdemServico.")
            
        self._status = valor

    def __repr__(self) -> str:
        inicio_formatado = self.data_inicio_previsto.strftime("%d/%m/%Y %H:%M")
        return (f"<OrdemServico {self.id or 'Nova'} | Pedido: {self.pedido_id} | "
                f"Serviço: {self.servico_id} | Status: {self.status.value.upper()} | "
                f"Início: {inicio_formatado}>")

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, OrdemServico):
            return False
            
        return (
            self.id == other.id and
            self.pedido_id == other.pedido_id and
            self.servico_id == other.servico_id and
            self.data_inicio_previsto == other.data_inicio_previsto and
            self.data_termino_previsto == other.data_termino_previsto and
            self.data_termino_real == other.data_termino_real and
            self.status == other.status
        )