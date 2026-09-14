from flask import Flask
from app.config import Config
from app.extensions import db, jwt, cors, swagger

def create_app(config_class=Config):
    """
    Application Factory do Flask.
    Inicializa extensões (SQLAlchemy, JWTManager, CORS, Swagger) e registra Blueprints.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Inicializa extensões
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": "*", "allow_headers": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}},
        supports_credentials=True
    )

    swagger_template = {
        "swagger": "2.0",
        "info": {
            "title": "Recomenda+ STREAMING - Documentação da API",
            "description": "Documentação OpenAPI/Swagger interativa para o backend Flask (Autenticação JWT, Recomendações Funcionais e Regras Lógicas de Faixa Etária).",
            "version": "1.0.0"
        },
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "Insira o token JWT no formato: Bearer <seu_access_token>"
            }
        }
    }
    swagger.template = swagger_template
    swagger.init_app(app)

    # Registra Blueprints das rotas
    from app.routes.auth import auth_bp
    from app.routes.catalog import catalog_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(catalog_bp)

    # Cria tabelas do banco SQLite se não existirem
    with app.app_context():
        db.create_all()

    return app
