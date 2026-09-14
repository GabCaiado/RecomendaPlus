"""
Paradigma Lógico (Logical Programming Paradigm)

Este módulo implementa um motor de inferência declarativa para regras de restrição etária.
Em vez de encadear estruturas imperativas de 'if/elif/else' no fluxo da aplicação,
a regra de negócio é definida por uma Base de Conhecimento (Fatos Normativos) e um
mecanismo de unificação e resolução de cláusulas lógicas.
"""

# Base Declarativa de Conhecimento (Fatos Normativos: Classificação Indicativa -> Idade Mínima Requerida)
REGRAS_CLASSIFICACAO = [
    ("Livre", 0),
    ("10", 10),
    ("12", 12),
    ("14", 14),
    ("16", 16),
    ("18", 18)
]

def _unificar_classificacao(classificacao_buscada: str, fatos: list) -> int | None:
    """
    Função de Unificação Lógica: Busca o fato normativo correspondente à classificação na base de conhecimento.
    Retorna a idade mínima associada ao fato ou None se a classificação for desconhecida.
    """
    # Avaliação por casamento de padrões (pattern matching declarativo) na base de fatos
    matches = [idade_minima for classificacao, idade_minima in fatos if classificacao.strip().lower() == classificacao_buscada.strip().lower()]
    return matches[0] if matches else None

def _avaliar_clausula_etaria(idade_usuario: int, idade_minima: int) -> bool:
    """
    Cláusula Lógica de Permissão: Regra de Inferência IdadeUsuario >= IdadeMinimaConteudo.
    """
    return idade_usuario >= idade_minima

def inferir_permissao_acesso(idade_usuario: int, classificacao_conteudo: str) -> bool:
    """
    Motor de Inferência Lógica (Logic Engine Entrypoint).
    
    A partir de:
      - Fato de entrada 1: idade_usuario (int)
      - Fato de entrada 2: classificacao_conteudo (str)
      - Base de Conhecimento: REGRAS_CLASSIFICACAO
      
    Avalia a permissão de acesso através da unificação do fato e resolução da cláusula declarativa.
    Retorna True se o acesso for permitido, False caso contrário.
    """
    if idade_usuario is None or not classificacao_conteudo:
        return False

    idade_minima_requerida = _unificar_classificacao(classificacao_conteudo, REGRAS_CLASSIFICACAO)
    
    # Se a classificação não constar nos fatos normativos, aplica princípio de precaução (bloqueia)
    if idade_minima_requerida is None:
        return False

    # Resolução lógica da cláusula
    return _avaliar_clausula_etaria(idade_usuario, idade_minima_requerida)
