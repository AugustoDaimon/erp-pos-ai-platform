from ..entities.item_pedido import ItemPedido
from ..interfaces.item_pedido_repository import IItemPedidoRepository

from ..DTOs.item_pedido_dto import (
    CreateItemPedidoDTO, 
    UpdateItemPedidoDTO, 
    ItemPedidoResponseDTO
)

# ==========================================
# Exceções de Domínio (Erros de Negócio)
# ==========================================
class ItemPedidoNotFoundError(Exception):
    pass

class InvalidItemPedidoDataError(Exception):
    pass


# ==========================================
# Serviço / Caso de Uso
# ==========================================
class ItemPedidoService:
    def __init__(self, repo: IItemPedidoRepository):
        self.repo = repo

    def create_item(self, dto: CreateItemPedidoDTO) -> ItemPedidoResponseDTO:
        # Regra 1: Quantidade deve ser válida
        if dto.quantidade <= 0:
            raise InvalidItemPedidoDataError("A quantidade do item deve ser maior que zero.")

        # Regra 2: Valor não pode ser negativo
        if dto.valor_unitario < 0:
            raise InvalidItemPedidoDataError("O valor unitário não pode ser negativo.")

        # Regra 3: Cálculo matemático seguro no Backend
        valor_total_calculado = dto.quantidade * dto.valor_unitario

        novo_item = ItemPedido(
            produto_id=dto.produto_id,
            pedido_id=dto.pedido_id,
            quantidade=dto.quantidade,
            valor_unitario=dto.valor_unitario,
            valor_total=valor_total_calculado
        )

        salvo = self.repo.create(novo_item)
        return ItemPedidoResponseDTO.from_entity(salvo)

    def get_item(self, item_id: int) -> ItemPedidoResponseDTO:
        item = self.repo.get_by_id(item_id)
        if not item:
            raise ItemPedidoNotFoundError(f"Item do Pedido com ID '{item_id}' não foi encontrado.")
        
        return ItemPedidoResponseDTO.from_entity(item)

    # Note o uso do método específico que criamos no repositório!
    def list_by_pedido(self, pedido_id: int) -> list[ItemPedidoResponseDTO]:
        """Busca todos os itens de um pedido específico (O Carrinho)."""
        lista = self.repo.list_by_pedido_id(pedido_id)
        if lista is None:
            raise RuntimeError(f"Erro ao listar os itens do pedido {pedido_id}.")
            
        return [ItemPedidoResponseDTO.from_entity(i) for i in lista]

    def update_item(self, item_id: int, dto: UpdateItemPedidoDTO) -> ItemPedidoResponseDTO:
        item = self.repo.get_by_id(item_id)
        if not item:
            raise ItemPedidoNotFoundError(f"Item do Pedido com ID '{item_id}' não encontrado para atualização.")

        dados = dto.to_dict_exclude_none()

        # Se tentarem atualizar quantidade ou valor, precisamos revalidar
        nova_quantidade = dados.get('quantidade', item.quantidade)
        novo_valor_unitario = dados.get('valor_unitario', item.valor_unitario)

        if nova_quantidade <= 0:
            raise InvalidItemPedidoDataError("A quantidade não pode ser menor ou igual a zero.")
        if novo_valor_unitario < 0:
            raise InvalidItemPedidoDataError("O valor unitário não pode ser negativo.")

        # Aplica as mudanças
        item.quantidade = nova_quantidade
        item.valor_unitario = novo_valor_unitario
        
        # RECALCULA O TOTAL
        item.valor_total = item.quantidade * item.valor_unitario

        atualizado = self.repo.update(item)
        if not atualizado:
            raise RuntimeError("Falha no banco de dados ao atualizar o item do pedido.")

        return ItemPedidoResponseDTO.from_entity(atualizado)

    def delete_item(self, item_id: int) -> bool:
        item = self.repo.get_by_id(item_id)
        if not item:
            raise ItemPedidoNotFoundError(f"Item do Pedido com ID '{item_id}' não encontrado para exclusão.")

        self.repo.delete(item_id)
        return True