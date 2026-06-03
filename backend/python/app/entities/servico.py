from datetime import datetime
from ..entities.item_catalogo import ItemCatalogo

class Servico(ItemCatalogo):
    """Entidade de domínio que representa um tipo de serviço no catálogo da loja.
    
    Obs: Herda características base de ItemCatalogo (nome, preço, criado_em, etc).
    Não possui relação com clientes ou prazos de entrega, pois estes dados 
    pertencem ao contexto de transação (Pedidos).

    Attributes:
        descricao (str): Apelido para o atributo 'nome' herdado.
        preco (float): Apelido para o atributo 'preco_venda' herdado.
        tempo_estimado (int): Tempo estimado em minutos para a conclusão do serviço.
    """

    def __init__(
            self,
            descricao: str,
            preco: float,
            tempo_estimado: int = 0,
            id: int | None = None,
            criado_em: datetime | None = None):
        
        # Inicializa o ItemCatalogo (Classe pai) validando nome, preço e ID.
        super().__init__(
            nome=descricao, 
            preco_venda=preco, 
            tipo='servico', 
            id=id, 
            criado_em=criado_em
        )
        
        self.tempo_estimado = tempo_estimado

    # ==================================================
    # Apelidos para atributos herdados (Descricao e Preco)
    # ==================================================
    @property
    def descricao(self) -> str:
        return self.nome

    @descricao.setter
    def descricao(self, valor: str):
        self.nome = valor  

    @property
    def preco(self) -> float:
        return self.preco_venda

    @preco.setter
    def preco(self, valor: float):
        self.preco_venda = valor 

    # ==================================================
    # Encapsulamento dos atributos específicos de Serviço
    # ==================================================
    @property
    def tempo_estimado(self) -> int:
        return self._tempo_estimado

    @tempo_estimado.setter
    def tempo_estimado(self, valor: int):
        try:
            val = int(valor)
        except (TypeError, ValueError):
            raise ValueError("O tempo estimado deve ser um número inteiro (minutos).")
            
        if val < 0:
            raise ValueError("O tempo estimado não pode ser negativo.")
            
        self._tempo_estimado = val

    # ==================================================
    # Métodos Mágicos
    # ==================================================
    def __repr__(self) -> str:
        return (f"<Servico {self.id or 'Novo'} | {self.descricao} "
                f"(R$ {self.preco:.2f}) | {self.tempo_estimado} min>")

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Servico):
            return False
            
        # Compara a base (ID, Nome, Preço, Tipo) e os dados específicos do serviço
        return (
            super().__eq__(other) and 
            self.tempo_estimado == other.tempo_estimado
        )