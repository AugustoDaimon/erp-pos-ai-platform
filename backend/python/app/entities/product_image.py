from urllib.parse import urlparse

class ProductImage:
    """Entidade de domínio que representa uma imagem referente a um produto.

    Attributes:
        id (int | None): Identificador único da imagem no banco de dados.
        url (str): Link de internet válido apontando para a imagem.
        titulo (str): Texto descritivo da imagem (usado para acessibilidade/SEO).
    """

    MAX_SIZE_URL = 2048 
    MAX_SIZE_TITULO = 100
    EXTENSOES_VALIDAS = ('.jpg', '.jpeg', '.png', '.webp', '.gif')

    def __init__(
            self, 
            url: str, 
            titulo: str, 
            id: int | None = None):
        self.id = id
        self.url = url
        self.titulo = titulo

    # Encapsulamento de URL
    @property
    def url(self) -> str:
        return self._url

    @url.setter
    def url(self, valor: str):
        if not valor or not str(valor).strip():
            raise ValueError("A URL da imagem é obrigatória.")
            
        valor_limpo = str(valor).strip()
        
        if len(valor_limpo) > self.MAX_SIZE_URL:
            raise ValueError(f"A URL não pode exceder {self.MAX_SIZE_URL} caracteres.")

        parsed_url = urlparse(valor_limpo)
        if parsed_url.scheme not in ['http', 'https']:
            raise ValueError("A URL deve ser um link de internet válido (começar com http:// ou https://).")
            
        if not parsed_url.path.lower().endswith(self.EXTENSOES_VALIDAS):
            raise ValueError(
                f"A URL deve apontar para uma imagem válida. "
                f"Formatos aceitos: {', '.join(self.EXTENSOES_VALIDAS)}"
            )

        self._url = valor_limpo

    # Encapsulamento de Título
    @property
    def titulo(self) -> str:
        return self._titulo

    @titulo.setter
    def titulo(self, valor: str):
        if not valor or not str(valor).strip():
            raise ValueError("O título da imagem é obrigatório.")
            
        valor_limpo = str(valor).strip()
        
        if len(valor_limpo) > self.MAX_SIZE_TITULO:
            raise ValueError(f"O título não pode exceder {self.MAX_SIZE_TITULO} caracteres.") #TODO: LP Verificar se 100 é um tamanho suficiente
            
        self._titulo = valor_limpo

    def __repr__(self) -> str:
        return f"<ProductImage {self.id or 'Nova'} - {self.titulo}>"

    def __eq__(self, other: object) -> bool:
        """Dois imagens são iguais se tiverem mesmo ID, url e titulo."""
        if not isinstance(other, ProductImage):
            return False
        return (
            self.id == other.id and 
            self.url == other.url and 
            self.titulo == other.titulo
        )