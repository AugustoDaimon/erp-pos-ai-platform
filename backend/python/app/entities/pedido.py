from datetime import datetime
from enum import StrEnum
from ..entities.item_pedido import ItemPedido

# Enums de Domínio 
# TODO: Avaliar se é necessario a criação de Folder Enum e separação deles em arquivo a parte 
class StatusPedido(StrEnum):
    PENDENTE = "pendente"
    CONCLUIDO = "concluido"
    CANCELADO = "cancelado"

class StatusOficina(StrEnum):
    NAO_APLICAVEL = "nao_aplicavel" # vendas de produto no balcão
    ENTREGUE = "entregue"

    # No caso de um unico servico associado, será mostrado o status do servico associado
    # No caso de multiplos servicos associados, mostrará apenas status de maior prioridade: AguardandoPeca > NaFila > EmManutencao> Pronto
    EM_MANUTENCAO = "em_manutencao"
    AGUARDANDO_PECA = "aguardando_peca"
    PRONTO = "pronto"

# Entidade Raiz: Pedido
class Pedido:
    """Entidade central que representa um pedido ou ordem de serviço.

    Attributes:
        id (int | None): Identificador único do pedido.
        cliente_id (int | None): Referência ao cliente (None para vendas rápidas sem cadastro).
        subtotal (float): Soma bruta dos itens do pedido.
        taxas_cartao (float): Valores adicionais de maquininha/parcelamento. #TODO: Verificar possibildade de conectar com API externa da maquininha para atualizar valores automaticamente
        desconto (float): Desconto aplicado ao valor final.
        valor_total (float): Valor final líquido (Subtotal + Taxas - Desconto).
        valor_pago (float): Quanto o cliente já adiantou ou pagou.
        metodo_pagamento (str | None): Forma de pagamento.
        emitir_nota_fiscal (bool): Flag solicitando emissão de NF.
        status_pedido (StatusPedido): Estado do pedido.

        # TODO: Separação de contexto (PedidoTemServico e PedidoTemProduto)
                Com o proposito de evitar os atributos abaixos como nulos em Pedido de apenas produto
        status_oficina (StatusOficina): Estado do serviço.
        data_prevista_retirada (datetime | None): Prazo combinado com o cliente.
        data_entrega_real (datetime | None): Quando a bike foi efetivamente entregue.

        criado_em (datetime | None): Data de criação do registro.
        itens (list[ItemPedido]): Lista blindada de itens pertencentes a este pedido.
    """

    def __init__(
            self,
            id: int | None = None,
            cliente_id: int | None = None,
            subtotal: float = 0.0,
            taxas_cartao: float = 0.0,
            desconto: float = 0.0,
            valor_total: float = 0.0,
            valor_pago: float = 0.0,
            metodo_pagamento: str | None = None,
            emitir_nota_fiscal: bool = False,
            status_pedido: StatusPedido | str = StatusPedido.CONCLUIDO,
            status_oficina: StatusOficina | str = StatusOficina.NAO_APLICAVEL,
            data_prevista_retirada: datetime | None = None,
            data_entrega_real: datetime | None = None,
            criado_em: datetime | None = None,
            itens: list[ItemPedido] | None = None ):
        self.id = id
        self.cliente_id = cliente_id
        self.metodo_pagamento = metodo_pagamento
        self.emitir_nota_fiscal = emitir_nota_fiscal
        self.data_prevista_retirada = data_prevista_retirada
        self.data_entrega_real = data_entrega_real
        self.criado_em = criado_em
        self._subtotal = float(subtotal)
        self._valor_total = float(valor_total)
        self.status_pedido = status_pedido
        self.status_oficina = status_oficina
        self.taxas_cartao = taxas_cartao
        self.desconto = desconto
        self.valor_pago = valor_pago
        self.itens = itens

    @property
    def taxas_cartao(self) -> float:
        return self._taxas_cartao

    @taxas_cartao.setter
    def taxas_cartao(self, valor: float):
        val = float(valor)
        if val < 0: raise ValueError("Taxas de cartão não podem ser negativas.")
        self._taxas_cartao = val
        self.calcular_totais()

    @property
    def desconto(self) -> float:
        return self._desconto

    @desconto.setter
    def desconto(self, valor: float):
        val = float(valor)
        if val < 0: raise ValueError("O desconto não pode ser negativo.")
        self._desconto = val
        self.calcular_totais()

    @property
    def valor_pago(self) -> float:
        return self._valor_pago

    @valor_pago.setter
    def valor_pago(self, valor: float):
        val = float(valor)
        if val < 0: raise ValueError("O valor pago não pode ser negativo.")
        self._valor_pago = val

    # Encapsulamento de Subtotal e Total 
    @property
    def subtotal(self) -> float:
        return self._subtotal

    @property
    def valor_total(self) -> float:
        return self._valor_total

    def calcular_totais(self):
        if hasattr(self, '_itens') and hasattr(self, '_taxas_cartao') and hasattr(self, '_desconto'):
            self._subtotal = sum(item.valor_total for item in self.itens)
            self._valor_total = max(0.0, (self._subtotal + self.taxas_cartao) - self.desconto)

    @property
    def itens(self) -> list[ItemPedido]:
        return self._itens

    @itens.setter
    def itens(self, valores: list[ItemPedido] | None):
        if valores is None:
            self._itens = []
        else:
            if not isinstance(valores, list):
                raise TypeError("Os itens do pedido devem ser fornecidos em uma lista.")
            for idx, item in enumerate(valores):
                if not isinstance(item, ItemPedido):
                    raise TypeError(f"O item na posição {idx} não é uma instância de ItemPedido.")
            self._itens = valores
            
        self.calcular_totais()

    @property
    def status_pedido(self) -> StatusPedido:
        return self._status_pedido
    
    @status_pedido.setter
    def status_pedido(self, valor: StatusPedido | str):
        if isinstance(valor, str):
            valor = valor.lower()
            
        try:
            self._status_pedido = StatusPedido(valor)
        except ValueError:
            raise ValueError(f"Status do pedido inválido. Aceitos: {[e.value for e in StatusPedido]}")
    @property
    def status_oficina(self) -> StatusOficina:
        return self._status_oficina

    @status_oficina.setter
    def status_oficina(self, valor: StatusOficina | str):
        # O mesmo tratamento para o status da oficina
        if isinstance(valor, str):
            valor = valor.lower()
            
        try:
            self._status_oficina = StatusOficina(valor)
        except ValueError:
            raise ValueError(f"Status da oficina inválido. Aceitos: {[e.value for e in StatusOficina]}")
    @property
    def saldo_devedor(self) -> float:
        return max(0.0, self.valor_total - self.valor_pago)

    @property
    def esta_atrasado(self) -> bool:
        if self.data_prevista_retirada and self.status_oficina != StatusOficina.ENTREGUE:
            return datetime.now() > self.data_prevista_retirada
        return False

    def __repr__(self) -> str:
        cli = f"Cliente:{self.cliente_id}" if self.cliente_id else "Avulso"
        return f"<Pedido {self.id or 'Novo'} | {cli} | Total: R$ {self.valor_total:.2f} | {self.status_pedido.upper()}>"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Pedido):
            return False
            
        return (
            self.id == other.id and
            self.cliente_id == other.cliente_id and
            self.status_pedido == other.status_pedido and
            self.valor_total == other.valor_total
        )