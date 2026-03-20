import os
from flask import Flask, jsonify
from flask_cors import CORS
from flasgger import Swagger

# Importando a instância do banco de dados (Infraestrutura)
from app.infrastructure.database.db import db

# Importando os Controllers (Delivery/Web)
from app.controllers.cliente_controller import cliente_bp
from app.controllers.categoria_controller import categoria_bp
from app.controllers.subcategoria_controller import subcategoria_bp
from app.controllers.marca_controller import marca_bp
from app.controllers.produto_controller import produto_bp
# Os próximos entrarão aqui em breve:
# from src.delivery.web.controllers.produto_controller import produto_bp
# from src.delivery.web.controllers.pedido_controller import pedido_bp

def create_app():
    app = Flask(__name__)

    # ==========================================
    # Configuração do Banco de Dados (PostgreSQL)
    # ==========================================
    # Valores padrão ajustados para facilitar o teste local
    DB_USER = os.getenv("POSTGRES_USER", "user")
    DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
    DB_HOST = os.getenv("DB_HOST", "0.0.0.0")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("POSTGRES_DB", "mydatabase")

    DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    # Inicializa o SQLAlchemy com o app
    db.init_app(app)

    # ==========================================
    # Configurações Adicionais (CORS e Swagger)
    # ==========================================
    CORS(app) # Permite que o frontend faça requisições para a API sem erros de domínio

    app.config["SWAGGER"] = {
        "title": "Bikes e Trikes API",
        "uiversion": 3,
    }
    # Removi o template_file para o Swagger gerar a interface 
    # automaticamente baseada nos decoradores @swag_from das suas rotas
    Swagger(app) 

    # ==========================================
    # Registro das Rotas (Blueprints)
    # ==========================================
    # O prefixo já foi definido dentro de cliente_controller.py como url_prefix='/api/clientes'
    app.register_blueprint(cliente_bp)
    app.register_blueprint(categoria_bp)
    app.register_blueprint(subcategoria_bp)
    app.register_blueprint(marca_bp)
    app.register_blueprint(produto_bp)
    
    # Rota raiz de Status (Health Check)
    @app.route("/")
    def root():
        return jsonify({"message": "Bikes e Trikes API is running v1.0", "status": "ok"}), 200

    return app

if __name__ == "__main__":
    app = create_app()
    
    # Cria as tabelas no banco de dados automaticamente se elas não existirem
    with app.app_context():
        db.create_all() 
        
    app.run(host="0.0.0.0", port=5000, debug=True)