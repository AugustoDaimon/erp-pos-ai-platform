from ..entities.marca import Marca
from ..interfaces.marca_repository import IMarcaRepository
from ..interfaces.categoria_repository import ICategoriaRepository

from ..DTOs.marca_dto import CreateMarcaDTO, UpdateMarcaDTO, MarcaResponseDTO

# Erros customizados
class MarcaNotFoundError(Exception): pass
class InvalidMarcaDataError(Exception): pass
class MarcaAlreadyExistsError(Exception): pass
class CategoriasInvalidasError(Exception): pass # Novo erro para lidar com a lista N:N!

class MarcaService:
    def __init__(self, repo: IMarcaRepository, categoria_repo: ICategoriaRepository):
        self.repo = repo
        self.categoria_repo = categoria_repo

    def _validar_categorias_existem(self, categoria_ids: list[int]):
        """Verifica se todos os IDs de categoria fornecidos realmente existem no banco."""
        if not categoria_ids:
            return

        # Busca todas as categorias (Poderia ser um get_by_ids customizado no repo para otimizar)
        categorias_existentes = self.categoria_repo.list_all()
        ids_validos = {cat.id for cat in categorias_existentes}

        for cat_id in categoria_ids:
            if cat_id not in ids_validos:
                raise CategoriasInvalidasError(f"A categoria com ID {cat_id} não existe no sistema.")

    def create_marca(self, dto: CreateMarcaDTO) -> MarcaResponseDTO:
        nome_limpo = str(dto.nome).strip()
        if not nome_limpo:
            raise InvalidMarcaDataError("O nome da marca é obrigatório.")

        # Regra 1: Nome Único
        if self.repo.get_by_nome(nome_limpo):
            raise MarcaAlreadyExistsError(f"A marca '{nome_limpo}' já está cadastrada.")

        # Regra 2: As categorias informadas precisam existir
        self._validar_categorias_existem(dto.categorias_vinculadas)

        nova_marca = Marca(nome=nome_limpo, categorias_vinculadas=dto.categorias_vinculadas)
        salva = self.repo.create(nova_marca)
        
        return MarcaResponseDTO.from_entity(salva)

    def get_marca(self, id: int) -> MarcaResponseDTO:
        marca = self.repo.get_by_id(id)
        if not marca:
            raise MarcaNotFoundError("Marca não encontrada.")
        return MarcaResponseDTO.from_entity(marca)

    def list_marcas(self) -> list[MarcaResponseDTO]:
        lista = self.repo.list_all()
        return [MarcaResponseDTO.from_entity(m) for m in lista]

    def update_marca(self, id: int, dto: UpdateMarcaDTO) -> MarcaResponseDTO:
        marca = self.repo.get_by_id(id)
        if not marca:
            raise MarcaNotFoundError("Marca não encontrada para atualização.")

        dados = dto.to_dict_exclude_none()
        
        # Validando nome duplicado
        novo_nome = str(dados.get('nome', marca.nome)).strip()
        if 'nome' in dados:
            existente = self.repo.get_by_nome(novo_nome)
            if existente and existente.id != id:
                raise MarcaAlreadyExistsError("Já existe outra marca cadastrada com este nome.")
            marca.nome = novo_nome

        # Validando as novas categorias se houver alteração
        if 'categorias_vinculadas' in dados:
            novas_categorias = dados['categorias_vinculadas']
            self._validar_categorias_existem(novas_categorias)
            marca.categorias_vinculadas = novas_categorias

        atualizado = self.repo.update(marca)
        return MarcaResponseDTO.from_entity(atualizado)

    def delete_marca(self, id: int) -> bool:
        if not self.repo.get_by_id(id):
            raise MarcaNotFoundError("Marca não encontrada.")
        self.repo.delete(id)
        return True