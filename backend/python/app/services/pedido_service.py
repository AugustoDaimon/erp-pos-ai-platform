from ..entities.pedido import Pedido
from ..interfaces.pedido_repository import IPedidoRepository

from ..DTOs.pedido_dto import (
    CreatePedidoDTO, 
    UpdatePedidoDTO, 
    FiltroPedidoDTO, 
    PedidoResponseDTO
)

# ==========================================
# Exceções de Domínio (Erros de Negócio)
# ==========================================
class PedidoNotFoundError(Exception):
    pass

class InvalidPedidoDataError(Exception):
    pass

class PagamentoInvalidoError(Exception):
    pass


# ==========================================
# Serviço / Caso de Uso
# ==========================================
class PedidoService:
    def __init__(self, repo: IPedidoRepository):
        self.repo = repo

    def create_pedido(self, dto: CreatePedidoDTO) -> PedidoResponseDTO:
        # Regra 1: Auditoria Financeira (Nunca confie no valor_total do Frontend)
        if dto.subtotal < 0 or dto.taxas_cartao < 0 or dto.desconto < 0:
            raise InvalidPedidoDataError("Valores financeiros não podem ser negativos.")
            
        valor_total_calculado = (dto.subtotal + dto.taxas_cartao) - dto.desconto
        
        if valor_total_calculado < 0:
            raise InvalidPedidoDataError("O desconto não pode ser maior que o subtotal + taxas.")

        # Regra 2: Validação de Pagamento para Pedidos Concluídos
        if dto.status_pedido == 'CONCLUIDO':
            if dto.valor_pago < valor_total_calculado:
                raise PagamentoInvalidoError(
                    f"Valor pago (R$ {dto.valor_pago:.2f}) é menor que o total do pedido (R$ {valor_total_calculado:.2f})."
                )
            if not dto.metodo_pagamento or dto.metodo_pagamento.strip() == "":
                raise PagamentoInvalidoError("É obrigatório informar o método de pagamento para concluir a venda.")

        novo_pedido = Pedido(
            cliente_id=dto.cliente_id,
            subtotal=dto.subtotal,
            taxas_cartao=dto.taxas_cartao,
            desconto=dto.desconto,
            valor_total=valor_total_calculado, # Usa o valor auditado pelo Backend
            valor_pago=dto.valor_pago,
            metodo_pagamento=dto.metodo_pagamento,
            emitir_nota_fiscal=dto.emitir_nota_fiscal,
            status_pedido=dto.status_pedido
        )

        salvo = self.repo.create(novo_pedido)
        return PedidoResponseDTO.from_entity(salvo)

    def get_pedido(self, pedido_id: int) -> PedidoResponseDTO:
        pedido = self.repo.get_by_id(pedido_id)
        if not pedido:
            raise PedidoNotFoundError(f"Pedido com ID '{pedido_id}' não foi encontrado.")
        
        return PedidoResponseDTO.from_entity(pedido)

    def list_pedidos(self, filtro: FiltroPedidoDTO = None) -> list[PedidoResponseDTO]:
        filtro = filtro or FiltroPedidoDTO()
        
        lista = self.repo.list_all()
        if lista is None:
            raise RuntimeError("Erro: O repositório retornou None ao listar pedidos.")
            
        return [PedidoResponseDTO.from_entity(p) for p in lista]

    def update_pedido(self, pedido_id: int, dto: UpdatePedidoDTO) -> PedidoResponseDTO:
        pedido = self.repo.get_by_id(pedido_id)
        if not pedido:
            raise PedidoNotFoundError(f"Pedido com ID '{pedido_id}' não encontrado para atualização.")

        dados = dto.to_dict_exclude_none()

        # Aplica as mudanças iniciais
        for campo, valor in dados.items():
            if hasattr(pedido, campo) and campo not in ('id', 'criado_em', 'subtotal', 'valor_total'):
                setattr(pedido, campo, valor)

        # Regra 3: Re-valida o pagamento se o status mudou para CONCLUIDO
        if pedido.status_pedido == 'CONCLUIDO':
            if pedido.valor_pago < pedido.valor_total:
                raise PagamentoInvalidoError("O pedido não pode ser concluído sem o pagamento integral.")
            if not pedido.metodo_pagamento:
                raise PagamentoInvalidoError("Método de pagamento é obrigatório para concluir o pedido.")

        atualizado = self.repo.update(pedido)
        if not atualizado:
            raise RuntimeError("Falha no banco de dados ao atualizar o pedido.")

        return PedidoResponseDTO.from_entity(atualizado)

    def delete_pedido(self, pedido_id: int) -> bool:
        pedido = self.repo.get_by_id(pedido_id)
        if not pedido:
            raise PedidoNotFoundError(f"Pedido com ID '{pedido_id}' não encontrado para exclusão.")

        self.repo.delete(pedido_id)
        return True