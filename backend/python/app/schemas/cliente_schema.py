from pydantic import BaseModel, Field

CELULAR_REGEX = r"^\(\d{2}\)\s9\d{4}-\d{4}$"

class CreateClienteRequest(BaseModel):
    nome: str = Field(..., min_length=2, max_length=255, description="Nome completo do cliente")
    
    celular: str | None = Field(
        None, 
        pattern=CELULAR_REGEX,
        description="Formato esperado: (00) 00000-0000"
    )
    
    sem_whatsapp: bool = Field(default=False, description="Marca se o cliente não possui ou não usa WhatsApp")
    
    bike_info: str | None = Field(
        None, 
        description="Informações da bicicleta: Quadro, Cor, Aro, Detalhe"
    )

class UpdateClienteRequest(BaseModel):
    nome: str | None = Field(None, min_length=2, max_length=255)
    
    celular: str | None = Field(
        None, 
        pattern=CELULAR_REGEX,
        description="Formato esperado: (00) 00000-0000"
    )
    
    sem_whatsapp: bool | None = None
    
    bike_info: str | None = None

class ClienteResponse(BaseModel):
    id: int
    nome: str
    celular: str | None
    sem_whatsapp: bool
    bike_info: str | None
    criado_em: str