from datetime import datetime
from ..entities.ordem_servico import OrdemServico, StatusOrdemServico
from ..interfaces.ordem_servico_repository import IOrdemServicoRepository

from ..DTOs.ordem_servico_dto import (
    CreateOrdemServicoDTO, 
    UpdateOrdemServicoDTO, 
    OrdemServicoResponseDTO,
    FiltroOrdemServicoDTO
)

class OrdemServicoNotFoundError(Exception): pass
class InvalidOrdemServicoDataError(Exception): pass

class OrdemServicoService:
    def __init__(self, repo: IOrdemServicoRepository):
        self.repo = repo

    def _validar_cronograma(self, inicio: datetime, termino: datetime):
        if termino < inicio:
            raise InvalidOrdemServicoDataError("A data de término previsto não pode ser anterior à data de início.")

    def create_ordem_servico(self, dto: CreateOrdemServicoDTO) -> OrdemServicoResponseDTO:
        self._validar_cronograma(dto.data_inicio_previsto, dto.data_termino_previsto)

        nova_os = OrdemServico(
            pedido_id=dto.pedido_id,
            servico_id=dto.servico_id,
            data_inicio_previsto=dto.data_inicio_previsto,
            data_termino_previsto=dto.data_termino_previsto,
            status=dto.status if dto.status else StatusOrdemServico.NA_FILA
        )
        
        salvo = self.repo.create(nova_os)
        return OrdemServicoResponseDTO.from_entity(salvo)

    def get_ordem_servico(self, os_id: int) -> OrdemServicoResponseDTO:
        os = self.repo.find_by_id(os_id)
        if not os:
            raise OrdemServicoNotFoundError("Ordem de serviço não encontrada.")
        return OrdemServicoResponseDTO.from_entity(os)

    def list_ordens_servico(self, filtro: FiltroOrdemServicoDTO = None) -> list[OrdemServicoResponseDTO]:
        filtro = filtro or FiltroOrdemServicoDTO()
        
        if filtro.pedido_id:
            lista = self.repo.find_by_pedido_id(filtro.pedido_id)
        elif filtro.data_inicio and filtro.data_fim:
            lista = self.repo.find_by_period(filtro.data_inicio, filtro.data_fim)
        elif filtro.status:
            lista = self.repo.find_by_status(filtro.status)
        else:
            lista = self.repo.list_all()
            
        if filtro.pedido_id and filtro.status:
            lista = [os for os in lista if os.status == filtro.status]
            
        return [OrdemServicoResponseDTO.from_entity(os) for os in lista]

    def update_ordem_servico(self, os_id: int, dto: UpdateOrdemServicoDTO) -> OrdemServicoResponseDTO:
        os = self.repo.find_by_id(os_id)
        if not os:
            raise OrdemServicoNotFoundError("Ordem de serviço não encontrada para atualização.")

        dados = dto.to_dict_exclude_none()

        if 'servico_id' in dados:
            os.servico_id = dados['servico_id']
        if 'data_inicio_previsto' in dados:
            os.data_inicio_previsto = dados['data_inicio_previsto']
        if 'data_termino_previsto' in dados:
            os.data_termino_previsto = dados['data_termino_previsto']
        if 'data_termino_real' in dados:
            os.data_termino_real = dados['data_termino_real']
        if 'status' in dados:
            os.status = dados['status']
        
        self._validar_cronograma(os.data_inicio_previsto, os.data_termino_previsto)

        atualizado = self.repo.update(os)
        if not atualizado:
             raise RuntimeError("Falha ao atualizar a ordem de serviço no banco de dados.")
             
        return OrdemServicoResponseDTO.from_entity(atualizado)

    def delete_ordem_servico(self, os_id: int) -> bool:
        if not self.repo.find_by_id(os_id):
            raise OrdemServicoNotFoundError("Ordem de serviço não encontrada.")
        
        sucesso = self.repo.delete(os_id)
        if not sucesso:
             raise RuntimeError("Falha ao deletar a ordem de serviço.")
             
        return True
    
    def finalizar_ordem_servico(self, os_id: int) -> OrdemServicoResponseDTO:
        os = self.repo.find_by_id(os_id)
        if not os:
            raise OrdemServicoNotFoundError("Ordem de serviço não encontrada.")
            
        os.data_termino_real = datetime.now() 
        
        atualizado = self.repo.update(os)
        return OrdemServicoResponseDTO.from_entity(atualizado)