from dataclasses import dataclass
from datetime import datetime
from ..entities.ordem_servico import StatusOrdemServico

@dataclass
class CreateOrdemServicoDTO:
    pedido_id: int
    servico_id: int
    data_inicio_previsto: datetime
    data_termino_previsto: datetime
    status: StatusOrdemServico | str | None = None

@dataclass
class UpdateOrdemServicoDTO:
    servico_id: int | None = None
    data_inicio_previsto: datetime | None = None
    data_termino_previsto: datetime | None = None
    data_termino_real: datetime | None = None
    status: StatusOrdemServico | str | None = None

    def to_dict_exclude_none(self) -> dict:
        from dataclasses import asdict
        return {k: v for k, v in asdict(self).items() if v is not None}

@dataclass
class OrdemServicoResponseDTO:
    id: int
    pedido_id: int
    servico_id: int
    data_inicio_previsto: str
    data_termino_previsto: str
    status: str
    data_termino_real: str | None = None

    @classmethod
    def from_entity(cls, entity):
        status_str = entity.status.value if hasattr(entity.status, 'value') else str(entity.status)
        
        return cls(
            id=entity.id,
            pedido_id=entity.pedido_id,
            servico_id=entity.servico_id,
            data_inicio_previsto=entity.data_inicio_previsto.strftime("%Y-%m-%d %H:%M:%S") if entity.data_inicio_previsto else "",
            data_termino_previsto=entity.data_termino_previsto.strftime("%Y-%m-%d %H:%M:%S") if entity.data_termino_previsto else "",
            status=status_str,
            data_termino_real=entity.data_termino_real.strftime("%Y-%m-%d %H:%M:%S") if entity.data_termino_real else None
        )

@dataclass
class FiltroOrdemServicoDTO:
    pedido_id: int | None = None
    status: StatusOrdemServico | str | None = None
    data_inicio: datetime | None = None
    data_fim: datetime | None = None