from ..entities.produto import Produto
from ..interfaces.produto_repository import IProdutoRepository
from ..interfaces.categoria_repository import ICategoriaRepository
from ..interfaces.subcategoria_repository import ISubcategoriaRepository
from ..interfaces.marca_repository import IMarcaRepository

from ..DTOs.produto_dto import (
    CreateProdutoDTO, 
    UpdateProdutoDTO, 
    ProdutoResponseDTO,
    FiltroProdutoDTO
)

# Erros customizados
class ProdutoNotFoundError(Exception): pass
class InvalidProdutoDataError(Exception): pass
class SkuAlreadyExistsError(Exception): pass
class RelacionamentoNotFoundError(Exception): pass

class ProdutoService:
    # Injeção de 4 repositórios! Isso é o ápice da Clean Architecture.
    def __init__(
        self, 
        repo: IProdutoRepository,
        categoria_repo: ICategoriaRepository,
        subcategoria_repo: ISubcategoriaRepository,
        marca_repo: IMarcaRepository
    ):
        self.repo = repo
        self.categoria_repo = categoria_repo
        self.subcategoria_repo = subcategoria_repo
        self.marca_repo = marca_repo

    def _validar_relacionamentos(self, categoria_id: int | None, subcategoria_id: int | None, marca_id: int | None):
        """Garante que as chaves estrangeiras informadas realmente existem no banco."""
        
        if categoria_id and not self.categoria_repo.get_by_id(categoria_id):
            raise RelacionamentoNotFoundError(f"Categoria com ID {categoria_id} não encontrada.")
            
        if marca_id and not self.marca_repo.get_by_id(marca_id):
            raise RelacionamentoNotFoundError(f"Marca com ID {marca_id} não encontrada.")

        if subcategoria_id:
            sub = self.subcategoria_repo.get_by_id(subcategoria_id)
            if not sub:
                raise RelacionamentoNotFoundError(f"Subcategoria com ID {subcategoria_id} não encontrada.")
            
            # Regra de Ouro: A subcategoria TEM que pertencer à categoria informada!
            if categoria_id and sub.categoria_id != categoria_id:
                raise InvalidProdutoDataError(
                    f"A subcategoria '{sub.nome}' não pertence à categoria selecionada."
                )

    def _validar_valores_negativos(self, valor_venda: float, custo: float, estoque: int, minimo: int):
        if valor_venda < 0 or custo < 0:
            raise InvalidProdutoDataError("Valores financeiros não podem ser negativos.")
        if estoque < 0 or minimo < 0:
            raise InvalidProdutoDataError("Quantidades de estoque não podem ser negativas.")

    def create_produto(self, dto: CreateProdutoDTO) -> ProdutoResponseDTO:
        descricao_limpa = str(dto.descricao).strip()
        if not descricao_limpa:
            raise InvalidProdutoDataError("A descrição do produto é obrigatória.")

        self._validar_valores_negativos(dto.valor_venda, dto.custo_compra, dto.estoque_atual, dto.estoque_minimo)
        self._validar_relacionamentos(dto.categoria_id, dto.subcategoria_id, dto.marca_id)

        # Validação de SKU Único
        if dto.sku:
            sku_limpo = str(dto.sku).strip()
            if self.repo.get_by_sku(sku_limpo):
                raise SkuAlreadyExistsError(f"Já existe um produto cadastrado com o SKU '{sku_limpo}'.")
        else:
            sku_limpo = None

        novo_produto = Produto(
            descricao=descricao_limpa,
            valor_venda=dto.valor_venda,
            categoria_id=dto.categoria_id,
            subcategoria_id=dto.subcategoria_id,
            marca_id=dto.marca_id,
            observacao=dto.observacao,
            sku=sku_limpo,
            valor_instalacao=dto.valor_instalacao,
            custo_compra=dto.custo_compra,
            estoque_atual=dto.estoque_atual,
            estoque_minimo=dto.estoque_minimo,
            especificacao_1=dto.especificacao_1,
            especificacao_2=dto.especificacao_2,
            especificacao_3=dto.especificacao_3,
            imagem_url=dto.imagem_url
        )
        
        salvo = self.repo.create(novo_produto)
        return ProdutoResponseDTO.from_entity(salvo)

    def get_produto(self, id: int) -> ProdutoResponseDTO:
        produto = self.repo.get_by_id(id)
        if not produto:
            raise ProdutoNotFoundError("Produto não encontrado.")
        return ProdutoResponseDTO.from_entity(produto)

    def list_produtos(self, filtro: FiltroProdutoDTO = None) -> list[ProdutoResponseDTO]:
        filtro = filtro or FiltroProdutoDTO()
        lista = self.repo.list_all()
        
        # Filtros em memória (para produção com milhares de itens, ideal seria mover isso pro Repository/SQL)
        if filtro.categoria_id:
            lista = [p for p in lista if p.categoria_id == filtro.categoria_id]
        if filtro.marca_id:
            lista = [p for p in lista if p.marca_id == filtro.marca_id]
        if filtro.busca_descricao:
            busca = filtro.busca_descricao.lower()
            lista = [p for p in lista if busca in p.descricao.lower()]
        if filtro.estoque_baixo:
            lista = [p for p in lista if p.estoque_atual <= p.estoque_minimo]
            
        return [ProdutoResponseDTO.from_entity(p) for p in lista]

    def update_produto(self, id: int, dto: UpdateProdutoDTO) -> ProdutoResponseDTO:
        produto = self.repo.get_by_id(id)
        if not produto:
            raise ProdutoNotFoundError("Produto não encontrado para atualização.")

        dados = dto.to_dict_exclude_none()

        # Extraindo valores atuais misturados com os novos para validação
        novo_cat_id = dados.get('categoria_id', produto.categoria_id)
        novo_subcat_id = dados.get('subcategoria_id', produto.subcategoria_id)
        nova_marca_id = dados.get('marca_id', produto.marca_id)

        # Re-valida os relacionamentos se algum deles mudou
        if 'categoria_id' in dados or 'subcategoria_id' in dados or 'marca_id' in dados:
             self._validar_relacionamentos(novo_cat_id, novo_subcat_id, nova_marca_id)

        # Validação de SKU
        if 'sku' in dados and dados['sku'] is not None:
            novo_sku = str(dados['sku']).strip()
            existente = self.repo.get_by_sku(novo_sku)
            if existente and existente.id != id:
                raise SkuAlreadyExistsError(f"O SKU '{novo_sku}' já pertence a outro produto.")
            produto.sku = novo_sku

        # Atualização dinâmica dos outros campos
        if 'descricao' in dados: produto.descricao = str(dados['descricao']).strip()
        if 'valor_venda' in dados: produto.valor_venda = dados['valor_venda']
        if 'valor_instalacao' in dados: produto.valor_instalacao = dados['valor_instalacao']
        if 'custo_compra' in dados: produto.custo_compra = dados['custo_compra']
        if 'estoque_atual' in dados: produto.estoque_atual = dados['estoque_atual']
        if 'estoque_minimo' in dados: produto.estoque_minimo = dados['estoque_minimo']
        
        self._validar_valores_negativos(produto.valor_venda, produto.custo_compra, produto.estoque_atual, produto.estoque_minimo)

        # Atualizando chaves e campos textuais
        produto.categoria_id = novo_cat_id
        produto.subcategoria_id = novo_subcat_id
        produto.marca_id = nova_marca_id
        
        for campo in ['observacao', 'especificacao_1', 'especificacao_2', 'especificacao_3', 'imagem_url']:
            if campo in dados:
                setattr(produto, campo, dados[campo])

        atualizado = self.repo.update(produto)
        return ProdutoResponseDTO.from_entity(atualizado)

    def delete_produto(self, id: int) -> bool:
        if not self.repo.get_by_id(id):
            raise ProdutoNotFoundError("Produto não encontrado.")
        self.repo.delete(id)
        return True