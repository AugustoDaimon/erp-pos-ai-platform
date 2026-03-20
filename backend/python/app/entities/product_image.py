class ProductImage:
    def __init__(self, url: str, thumbnail_url: str, title: str):
        self.url = url
        self.thumbnail_url = thumbnail_url
        self.title = title

    @staticmethod
    def validate_url(url: str) -> bool:
        # Exemplo de regra de domínio: a URL precisa ser HTTPS
        return url.startswith("https://")