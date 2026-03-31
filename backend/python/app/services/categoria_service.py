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

        # Regra 2: O nome deve ser único (case-insensitive graças ao repositório)
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
            raise RuntimeError("Erro: O repositório retornou None ao listar categorias.")
            
        # Aplicação de filtro em memória (caso o DTO de filtro possua busca_nome)
        if hasattr(filtro, 'busca_nome') and filtro.busca_nome:
            termo = filtro.busca_nome.lower()
            lista = [c for c in lista if termo in c.nome.lower()]
            
        return [CategoriaResponseDTO.from_entity(c) for c in lista]

    def update_categoria(self, categoria_id: int, dto: UpdateCategoriaDTO) -> CategoriaResponseDTO:
        # 1. Verifica se a categoria existe
        categoria = self.repo.get_by_id(categoria_id)
        if not categoria:
            raise CategoriaNotFoundError(f"Categoria com ID '{categoria_id}' não encontrada para atualização.")

        dados = dto.to_dict_exclude_none()

        # Se houver um novo nome para atualizar
        if 'nome' in dados:
            novo_nome = str(dados['nome']).strip()
            
            if not novo_nome:
                raise InvalidCategoriaDataError("O nome da categoria não pode ser vazio.")

            # Regra de Ouro: Garante que o novo nome não pertença a OUTRA categoria
            existente = self.repo.get_by_nome(novo_nome)
            if existente and existente.id != categoria_id:
                raise CategoriaAlreadyExistsError(f"Já existe outra categoria cadastrada com o nome '{novo_nome}'.")

            categoria.nome = novo_nome

        # Atualiza no banco
        atualizada = self.repo.update(categoria)
        if not atualizada:
             raise RuntimeError("Falha ao atualizar a categoria no banco de dados.")

        return CategoriaResponseDTO.from_entity(atualizada)

    def delete_categoria(self, categoria_id: int) -> bool:
        # 1. Verifica se a categoria existe antes de tentar deletar
        if not self.repo.get_by_id(categoria_id):
            raise CategoriaNotFoundError(f"Categoria com ID '{categoria_id}' não encontrada para exclusão.")
        
        # 2. Manda o repositório deletar
        # Nota: O controle de chaves estrangeiras (IntegrityError) será capturado na camada do Controller
        self.repo.delete(categoria_id)
        
        return True