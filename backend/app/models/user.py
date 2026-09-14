import json
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

# Tabela associativa historico_assistidos (Many-to-Many entre usuarios e conteudos)
historico_assistidos = db.Table(
    'historico_assistidos',
    db.Column('usuario_id', db.Integer, db.ForeignKey('usuario.id'), primary_key=True),
    db.Column('conteudo_id', db.Integer, db.ForeignKey('conteudo.id'), primary_key=True),
    db.Column('data_assistido', db.DateTime, default=datetime.utcnow)
)

class Usuario(db.Model):
    """
    Entidade de Domínio Usuario - Paradigma Orientado a Objetos (POO).
    Encapsula dados cadastrais, regras de validação de senha e consulta ao histórico.
    """
    __tablename__ = 'usuario'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    idade = db.Column(db.Integer, nullable=False)
    _generos_favoritos = db.Column('generos_favoritos', db.Text, nullable=False, default='[]')

    # Relacionamento N:N com Conteudo via tabela de associação
    historico = db.relationship(
        'Conteudo',
        secondary=historico_assistidos,
        lazy='subquery',
        backref=db.backref('usuarios_que_assistiram', lazy=True)
    )

    def __init__(self, nome: str = None, username: str = None, idade: int = None, password_hash: str = None, generos_favoritos: list = None, **kwargs):
        super().__init__(**kwargs)
        if nome is not None:
            self.nome = nome
        if username is not None:
            self.username = username
        if idade is not None:
            self.idade = idade
        if password_hash is not None:
            self.password_hash = password_hash
        if generos_favoritos is not None:
            self.generos_favoritos = generos_favoritos

    def set_password(self, password: str) -> None:
        """Cria e armazena o hash seguro da senha do usuário usando Werkzeug."""
        if not password or len(password.strip()) < 4:
            raise ValueError("A senha deve conter pelo menos 4 caracteres.")
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Verifica a senha digitada contra o hash armazenado."""
        return check_password_hash(self.password_hash, password)

    @property
    def generos_favoritos(self) -> list:
        """Retorna a lista de gêneros favoritos a partir da string JSON."""
        try:
            return json.loads(self._generos_favoritos) if self._generos_favoritos else []
        except json.JSONDecodeError:
            return []

    @generos_favoritos.setter
    def generos_favoritos(self, lista_generos: list) -> None:
        """Armazena a lista de gêneros convertida para formato JSON."""
        if not isinstance(lista_generos, list):
            raise TypeError("Os gêneros favoritos devem ser fornecidos como uma lista.")
        self._generos_favoritos = json.dumps(lista_generos, ensure_ascii=False)

    def ja_assistiu(self, conteudo_id: int) -> bool:
        """Retorna True se o conteúdo especificado consta no histórico do usuário."""
        return any(c.id == conteudo_id for c in self.historico)

    def to_dict(self) -> dict:
        """Serializa a entidade Usuario para dicionário."""
        return {
            "id": self.id,
            "nome": self.nome,
            "username": self.username,
            "idade": self.idade,
            "generos_favoritos": self.generos_favoritos,
            "historico_ids": [c.id for c in self.historico]
        }

    def __repr__(self) -> str:
        return f"<Usuario {self.username} (Idade: {self.idade})>"
