from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from app.extensions import db
from app.models.user import Usuario

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    
    nome = data.get('nome')
    username = data.get('username')
    password = data.get('password')
    idade = data.get('idade')
    generos_favoritos = data.get('generos_favoritos', [])

    if not nome or not username or not password or idade is None:
        return jsonify({"erro": "Campos 'nome', 'username', 'password' e 'idade' são obrigatórios."}), 400

    if len(str(password).strip()) < 4:
        return jsonify({"erro": "A senha deve conter pelo menos 4 caracteres."}), 400

    try:
        idade = int(idade)
        if idade < 0 or idade > 120:
            return jsonify({"erro": "Idade inválida."}), 400
    except (ValueError, TypeError):
        return jsonify({"erro": "A idade deve ser um número inteiro válido."}), 400

    if Usuario.query.filter_by(username=username).first():
        return jsonify({"erro": "Este nome de usuário já está em uso."}), 409

    try:
        user = Usuario(
            nome=nome.strip(),
            username=username.strip().lower(),
            idade=idade
        )
        user.set_password(password)
        user.generos_favoritos = generos_favoritos if isinstance(generos_favoritos, list) else []

        db.session.add(user)
        db.session.commit()

        # Emite tokens imediatamente após o cadastro
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return jsonify({
            "mensagem": "Usuário cadastrado com sucesso!",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "usuario": user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": f"Erro interno ao cadastrar usuário: {str(e)}"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Autenticar usuário e emitir JWT Tokens.
    """
    data = request.get_json() or {}
    username = data.get('username', '').strip().lower()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({"erro": "Informe username e password."}), 400

    user = Usuario.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"erro": "Credenciais inválidas. Verifique usuário e senha."}), 401

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "mensagem": "Login realizado com sucesso!",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "usuario": user.to_dict()
    }), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Renovar o Access Token JWT.
    """
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)
    return jsonify({"access_token": new_access_token}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """
    Obter perfil do usuário autenticado.
    """
    user_id = get_jwt_identity()
    user = Usuario.query.get(int(user_id))

    if not user:
        return jsonify({"erro": "Usuário não encontrado."}), 404

    return jsonify({"usuario": user.to_dict()}), 200
