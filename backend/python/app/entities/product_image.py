class ProductImage:
    def __init__(self, url: str, title: str):
        self.url = url
        self.title = title

    @staticmethod
    def validate_url(url: str) -> bool:
        # Exemplo de regra de domínio: a URL precisa ser HTTPS
        return url.startswith("https://")