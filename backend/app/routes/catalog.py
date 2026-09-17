from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app.extensions import db
from app.models.user import Usuario
from app.models.content import Conteudo
from app.services.access_rules import inferir_permissao_acesso
from app.services.recommendation import obter_recomendacoes

catalog_bp = Blueprint('catalog', __name__, url_prefix='/api/conteudo')

@catalog_bp.route('', methods=['GET'])
def listar_catalogo():
    """
    Listar todo o catálogo de filmes e séries.
    """
    conteudos = Conteudo.query.all()
    usuario_atual = None

    # Tenta verificar se o usuário enviou token válido de forma opcional
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        if user_id:
            usuario_atual = Usuario.query.get(int(user_id))
    except Exception:
        usuario_atual = None

    resultado = []
    for c in conteudos:
        dados = c.to_dict()
        if usuario_atual:
            # Aplicação do Paradigma Lógico para verificar se o acesso é permitido para a idade do usuário logado
            dados['acesso_permitido'] = inferir_permissao_acesso(usuario_atual.idade, c.classificacao_etaria)
            dados['ja_assistiu'] = usuario_atual.ja_assistiu(c.id)
        else:
            dados['acesso_permitido'] = True
            dados['ja_assistiu'] = False
        resultado.append(dados)

    return jsonify(resultado), 200


@catalog_bp.route('/recomendados', methods=['GET'])
@jwt_required()
def obter_recomendados_usuario():
    """
    Obter recomendações de conteúdos personalizadas (Paradigma Funcional).
    """
    user_id = get_jwt_identity()
    usuario = Usuario.query.get(int(user_id))
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado."}), 404

    catalogo_completo = Conteudo.query.all()

    # Invocação da função pura e imutável do Paradigma Funcional
    recomendacoes = obter_recomendacoes(catalogo_completo, usuario, limite=6)

    return jsonify({
        "usuario_id": usuario.id,
        "generos_favoritos": usuario.generos_favoritos,
        "idade": usuario.idade,
        "recomendacoes": recomendacoes
    }), 200


@catalog_bp.route('/<int:conteudo_id>/assistir', methods=['POST'])
@jwt_required()
def marcar_como_assistido(conteudo_id: int):
    """
    Marcar conteúdo como assistido no histórico do usuário (Paradigma Imperativo).
    """
    # Passo Imperativo 1: Obter a identidade do usuário autenticado no JWT
    user_id = get_jwt_identity()
    
    # Passo Imperativo 2: Buscar o usuário no banco de dados
    usuario = Usuario.query.get(int(user_id))
    if not usuario:
        return jsonify({"erro": "Usuário autenticado não foi encontrado no banco."}), 404

    # Passo Imperativo 3: Buscar o conteúdo solicitado no banco de dados
    conteudo = Conteudo.query.get(conteudo_id)
    if not conteudo:
        return jsonify({"erro": "Conteúdo solicitado não existe."}), 404

    # Passo Imperativo 4: Consultar o Paradigma Lógico para validar a faixa etária antes da mutação
    acesso_autorizado = inferir_permissao_acesso(usuario.idade, conteudo.classificacao_etaria)
    if not acesso_autorizado:
        return jsonify({
            "erro": f"Acesso negado. Sua idade ({usuario.idade} anos) é incompatível com a classificação indicativa '{conteudo.classificacao_etaria}'."
        }), 403

    # Passo Imperativo 5: Checar se o conteúdo já consta no histórico do usuário
    if usuario.ja_assistiu(conteudo.id):
        return jsonify({"mensagem": "Este conteúdo já foi marcado como assistido anteriormente."}), 200

    # Passo Imperativo 6: Mutar o estado da coleção relacionando usuário e conteúdo
    try:
        usuario.historico.append(conteudo)
        
        # Passo Imperativo 7: Efeito Colateral Transacional Explícito (Commit no SQLite)
        db.session.commit()
        
        # Passo Imperativo 8: Retornar o resultado do procedimento
        return jsonify({
            "sucesso": True,
            "mensagem": f"'{conteudo.titulo}' adicionado ao seu histórico de assistidos!",
            "conteudo_id": conteudo.id
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": f"Erro transacional ao atualizar histórico: {str(e)}"}), 500


@catalog_bp.route('/historico', methods=['GET'])
@jwt_required()
def obter_historico():
    """
    Obter o histórico de conteúdos assistidos pelo usuário autenticado.
    """
    user_id = get_jwt_identity()
    usuario = Usuario.query.get(int(user_id))
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado."}), 404

    historico_serializado = []
    for c in usuario.historico:
        dados = c.to_dict()
        dados['acesso_permitido'] = inferir_permissao_acesso(usuario.idade, c.classificacao_etaria)
        dados['ja_assistiu'] = True
        historico_serializado.append(dados)

    return jsonify(historico_serializado), 200
