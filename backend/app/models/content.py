import json
from app.extensions import db

class Conteudo(db.Model):
    """
    Entidade de Domínio Conteudo - Paradigma Orientado a Objetos (POO).
    Encapsula informações dos filmes e séries do catálogo e métodos de consulta de gênero.
    """
    __tablename__ = 'conteudo'

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(150), nullable=False, index=True)
    sinopse = db.Column(db.Text, nullable=False)
    _generos = db.Column('generos', db.Text, nullable=False, default='[]')
    classificacao_etaria = db.Column(db.String(10), nullable=False) # 'Livre', '10', '12', '14', '16', '18'
    imagem_banner_url = db.Column(db.String(500), nullable=False)
    is_original = db.Column(db.Boolean, default=False, nullable=False)

    def __init__(self, titulo: str = None, sinopse: str = None, classificacao_etaria: str = None, imagem_banner_url: str = None, generos: list = None, is_original: bool = False, **kwargs):
        super().__init__(**kwargs)
        if titulo is not None:
            self.titulo = titulo
        if sinopse is not None:
            self.sinopse = sinopse
        if classificacao_etaria is not None:
            self.classificacao_etaria = classificacao_etaria
        if imagem_banner_url is not None:
            self.imagem_banner_url = imagem_banner_url
        if generos is not None:
            self.generos = generos
        self.is_original = is_original


    @property
    def generos(self) -> list:
        """Retorna a lista de gêneros a partir do JSON armazenado."""
        try:
            return json.loads(self._generos) if self._generos else []
        except json.JSONDecodeError:
            return []

    @generos.setter
    def generos(self, lista_generos: list) -> None:
        """Armazena a lista de gêneros convertida para formato JSON."""
        if not isinstance(lista_generos, list):
            raise TypeError("Os gêneros devem ser fornecidos em formato de lista.")
        self._generos = json.dumps(lista_generos, ensure_ascii=False)

    def possui_genero(self, genero: str) -> bool:
        """
        Método de instância POO: Verifica se o conteúdo pertence a determinado gênero (case-insensitive).
        """
        if not genero:
            return False
        genero_lower = genero.strip().lower()
        return any(g.strip().lower() == genero_lower for g in self.generos)

    def to_dict(self) -> dict:
        """Serializa a entidade Conteudo para um dicionário serializável em JSON."""
        return {
            "id": self.id,
            "titulo": self.titulo,
            "sinopse": self.sinopse,
            "generos": self.generos,
            "classificacao_etaria": self.classificacao_etaria,
            "imagem_banner_url": self.imagem_banner_url,
            "is_original": self.is_original
        }

    def __repr__(self) -> str:
        return f"<Conteudo {self.titulo} [{self.classificacao_etaria}]>"
