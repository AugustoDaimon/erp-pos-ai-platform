from typing import List
from ..entities.pedido import Pedido
from ..entities.item_pedido import ItemPedido
from ..interfaces.pedido_repository import IPedidoRepository
from ..interfaces.item_catalogo_repository import IItemCatalogoRepository
from ..interfaces.produto_repository import IProdutoRepository

# Nota: Assumindo que você tem esses DTOs atualizados
from ..DTOs.pedido_dto import CreatePedidoDTO, PedidoResponseDTO

# ==========================================
# Exceções de Domínio (Erros de Negócio)
# ==========================================
class PedidoNotFoundError(Exception): pass
class InvalidPedidoDataError(Exception): pass
class PagamentoInvalidoError(Exception): pass
class ItemNaoEncontradoError(Exception): pass
class EstoqueInsuficienteError(Exception): pass

# ==========================================
# Serviço / Caso de Uso
# ==========================================
class PedidoService:
    def __init__(
        self, 
        pedido_repo: IPedidoRepository,
        catalogo_repo: IItemCatalogoRepository,
        produto_repo: IProdutoRepository
    ):
        self.pedido_repo = pedido_repo
        self.catalogo_repo = catalogo_repo
        self.produto_repo = produto_repo

    def create_pedido(self, dto: CreatePedidoDTO) -> PedidoResponseDTO:
        # 1. Cria a entidade base do Pedido com os dados do DTO
        pedido = Pedido(
            cliente_id=dto.cliente_id,
            taxas_cartao=dto.taxas_cartao,
            desconto=dto.desconto,
            valor_pago=dto.valor_pago,
            metodo_pagamento=dto.metodo_pagamento,
            emitir_nota_fiscal=dto.emitir_nota_fiscal,
            status_pedido=dto.status_pedido,
            status_oficina=dto.status_oficina,
            data_prevista_retirada=dto.data_prevista_retirada
        )

        # 2. Processamento e Auditoria dos Itens
        if not dto.itens or len(dto.itens) == 0:
            raise InvalidPedidoDataError("Um pedido não pode ser criado sem itens.")

        for item_dto in dto.itens:
            # Verifica se o item existe no catálogo (pode ser Produto ou Serviço)
            item_catalogo = self.catalogo_repo.find_by_id(item_dto.item_id)
            if not item_catalogo:
                raise ItemNaoEncontradoError(f"Item com ID {item_dto.item_id} não existe no catálogo.")

            # Se for um PRODUTO físico, precisamos validar o estoque
            if item_catalogo.tipo == 'produto':
                produto = self.produto_repo.find_by_id(item_catalogo.id)
                if produto.estoque_atual < item_dto.quantidade:
                    raise EstoqueInsuficienteError(
                        f"Estoque insuficiente para '{produto.descricao}'. "
                        f"Disponível: {produto.estoque_atual}, Solicitado: {item_dto.quantidade}."
                    )

            # Usamos o valor unitário que o vendedor digitou (permite dar desconto no item)
            # Mas recalculamos o total da linha para evitar fraudes no frontend
            item_pedido = ItemPedido(
                item_id=item_dto.item_id,
                quantidade=item_dto.quantidade,
                valor_unitario=item_dto.valor_unitario
            )
            pedido.itens.append(item_pedido)

        # 3. Cálculo Financeiro (Regra de Ouro: O Backend calcula, não o Frontend)
        pedido.calcular_totais() # Método que criamos na Entity Pedido
        
        if pedido.valor_total < 0:
            raise InvalidPedidoDataError("O desconto aplicado resulta num valor total negativo.")

        # 4. Validação de Pagamento
        if pedido.status_pedido == 'CONCLUIDO':
            if pedido.valor_pago < pedido.valor_total:
                raise PagamentoInvalidoError(
                    f"Valor pago (R$ {pedido.valor_pago:.2f}) é menor que o total (R$ {pedido.valor_total:.2f})."
                )
            if not pedido.metodo_pagamento:
                raise PagamentoInvalidoError("É obrigatório informar o método de pagamento para concluir a venda.")

        # 5. Persistência (Salva o pedido e os itens de uma vez só)
        pedido_salvo = self.pedido_repo.create(pedido)

        # 6. Pós-Processamento: Dar baixa no estoque dos produtos físicos
        # Como o pedido já foi salvo com sucesso, deduzimos o estoque
        for item in pedido_salvo.itens:
            item_cat = self.catalogo_repo.find_by_id(item.item_id)
            if item_cat and item_cat.tipo == 'produto':
                # Passa quantidade negativa para dar saída
                self.produto_repo.update_estoque(item.item_id, -item.quantidade)

        return PedidoResponseDTO.from_entity(pedido_salvo)

    def cancelar_pedido(self, pedido_id: int) -> bool:
        """
        Um novo caso de uso! Se cancelar o pedido, o estoque deve voltar.
        """
        pedido = self.pedido_repo.find_by_id(pedido_id)
        if not pedido:
            raise PedidoNotFoundError("Pedido não encontrado.")
        
        if pedido.status_pedido == 'CANCELADO':
            raise InvalidPedidoDataError("Este pedido já está cancelado.")

        # 1. Devolve o estoque
        for item in pedido.itens:
            item_cat = self.catalogo_repo.find_by_id(item.item_id)
            if item_cat and item_cat.tipo == 'produto':
                # Passa quantidade positiva para devolver ao estoque
                self.produto_repo.update_estoque(item.item_id, item.quantidade)
        
        # 2. Atualiza o status
        return self.pedido_repo.update_status(pedido_id, 'CANCELADO')

    def find_pedido(self, pedido_id: int) -> PedidoResponseDTO:
        pedido = self.pedido_repo.find_by_id(pedido_id)
        if not pedido:
            raise PedidoNotFoundError("Pedido não encontrado.")
        return PedidoResponseDTO.from_entity(pedido)