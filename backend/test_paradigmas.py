"""
Script de Teste dos 4 Paradigmas de Programação:
1. POO (Models Usuario e Conteudo)
2. Lógico (access_rules.py)
3. Funcional (recommendation.py)
4. Imperativo (catalog.py assistir logic)
"""
import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import create_app
from app.extensions import db
from app.models.user import Usuario
from app.models.content import Conteudo
from app.services.access_rules import inferir_permissao_acesso
from app.services.recommendation import obter_recomendacoes, calcular_afinidade

def testar_paradigmas():
    app = create_app()
    with app.app_context():
        print("=== TESTANDO PARADIGMA 1: POO (Orientado a Objetos) ===")
        user = Usuario.query.filter_by(username="lucas12").first()
        conteudo_livre = Conteudo.query.filter_by(classificacao_etaria="Livre").first()
        conteudo_18 = Conteudo.query.filter_by(classificacao_etaria="18").first()

        assert user is not None, "Usuário lucas12 deve existir"
        assert user.check_password("123456"), "Senha do usuário POO deve ser verificada via check_password"
        assert conteudo_livre.possui_genero(conteudo_livre.generos[0]), "Método POO possui_genero deve funcionar"
        print(f"[OK] POO: Usuário '{user.nome}' (Idade: {user.idade}) carregado via SQLAlchemy ORM com métodos de instância.")

        print("\n=== TESTANDO PARADIGMA 2: LÓGICO (Unificação e Regras) ===")
        permissao_livre = inferir_permissao_acesso(user.idade, conteudo_livre.classificacao_etaria)
        permissao_18 = inferir_permissao_acesso(user.idade, conteudo_18.classificacao_etaria)

        assert permissao_livre is True, "Lucas (12 anos) DEVE ter permissão para conteúdo Livre"
        assert permissao_18 is False, "Lucas (12 anos) NÃO DEVE ter permissão para conteúdo 18+"
        print(f"[OK] LÓGICO: Inferência declarativa permitiu conteúdo Livre ({permissao_livre}) e bloqueou conteúdo 18+ ({permissao_18}).")

        print("\n=== TESTANDO PARADIGMA 3: FUNCIONAL (Recomendador Puro) ===")
        catalogo = Conteudo.query.all()
        recomendacoes = obter_recomendacoes(catalogo, user, limite=5)

        assert isinstance(recomendacoes, list), "Resultado deve ser uma lista"
        assert len(recomendacoes) > 0, "Deve gerar recomendações para o usuário"
        for rec in recomendacoes:
            assert inferir_permissao_acesso(user.idade, rec["classificacao_etaria"]), "Todas as recomendações devem respeitar a idade"
            assert rec["id"] not in [c.id for c in user.historico], "Não deve recomendar o que já foi assistido"
        print(f"[OK] FUNCIONAL: Geradas {len(recomendacoes)} recomendações puras sem efeitos colaterais.")

        print("\n=== TESTANDO PARADIGMA 4: IMPERATIVO (Efeito Colateral Transacional) ===")
        # Adiciona o conteúdo livre ao histórico de Lucas de forma imperativa
        tamanho_historico_antes = len(user.historico)
        if not user.ja_assistiu(conteudo_livre.id):
            user.historico.append(conteudo_livre)
            db.session.commit()
            print(f"[OK] IMPERATIVO: Transação commitada no SQLite. Conteúdo '{conteudo_livre.titulo}' adicionado.")

        user_atualizado = Usuario.query.get(user.id)
        assert user_atualizado.ja_assistiu(conteudo_livre.id), "Histórico deve conter o filme assistido"
        print("=== TODOS OS 4 PARADIGMAS VALIDADOS COM SUCESSO! ===")

if __name__ == "__main__":
    testar_paradigmas()
