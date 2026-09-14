"""
Paradigma Funcional (Functional Programming Paradigm)

Este módulo implementa o motor de recomendações utilizando princípios de Programação Funcional:
1. Funções Puras (Sem efeitos colaterais, mesma entrada produz mesma saída).
2. Imutabilidade (Não altera as listas ou objetos de entrada).
3. Transformações com Funções de Alta Ordem (filter, map, sorted, lambda).
"""

from typing import List, Dict, Any
from app.services.access_rules import inferir_permissao_acesso

def calcular_afinidade(generos_conteudo: list, generos_favoritos: set) -> int:
    """
    Função Pura: Calcula a pontuação de afinidade baseada na interseção de conjuntos de gêneros.
    Sem efeitos colaterais, completamente determinística.
    """
    if not generos_conteudo or not generos_favoritos:
        return 0
    
    set_conteudo = set(g.strip().lower() for g in generos_conteudo)
    set_favoritos = set(g.strip().lower() for g in generos_favoritos)
    
    return len(set_conteudo.intersection(set_favoritos))


def obter_recomendacoes(catalogo: list, usuario, limite: int = 5) -> List[Dict[str, Any]]:
    """
    Pipeline Funcional de Recomendação:
    
    Entrada: Lista imutável do catálogo de conteúdos e entidade Usuario.
    Processamento:
      1. FILTER: Filtra conteúdos não assistidos e com classificação etária autorizada (Paradigma Lógico).
      2. MAP: Associa cada conteúdo a uma tupla (conteúdo, pontuação_afinidade).
      3. SORTED: Ordena de forma determinística por maior afinidade e título sem mutar a lista original.
      4. MAP: Formata a saída em dicionário contendo os dados do conteúdo e a pontuação calculada.
    """
    if not catalogo or not usuario:
        return []

    favoritos_set = set(usuario.generos_favoritos)
    idade_usuario = usuario.idade
    historico_ids = set(c.id for c in usuario.historico)

    # 1. FILTER: Apenas conteúdos que o usuário NÃO assistiu e aos quais tem acesso pela classificação etária
    conteudos_elegiveis = filter(
        lambda c: c.id not in historico_ids and inferir_permissao_acesso(idade_usuario, c.classificacao_etaria),
        catalogo
    )

    # 2. MAP: Mapeia cada conteúdo para a tupla (conteudo, afinidade)
    conteudos_com_score = map(
        lambda c: (c, calcular_afinidade(c.generos, favoritos_set)),
        conteudos_elegiveis
    )

    # 3. SORTED: Ordenação determinística (maior afinidade primeiro, desempate alfabético por título)
    conteudos_ordenados = sorted(
        conteudos_com_score,
        key=lambda item: (-item[1], item[0].titulo.lower())
    )

    # 4. MAP: Truncamento no limite desejado e conversão pura para dicionários serializáveis
    recomendacoes_finais = map(
        lambda item: {
            **item[0].to_dict(),
            "pontuacao_afinidade": item[1],
            "motivo_recomendacao": f"{item[1]} gênero(s) coincidente(s) com seus favoritos" if item[1] > 0 else "Recomendação geral do catálogo"
        },
        conteudos_ordenados[:limite]
    )

    return list(recomendacoes_finais)
