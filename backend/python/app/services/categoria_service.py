from ..entities.categoria import Categoria
from ..interfaces.categoria_repository import ICategoriaRepository

# Importando os DTOs
from ..DTOs.categoria_dto import (
    CreateCategoriaDTO, 
    UpdateCategoriaDTO, 
    CategoriaResponseDTO,
    FiltroCategoriaDTO
)

# ==========================================
# Exceções de Domínio (Erros de Negócio)
# ==========================================
class CategoriaNotFoundError(Exception):
    pass

class InvalidCategoriaDataError(Exception):
    pass

class CategoriaAlreadyExistsError(Exception):
    pass

# ==========================================
# Serviço / Caso de Uso
# ==========================================
class CategoriaService:
    def __init__(self, repo: ICategoriaRepository):
        self.repo = repo

    def create_categoria(self, dto: CreateCategoriaDTO) -> CategoriaResponseDTO:
        # Regra 1: Nome é estritamente obrigatório
        if not dto.nome or str(dto.nome).strip() == "":
            raise InvalidCategoriaDataError("O nome da categoria é obrigatório.")
            
        nome_limpo = str(dto.nome).strip()

        # Regra 2: O nome deve ser único
        # (Requer o método get_by_nome no repositório)
        categoria_existente = self.repo.get_by_nome(nome_limpo)
        if categoria_existente:
            raise CategoriaAlreadyExistsError(f"A categoria '{nome_limpo}' já existe.")

        # Cria a Entidade
        nova_categoria = Categoria(nome=nome_limpo)

        salvo = self.repo.create(nova_categoria)
        return CategoriaResponseDTO.from_entity(salvo)


    def get_categoria(self, categoria_id: int) -> CategoriaResponseDTO:
        categoria = self.repo.get_by_id(categoria_id)
        if not categoria:
            raise CategoriaNotFoundError(f"Categoria com ID '{categoria_id}' não foi encontrada.")
        
        return CategoriaResponseDTO.from_entity(categoria)


    def list_categorias(self, filtro: FiltroCategoriaDTO = None) -> list[CategoriaResponseDTO]:
        filtro = filtro or FiltroCategoriaDTO()
        
        lista = self.repo.list_all()
        if lista is None:
            # Se cair aqui, é porque o Repositório retornou None! (veja o Suspeito 2)
            raise RuntimeError("Erro: O repositório retornou None ao listar categorias.")
            
        # O RETURN TEM QUE ESTAR AQUI, alinhado com o 'lista = ...'
        return [CategoriaResponseDTO.from_entity(c) for c in lista]