from ..entities.servico import Servico
from ..interfaces.servico_repository import IServicoRepository

from ..DTOs.servico_dto import (
    CreateServicoDTO, 
    UpdateServicoDTO, 
    ServicoResponseDTO,
    FiltroServicoDTO
)

class ServicoNotFoundError(Exception): pass
class InvalidServicoDataError(Exception): pass

class ServicoService:
    def __init__(self, repo: IServicoRepository):
        self.repo = repo

    def _validar_valores_negativos(self, preco: float, tempo_estimado: int):
        if preco < 0:
            raise InvalidServicoDataError("O preço do serviço não pode ser negativo.")
        if tempo_estimado < 0:
            raise InvalidServicoDataError("O tempo estimado não pode ser negativo.")

    def create_servico(self, dto: CreateServicoDTO) -> ServicoResponseDTO:
        descricao_limpa = str(dto.descricao).strip()
        if not descricao_limpa:
            raise InvalidServicoDataError("A descrição do serviço é obrigatória.")

        self._validar_valores_negativos(dto.preco, dto.tempo_estimado)

        novo_servico = Servico(
            descricao=descricao_limpa,
            preco=dto.preco,
            tempo_estimado=dto.tempo_estimado
        )
        
        salvo = self.repo.create(novo_servico)
        return ServicoResponseDTO.from_entity(salvo)

    def get_servico(self, servico_id: int) -> ServicoResponseDTO:
        servico = self.repo.find_by_id(servico_id)
        if not servico:
            raise ServicoNotFoundError("Serviço não encontrado.")
        return ServicoResponseDTO.from_entity(servico)

    def list_servicos(self, filtro: FiltroServicoDTO = None) -> list[ServicoResponseDTO]:
        filtro = filtro or FiltroServicoDTO()
        lista = self.repo.list_all()
            
        if filtro.busca_descricao:
            busca = filtro.busca_descricao.lower()
            lista = [s for s in lista if busca in s.descricao.lower()]
            
        return [ServicoResponseDTO.from_entity(s) for s in lista]

    def update_servico(self, servico_id: int, dto: UpdateServicoDTO) -> ServicoResponseDTO:
        servico = self.repo.find_by_id(servico_id)
        if not servico:
            raise ServicoNotFoundError("Serviço não encontrado para atualização.")

        dados = dto.to_dict_exclude_none()

        if 'descricao' in dados: 
            servico.descricao = str(dados['descricao']).strip()
        if 'preco' in dados: 
            servico.preco = dados['preco']
        if 'tempo_estimado' in dados: 
            servico.tempo_estimado = dados['tempo_estimado']
        
        self._validar_valores_negativos(servico.preco, servico.tempo_estimado)

        atualizado = self.repo.update(servico)
        if not atualizado:
             raise RuntimeError("Falha ao atualizar o serviço no banco de dados.")
             
        return ServicoResponseDTO.from_entity(atualizado)

    def delete_servico(self, servico_id: int) -> bool:
        if not self.repo.find_by_id(servico_id):
            raise ServicoNotFoundError("Serviço não encontrado.")
        
        sucesso = self.repo.delete(servico_id)
        if not sucesso:
             raise RuntimeError("Falha ao deletar o serviço.")
             
        return True