from ..entities.subcategoria import Subcategoria
from ..interfaces.subcategoria_repository import ISubcategoriaRepository
from ..interfaces.categoria_repository import ICategoriaRepository

from ..DTOs.subcategoria_dto import (
    CreateSubcategoriaDTO, 
    UpdateSubcategoriaDTO, 
    SubcategoriaResponseDTO,
    FiltroSubcategoriaDTO
)

# Erros customizados
class SubcategoriaNotFoundError(Exception): pass
class InvalidSubcategoriaDataError(Exception): pass
class SubcategoriaAlreadyExistsError(Exception): pass
class CategoriaPaiNotFoundError(Exception): pass # Novo erro!

class SubcategoriaService:
    # Injetamos os DOIS repositórios aqui
    def __init__(self, repo: ISubcategoriaRepository, categoria_repo: ICategoriaRepository):
        self.repo = repo
        self.categoria_repo = categoria_repo

    def create_subcategoria(self, dto: CreateSubcategoriaDTO) -> SubcategoriaResponseDTO:
        nome_limpo = str(dto.nome).strip()
        if not nome_limpo:
            raise InvalidSubcategoriaDataError("O nome da subcategoria é obrigatório.")

        # Regra 1: A categoria pai TEM que existir
        categoria_pai = self.categoria_repo.get_by_id(dto.categoria_id)
        if not categoria_pai:
            raise CategoriaPaiNotFoundError(f"A Categoria Pai com ID {dto.categoria_id} não existe.")

        # Regra 2: Não pode ter nome duplicado na MESMA categoria pai
        existente = self.repo.get_by_nome_e_categoria(nome_limpo, dto.categoria_id)
        if existente:
            raise SubcategoriaAlreadyExistsError(
                f"A subcategoria '{nome_limpo}' já existe dentro da categoria '{categoria_pai.nome}'."
            )

        nova_subcategoria = Subcategoria(categoria_id=dto.categoria_id, nome=nome_limpo)
        salvo = self.repo.create(nova_subcategoria)
        
        return SubcategoriaResponseDTO.from_entity(salvo)

    def get_subcategoria(self, id: int) -> SubcategoriaResponseDTO:
        sub = self.repo.get_by_id(id)
        if not sub:
            raise SubcategoriaNotFoundError("Subcategoria não encontrada.")
        return SubcategoriaResponseDTO.from_entity(sub)

    def list_subcategorias(self, filtro: FiltroSubcategoriaDTO = None) -> list[SubcategoriaResponseDTO]:
        filtro = filtro or FiltroSubcategoriaDTO()
        lista = self.repo.list_all()
        
        # Aplicando filtros em memória (se houverem)
        if filtro.categoria_id:
            lista = [s for s in lista if s.categoria_id == filtro.categoria_id]
        if filtro.busca_nome:
            lista = [s for s in lista if filtro.busca_nome.lower() in s.nome.lower()]
            
        return [SubcategoriaResponseDTO.from_entity(s) for s in lista]

    def update_subcategoria(self, id: int, dto: UpdateSubcategoriaDTO) -> SubcategoriaResponseDTO:
        sub = self.repo.get_by_id(id)
        if not sub:
            raise SubcategoriaNotFoundError("Subcategoria não encontrada para atualização.")

        dados = dto.to_dict_exclude_none()
        
        # Validando se tentaram mudar a categoria_pai
        novo_cat_id = dados.get('categoria_id', sub.categoria_id)
        if 'categoria_id' in dados:
            if not self.categoria_repo.get_by_id(novo_cat_id):
                raise CategoriaPaiNotFoundError("A nova Categoria Pai informada não existe.")

        # Validando nome duplicado se houver alteração de nome ou de categoria
        novo_nome = str(dados.get('nome', sub.nome)).strip()
        if 'nome' in dados or 'categoria_id' in dados:
            existente = self.repo.get_by_nome_e_categoria(novo_nome, novo_cat_id)
            if existente and existente.id != id:
                raise SubcategoriaAlreadyExistsError("Já existe uma subcategoria com este nome nesta categoria.")

        # Aplica alterações
        if 'nome' in dados: sub.nome = novo_nome
        if 'categoria_id' in dados: sub.categoria_id = novo_cat_id

        atualizado = self.repo.update(sub)
        return SubcategoriaResponseDTO.from_entity(atualizado)

    def delete_subcategoria(self, id: int) -> bool:
        if not self.repo.get_by_id(id):
            raise SubcategoriaNotFoundError("Subcategoria não encontrada.")
        self.repo.delete(id)
        return True