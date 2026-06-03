from datetime import datetime
from pydantic import BaseModel, Field
from ..entities.ordem_servico import StatusOrdemServico

class CreateOrdemServicoRequest(BaseModel):
    pedido_id: int = Field(..., gt=0, description="ID do pedido vinculado")
    servico_id: int = Field(..., gt=0, description="ID do serviço a ser executado")
    
    data_inicio_previsto: datetime = Field(..., description="Data e hora previstas para o início do serviço")
    data_termino_previsto: datetime = Field(..., description="Data e hora previstas para a conclusão do serviço")
    
    status: StatusOrdemServico | None = Field(
        default=StatusOrdemServico.NA_FILA, 
        description="Status inicial da ordem de serviço. Padrão é 'na_fila'."
    )

class UpdateOrdemServicoRequest(BaseModel):
    servico_id: int | None = Field(None, gt=0, description="Novo serviço associado")
    
    data_inicio_previsto: datetime | None = Field(None, description="Nova data de início prevista")
    data_termino_previsto: datetime | None = Field(None, description="Nova data de término prevista")
    data_termino_real: datetime | None = Field(None, description="Data e hora reais de término do serviço")
    
    status: StatusOrdemServico | None = Field(None, description="Novo status da ordem de serviço")

class OrdemServicoResponse(BaseModel):
    id: int
    pedido_id: int
    servico_id: int
    data_inicio_previsto: datetime
    data_termino_previsto: datetime
    data_termino_real: datetime | None = None
    status: StatusOrdemServico