import os
import sys
import time
import urllib.parse

import requests

# Adiciona o diretório raiz do backend ao sys.path para garantir importação dos pacotes do app
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import create_app
from app.extensions import db
from app.models.content import Conteudo
from app.models.user import Usuario

WIKIPEDIA_API_URL = "https://pt.wikipedia.org/api/rest_v1/page/summary/{}"
WIKIPEDIA_USER_AGENT = "RecomendaPlusSeedScript/1.0 (projeto educacional; contato: hernanjunior90@gmail.com)"
SINOPSE_TAMANHO_MAXIMO = 500
IMAGEM_FALLBACK = "https://images.unsplash.com/photo-1489599162946-4dbf6bf76dd2?auto=format&fit=crop&w=800&q=80"

# Catálogo de produções originais fictícias da plataforma (não existem no mundo real)
TITULOS_SEED = [
    {
        "titulo": "O Reino de Eldoria",
        "sinopse": "Um jovem camponês descobre ser o último guardião dos dragões em uma terra dominada pela magia negra.",
        "generos": ["Fantasia", "Aventura", "Ação"],
        "classificacao_etaria": "Livre",
        "imagem_banner_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "A Turma da Floresta Secreta",
        "sinopse": "Animação encantadora sobre três pequenos animais que saem em busca de um tesouro escondido para salvar o seu lar.",
        "generos": ["Animação", "Comédia", "Família"],
        "classificacao_etaria": "Livre",
        "imagem_banner_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "As Crônicas da Galáxia",
        "sinopse": "Exploradores espaciais viajam por buracos de minhoca em busca de um novo planeta habitável para a humanidade.",
        "generos": ["Sci-Fi", "Aventura"],
        "classificacao_etaria": "10",
        "imagem_banner_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "Goleadores da Várzea",
        "sinopse": "Comédia divertida acompanhando um time amador de futebol disputando a grande final do campeonato do bairro.",
        "generos": ["Comédia", "Esporte"],
        "classificacao_etaria": "10",
        "imagem_banner_url": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "A Lenda do Samurai Imortal",
        "sinopse": "No Japão feudal, um guerreiro renegado busca redenção enquanto protege um jovem prodígio das forças imperiais.",
        "generos": ["Ação", "Drama", "Histórico"],
        "classificacao_etaria": "12",
        "imagem_banner_url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "Mistérios em Neblina Alta",
        "sinopse": "Um grupo de adolescentes investiga o desaparecimento intrigante de seu professor de ciências durante as férias.",
        "generos": ["Suspense", "Aventura", "Drama"],
        "classificacao_etaria": "12",
        "imagem_banner_url": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "Código Cyberpunk 2099",
        "sinopse": "Em uma megalópole tomada por luzes neon e mega-corporações, uma hacker tenta expor uma conspiração global.",
        "generos": ["Sci-Fi", "Ação", "Cyberpunk"],
        "classificacao_etaria": "14",
        "imagem_banner_url": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "Bastidores do Jazz",
        "sinopse": "Documentário tocante sobre a vida e a jornada de músicos lendários na era de ouro de Nova Orleans.",
        "generos": ["Documentário", "Música"],
        "classificacao_etaria": "14",
        "imagem_banner_url": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "Cartas ao Entardecer",
        "sinopse": "Dois amantes separados pela guerra trocam cartas ao longo de duas décadas enquanto tentam se reencontrar.",
        "generos": ["Romance", "Drama"],
        "classificacao_etaria": "14",
        "imagem_banner_url": "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "A Hora das Sombras",
        "sinopse": "Pesquisadores sobem uma montanha isolada e descobrem uma força sobrenatural antiga que se alimenta do medo.",
        "generos": ["Terror", "Suspense"],
        "classificacao_etaria": "16",
        "imagem_banner_url": "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "Cartel da Capital",
        "sinopse": "Série dramática visceral que explora as alianças secretas e a luta pelo poder no submundo do crime organizado.",
        "generos": ["Crime", "Drama", "Ação"],
        "classificacao_etaria": "16",
        "imagem_banner_url": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "Protocolo Vermelho",
        "sinopse": "Um agente aposentado precisa realizar uma última missão suicida para salvar a sua família sequestrada.",
        "generos": ["Ação", "Suspense"],
        "classificacao_etaria": "16",
        "imagem_banner_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "Noite Profunda",
        "sinopse": "Thriller psicológico perturbador centrado em um detetive que investiga crimes ritualísticos na metrópole.",
        "generos": ["Terror", "Crime", "Suspense"],
        "classificacao_etaria": "18",
        "imagem_banner_url": "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "Subsolo: Guerra Sem Fim",
        "sinopse": "Em um futuro pós-apocalíptico desolado, sobreviventes duelam em arenas clandestinas sob as ruínas da civilização.",
        "generos": ["Ação", "Sci-Fi", "Drama"],
        "classificacao_etaria": "18",
        "imagem_banner_url": "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "Revolução dos Máquinas",
        "sinopse": "A inteligência artificial assume o controle dos sistemas de defesa mundial e um grupo de rebeldes tenta desligar o núcleo.",
        "generos": ["Sci-Fi", "Ação"],
        "classificacao_etaria": "14",
        "imagem_banner_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "Viagem ao Centro do Oceano",
        "sinopse": "Biólogos marinhos encontram uma espécie inteligente habitando as fossas abissais do Pacífico.",
        "generos": ["Documentário", "Aventura", "Sci-Fi"],
        "classificacao_etaria": "Livre",
        "imagem_banner_url": "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "Stand-up: Rindo Sem Limites",
        "sinopse": "Especial de comédia imperdível reunindo os maiores nomes do humor da atualidade em um show ao vivo.",
        "generos": ["Comédia"],
        "classificacao_etaria": "16",
        "imagem_banner_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    },
    {
        "titulo": "A Última Melodia",
        "sinopse": "Dramaturgo aposentado compõe a sua obra-prima enquanto reconcilia laços familiares quebrados.",
        "generos": ["Drama", "Música"],
        "classificacao_etaria": "12",
        "imagem_banner_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    },
]

# Catálogo de filmes reais (licenciados de terceiros, não são produções da plataforma).
# A sinopse e a imagem de capa de cada item são obtidas em tempo real via scraping
# da API pública da Wikipédia em português (não requer chave de API).
FILMES_REAIS_SEED = [
    {"titulo": "Matrix", "wiki_titulo": "Matrix", "generos": ["Sci-Fi", "Ação", "Cyberpunk"], "classificacao_etaria": "14"},
    {"titulo": "O Poderoso Chefão", "wiki_titulo": "O Poderoso Chefão", "generos": ["Crime", "Drama"], "classificacao_etaria": "16"},
    {"titulo": "Cidade de Deus", "wiki_titulo": "Cidade de Deus (filme)", "generos": ["Crime", "Drama"], "classificacao_etaria": "18"},
    {"titulo": "Parasita", "wiki_titulo": "Parasita (filme)", "generos": ["Drama", "Suspense"], "classificacao_etaria": "16"},
    {"titulo": "Toy Story", "wiki_titulo": "Toy Story", "generos": ["Animação", "Família", "Comédia"], "classificacao_etaria": "Livre"},
    {"titulo": "Coco", "wiki_titulo": "Coco (filme)", "generos": ["Animação", "Família", "Aventura"], "classificacao_etaria": "Livre"},
    {"titulo": "Vingadores: Ultimato", "wiki_titulo": "Vingadores: Ultimato", "generos": ["Ação", "Aventura", "Sci-Fi"], "classificacao_etaria": "12"},
    {"titulo": "Um Sonho de Liberdade", "wiki_titulo": "Um Sonho de Liberdade", "generos": ["Drama"], "classificacao_etaria": "14"},
    {"titulo": "Pantera Negra", "wiki_titulo": "Pantera Negra (filme)", "generos": ["Ação", "Aventura", "Sci-Fi"], "classificacao_etaria": "12"},
    {"titulo": "La La Land", "wiki_titulo": "La La Land (filme)", "generos": ["Romance", "Música", "Drama"], "classificacao_etaria": "10"},
    {"titulo": "Coringa", "wiki_titulo": "Joker (filme)", "generos": ["Drama", "Crime", "Suspense"], "classificacao_etaria": "16"},
    {"titulo": "Interestelar", "wiki_titulo": "Interestelar", "generos": ["Sci-Fi", "Drama", "Aventura"], "classificacao_etaria": "10"},
    {"titulo": "A Origem", "wiki_titulo": "A Origem", "generos": ["Sci-Fi", "Suspense", "Ação"], "classificacao_etaria": "12"},
    {"titulo": "O Iluminado", "wiki_titulo": "O Iluminado", "generos": ["Terror", "Suspense"], "classificacao_etaria": "16"},
    {"titulo": "Invocação do Mal", "wiki_titulo": "Invocação do Mal", "generos": ["Terror", "Suspense"], "classificacao_etaria": "16"},
    {"titulo": "Bacurau", "wiki_titulo": "Bacurau (filme)", "generos": ["Suspense", "Drama", "Ação"], "classificacao_etaria": "16"},
    {"titulo": "Tropa de Elite", "wiki_titulo": "Tropa de Elite (filme)", "generos": ["Ação", "Crime", "Drama"], "classificacao_etaria": "16"},
    {"titulo": "Central do Brasil", "wiki_titulo": "Central do Brasil (filme)", "generos": ["Drama"], "classificacao_etaria": "12"},
    {"titulo": "Rocky", "wiki_titulo": "Rocky", "generos": ["Drama", "Esporte"], "classificacao_etaria": "10"},
    {"titulo": "Frozen: Uma Aventura Congelante", "wiki_titulo": "Frozen: Uma Aventura Congelante", "generos": ["Animação", "Família", "Aventura"], "classificacao_etaria": "Livre"},
    {"titulo": "O Rei Leão", "wiki_titulo": "O Rei Leão", "generos": ["Animação", "Família", "Drama"], "classificacao_etaria": "Livre"},
    {"titulo": "Star Wars: Uma Nova Esperança", "wiki_titulo": "Star Wars: Episódio IV – Uma Nova Esperança", "generos": ["Sci-Fi", "Aventura", "Ação"], "classificacao_etaria": "10"},
    {"titulo": "De Volta para o Futuro", "wiki_titulo": "De Volta para o Futuro", "generos": ["Sci-Fi", "Aventura", "Comédia"], "classificacao_etaria": "Livre"},
    {"titulo": "Clube da Luta", "wiki_titulo": "Clube da Luta (filme)", "generos": ["Drama", "Suspense"], "classificacao_etaria": "18"},
    {"titulo": "Pulp Fiction: Tempo de Violência", "wiki_titulo": "Pulp Fiction: Tempo de Violência", "generos": ["Crime", "Drama"], "classificacao_etaria": "18"},
    {"titulo": "Titanic", "wiki_titulo": "Titanic (filme de 1997)", "generos": ["Romance", "Drama"], "classificacao_etaria": "12"},
    {"titulo": "Gladiador", "wiki_titulo": "Gladiador (filme)", "generos": ["Ação", "Drama", "Histórico"], "classificacao_etaria": "16"},
    {"titulo": "Amadeus", "wiki_titulo": "Amadeus", "generos": ["Drama", "Música", "Histórico"], "classificacao_etaria": "12"},
    {"titulo": "Sociedade dos Poetas Mortos", "wiki_titulo": "Sociedade dos Poetas Mortos", "generos": ["Drama"], "classificacao_etaria": "12"},
    {"titulo": "Free Solo", "wiki_titulo": "Free Solo", "generos": ["Documentário", "Esporte", "Aventura"], "classificacao_etaria": "Livre"},
    {"titulo": "Corra!", "wiki_titulo": "Corra!", "generos": ["Terror", "Suspense"], "classificacao_etaria": "16"},
    {"titulo": "Divertida Mente", "wiki_titulo": "Divertida Mente", "generos": ["Animação", "Família", "Comédia", "Drama"], "classificacao_etaria": "Livre"},
    {"titulo": "Shrek", "wiki_titulo": "Shrek", "generos": ["Animação", "Comédia", "Família", "Aventura"], "classificacao_etaria": "Livre"},
    {"titulo": "Ainda Estou Aqui", "wiki_titulo": "Ainda Estou Aqui (filme de 2024)", "generos": ["Drama", "Histórico"], "classificacao_etaria": "12"},
    {"titulo": "Que Horas Ela Volta?", "wiki_titulo": "Que Horas Ela Volta?", "generos": ["Drama"], "classificacao_etaria": "12"},
    {"titulo": "Aquarius", "wiki_titulo": "Aquarius (filme)", "generos": ["Drama"], "classificacao_etaria": "16"},
    {"titulo": "O Auto da Compadecida", "wiki_titulo": "O Auto da Compadecida (filme)", "generos": ["Comédia"], "classificacao_etaria": "12"},
    {"titulo": "Minha Mãe É uma Peça", "wiki_titulo": "Minha Mãe É uma Peça", "generos": ["Comédia"], "classificacao_etaria": "12"},
    {"titulo": "Cidadão Kane", "wiki_titulo": "Cidadão Kane", "generos": ["Drama"], "classificacao_etaria": "12"},
    {"titulo": "Forrest Gump", "wiki_titulo": "Forrest Gump", "generos": ["Drama", "Comédia"], "classificacao_etaria": "12"},
    {"titulo": "O Silêncio dos Inocentes", "wiki_titulo": "O Silêncio dos Inocentes", "generos": ["Terror", "Suspense", "Crime"], "classificacao_etaria": "16"},
    {"titulo": "O Grande Hotel Budapeste", "wiki_titulo": "The Grand Budapest Hotel", "generos": ["Comédia", "Drama", "Aventura"], "classificacao_etaria": "12"},
    {"titulo": "O Show de Truman", "wiki_titulo": "The Truman Show", "generos": ["Drama", "Comédia", "Sci-Fi"], "classificacao_etaria": "10"},
    {"titulo": "Diário de uma Paixão", "wiki_titulo": "The Notebook", "generos": ["Romance", "Drama"], "classificacao_etaria": "12"},
    {"titulo": "Orgulho e Preconceito", "wiki_titulo": "Orgulho e Preconceito (filme de 2005)", "generos": ["Romance", "Drama"], "classificacao_etaria": "Livre"},
    {"titulo": "Simplesmente Amor", "wiki_titulo": "Love Actually", "generos": ["Romance", "Comédia", "Drama"], "classificacao_etaria": "12"},
    {"titulo": "A Lista de Schindler", "wiki_titulo": "A Lista de Schindler", "generos": ["Drama", "Guerra", "Histórico"], "classificacao_etaria": "16"},
    {"titulo": "12 Anos de Escravidão", "wiki_titulo": "12 Years a Slave", "generos": ["Drama", "Histórico"], "classificacao_etaria": "16"},
    {"titulo": "Os Vingadores", "wiki_titulo": "The Avengers (2012)", "generos": ["Ação", "Aventura", "Sci-Fi"], "classificacao_etaria": "12"},
    {"titulo": "Homem-Aranha: Sem Volta Para Casa", "wiki_titulo": "Spider-Man: No Way Home", "generos": ["Ação", "Aventura", "Sci-Fi"], "classificacao_etaria": "12"},
    {"titulo": "Duna", "wiki_titulo": "Duna (filme de 2021)", "generos": ["Sci-Fi", "Aventura"], "classificacao_etaria": "12"},
    {"titulo": "Duna: Parte Dois", "wiki_titulo": "Duna: Parte Dois", "generos": ["Sci-Fi", "Aventura"], "classificacao_etaria": "14"},
    {"titulo": "Doutor Estranho", "wiki_titulo": "Doctor Strange (filme)", "generos": ["Ação", "Aventura", "Fantasia", "Sci-Fi"], "classificacao_etaria": "12"},
    {"titulo": "Homem de Ferro", "wiki_titulo": "Homem de Ferro (filme)", "generos": ["Ação", "Aventura", "Sci-Fi"], "classificacao_etaria": "12"},
    {"titulo": "Capitão América: Guerra Civil", "wiki_titulo": "Captain America: Civil War", "generos": ["Ação", "Aventura", "Sci-Fi"], "classificacao_etaria": "12"},
    {"titulo": "Mulher-Maravilha", "wiki_titulo": "Wonder Woman (filme)", "generos": ["Ação", "Aventura", "Fantasia"], "classificacao_etaria": "12"},
    {"titulo": "Batman: O Cavaleiro das Trevas", "wiki_titulo": "The Dark Knight", "generos": ["Ação", "Crime", "Drama"], "classificacao_etaria": "14"},
    {"titulo": "Vingadores: Guerra Infinita", "wiki_titulo": "Vingadores: Guerra Infinita", "generos": ["Ação", "Aventura", "Sci-Fi"], "classificacao_etaria": "12"},
    {"titulo": "Zootopia", "wiki_titulo": "Zootopia", "generos": ["Animação", "Família", "Comédia"], "classificacao_etaria": "Livre"},
    {"titulo": "Moana: Um Mar de Aventuras", "wiki_titulo": "Moana", "generos": ["Animação", "Família", "Aventura"], "classificacao_etaria": "Livre"},
    {"titulo": "Enrolados", "wiki_titulo": "Enrolados", "generos": ["Animação", "Família", "Aventura", "Comédia"], "classificacao_etaria": "Livre"},
    {"titulo": "Up: Altas Aventuras", "wiki_titulo": "Up: Altas Aventuras", "generos": ["Animação", "Família", "Aventura", "Drama"], "classificacao_etaria": "Livre"},
    {"titulo": "WALL-E", "wiki_titulo": "WALL-E", "generos": ["Animação", "Família", "Sci-Fi"], "classificacao_etaria": "Livre"},
    {"titulo": "Ratatouille", "wiki_titulo": "Ratatouille (filme)", "generos": ["Animação", "Família", "Comédia"], "classificacao_etaria": "Livre"},
    {"titulo": "Procurando Nemo", "wiki_titulo": "Procurando Nemo", "generos": ["Animação", "Família", "Aventura"], "classificacao_etaria": "Livre"},
    {"titulo": "Divertida Mente 2", "wiki_titulo": "Divertida Mente 2", "generos": ["Animação", "Família", "Comédia", "Drama"], "classificacao_etaria": "Livre"},
    {"titulo": "Homem-Aranha no Aranhaverso", "wiki_titulo": "Spider-Man: Into the Spider-Verse", "generos": ["Animação", "Ação", "Aventura", "Sci-Fi"], "classificacao_etaria": "12"},
    {"titulo": "A Viagem de Chihiro", "wiki_titulo": "A Viagem de Chihiro", "generos": ["Animação", "Fantasia", "Aventura"], "classificacao_etaria": "Livre"},
    {"titulo": "Jurassic Park", "wiki_titulo": "Jurassic Park", "generos": ["Aventura", "Sci-Fi", "Ação"], "classificacao_etaria": "12"},
    {"titulo": "Tubarão", "wiki_titulo": "Jaws", "generos": ["Terror", "Suspense", "Aventura"], "classificacao_etaria": "12"},
    {"titulo": "Duro de Matar", "wiki_titulo": "Die Hard", "generos": ["Ação", "Suspense"], "classificacao_etaria": "16"},
    {"titulo": "John Wick", "wiki_titulo": "John Wick", "generos": ["Ação", "Suspense", "Crime"], "classificacao_etaria": "16"},
    {"titulo": "Kill Bill: Volume 1", "wiki_titulo": "Kill Bill: Volume 1", "generos": ["Ação", "Crime", "Suspense"], "classificacao_etaria": "18"},
    {"titulo": "Scarface", "wiki_titulo": "Scarface (1983)", "generos": ["Crime", "Drama"], "classificacao_etaria": "18"},
    {"titulo": "Os Infiltrados", "wiki_titulo": "The Departed", "generos": ["Crime", "Drama", "Suspense"], "classificacao_etaria": "18"},
    {"titulo": "Cisne Negro", "wiki_titulo": "Cisne Negro (filme)", "generos": ["Drama", "Suspense", "Terror"], "classificacao_etaria": "16"},
    {"titulo": "Bohemian Rhapsody", "wiki_titulo": "Bohemian Rhapsody (filme)", "generos": ["Drama", "Música"], "classificacao_etaria": "12"},
    {"titulo": "Grease: Nos Tempos da Brilhantina", "wiki_titulo": "Grease (filme)", "generos": ["Música", "Romance", "Comédia"], "classificacao_etaria": "Livre"},
    {"titulo": "Mamma Mia!", "wiki_titulo": "Mamma Mia! (filme)", "generos": ["Música", "Comédia", "Romance"], "classificacao_etaria": "Livre"},
    {"titulo": "Whiplash", "wiki_titulo": "Whiplash (filme)", "generos": ["Drama", "Música"], "classificacao_etaria": "14"},
    {"titulo": "O Resgate do Soldado Ryan", "wiki_titulo": "Saving Private Ryan", "generos": ["Guerra", "Drama", "Ação"], "classificacao_etaria": "16"},
    {"titulo": "1917", "wiki_titulo": "1917 (filme)", "generos": ["Guerra", "Drama"], "classificacao_etaria": "16"},
]


def _truncar_sinopse(texto: str) -> str:
    """Corta a sinopse em um limite razoável de caracteres, preferindo terminar em uma frase completa."""
    texto = texto.strip()
    if len(texto) <= SINOPSE_TAMANHO_MAXIMO:
        return texto
    trecho = texto[:SINOPSE_TAMANHO_MAXIMO]
    fim_frase = trecho.rfind(". ")
    if fim_frase > 0:
        return trecho[:fim_frase + 1]
    return trecho.rstrip() + "..."


def buscar_dados_wikipedia(wiki_titulo: str) -> tuple:
    """
    Faz o scraping da sinopse e da imagem de capa de um filme via API pública
    da Wikipédia (pt.wikipedia.org). Retorna (sinopse, imagem_url), com None
    nos campos que não puderem ser obtidos (ex: falha de rede).
    """
    url = WIKIPEDIA_API_URL.format(urllib.parse.quote(wiki_titulo))
    headers = {"User-Agent": WIKIPEDIA_USER_AGENT}
    try:
        resposta = requests.get(url, headers=headers, timeout=10)
        resposta.raise_for_status()
        dados = resposta.json()
    except (requests.RequestException, ValueError) as erro:
        print(f"  [aviso] Falha ao buscar '{wiki_titulo}' na Wikipédia: {erro}")
        return None, None

    extrato = dados.get("extract", "").strip()
    sinopse = _truncar_sinopse(extrato) if extrato else None

    imagem = dados.get("thumbnail", {}).get("source") or dados.get("originalimage", {}).get("source")

    return sinopse, imagem


def seed_database():
    app = create_app()
    with app.app_context():
        print("Recriando banco de dados SQLite...")
        db.drop_all()
        db.create_all()

        print("Limpando dados existentes...")
        db.session.query(Usuario).delete()
        db.session.query(Conteudo).delete()
        db.session.commit()

        print(f"Populando produções originais da plataforma ({len(TITULOS_SEED)} itens)...")
        for item in TITULOS_SEED:
            conteudo = Conteudo(
                titulo=item["titulo"],
                sinopse=item["sinopse"],
                classificacao_etaria=item["classificacao_etaria"],
                imagem_banner_url=item["imagem_banner_url"],
                is_original=True,
            )
            conteudo.generos = item["generos"]
            db.session.add(conteudo)

        print(f"Buscando catálogo de filmes reais via scraping da Wikipédia ({len(FILMES_REAIS_SEED)} itens)...")
        for indice, item in enumerate(FILMES_REAIS_SEED, start=1):
            print(f"  ({indice}/{len(FILMES_REAIS_SEED)}) {item['titulo']}")
            sinopse, imagem = buscar_dados_wikipedia(item["wiki_titulo"])

            conteudo = Conteudo(
                titulo=item["titulo"],
                sinopse=sinopse or f"Sinopse de \"{item['titulo']}\" indisponível no momento.",
                classificacao_etaria=item["classificacao_etaria"],
                imagem_banner_url=imagem or IMAGEM_FALLBACK,
                is_original=False,
            )
            conteudo.generos = item["generos"]
            db.session.add(conteudo)

            # Pausa curta entre requisições para não sobrecarregar a API pública da Wikipédia
            time.sleep(0.2)

        # Adiciona usuários de teste pré-configurados
        print("Criando usuários de teste...")

        # Usuário 1: Jovem (12 anos) que gosta de Animação, Fantasia e Sci-Fi
        jovem = Usuario(nome="Lucas Silva", username="lucas12", idade=12)
        jovem.set_password("123456")
        jovem.generos_favoritos = ["Animação", "Fantasia", "Sci-Fi", "Comédia"]
        db.session.add(jovem)

        # Usuário 2: Adulto (22 anos) que gosta de Ação, Terror e Crime
        adulto = Usuario(nome="Gabriela Santos", username="gabriela22", idade=22)
        adulto.set_password("123456")
        adulto.generos_favoritos = ["Ação", "Terror", "Crime", "Cyberpunk", "Suspense"]
        db.session.add(adulto)

        db.session.commit()
        total_conteudos = len(TITULOS_SEED) + len(FILMES_REAIS_SEED)
        print(f"Seed concluído com sucesso! ({total_conteudos} conteúdos no catálogo)")
        print("Usuários criados para teste:")
        print("  - Username: 'lucas12' | Senha: '123456' | Idade: 12 (Bloqueia filmes 14, 16 e 18)")
        print("  - Username: 'gabriela22' | Senha: '123456' | Idade: 22 (Acesso a todo o catálogo)")


if __name__ == "__main__":
    seed_database()
