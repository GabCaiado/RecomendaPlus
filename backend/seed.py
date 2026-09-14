import os
import sys

# Adiciona o diretório raiz do backend ao sys.path para garantir importação dos pacotes do app
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import create_app
from app.extensions import db
from app.models.content import Conteudo
from app.models.user import Usuario

TITULOS_SEED = [
    {
        "titulo": "O Reino de Eldoria",
        "sinopse": "Um jovem camponês descobre ser o último guardião dos dragões em uma terra dominada pela magia negra.",
        "generos": ["Fantasia", "Aventura", "Ação"],
        "classificacao_etaria": "Livre",
        "imagem_banner_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        "is_original": True
    },
    {
        "titulo": "A Turma da Floresta Secreta",
        "sinopse": "Animação encantadora sobre três pequenos animais que saem em busca de um tesouro escondido para salvar o seu lar.",
        "generos": ["Animação", "Comédia", "Família"],
        "classificacao_etaria": "Livre",
        "imagem_banner_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
        "is_original": True
    },
    {
        "titulo": "As Crônicas da Galáxia",
        "sinopse": "Exploradores espaciais viajam por buracos de minhoca em busca de um novo planeta habitável para a humanidade.",
        "generos": ["Sci-Fi", "Aventura"],
        "classificacao_etaria": "10",
        "imagem_banner_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "is_original": True
    },
    {
        "titulo": "Goleadores da Várzea",
        "sinopse": "Comédia divertida acompanhando um time amador de futebol disputando a grande final do campeonato do bairro.",
        "generos": ["Comédia", "Esporte"],
        "classificacao_etaria": "10",
        "imagem_banner_url": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80"
    },
    {
        "titulo": "A Lenda do Samurai Imortal",
        "sinopse": "No Japão feudal, um guerreiro renegado busca redenção enquanto protege um jovem prodígio das forças imperiais.",
        "generos": ["Ação", "Drama", "Histórico"],
        "classificacao_etaria": "12",
        "imagem_banner_url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80"
    },
    {
        "titulo": "Mistérios em Neblina Alta",
        "sinopse": "Um grupo de adolescentes investiga o desaparecimento intrigante de seu professor de ciências durante as férias.",
        "generos": ["Suspense", "Aventura", "Drama"],
        "classificacao_etaria": "12",
        "imagem_banner_url": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80"
    },
    {
        "titulo": "Código Cyberpunk 2099",
        "sinopse": "Em uma megalópole tomada por luzes neon e mega-corporações, uma hacker tenta expor uma conspiração global.",
        "generos": ["Sci-Fi", "Ação", "Cyberpunk"],
        "classificacao_etaria": "14",
        "imagem_banner_url": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80",
        "is_original": True
    },
    {
        "titulo": "Bastidores do Jazz",
        "sinopse": "Documentário tocante sobre a vida e a jornada de músicos lendários na era de ouro de Nova Orleans.",
        "generos": ["Documentário", "Música"],
        "classificacao_etaria": "14",
        "imagem_banner_url": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80"
    },
    {
        "titulo": "Cartas ao Entardecer",
        "sinopse": "Dois amantes separados pela guerra trocam cartas ao longo de duas décadas enquanto tentam se reencontrar.",
        "generos": ["Romance", "Drama"],
        "classificacao_etaria": "14",
        "imagem_banner_url": "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=800&q=80"
    },
    {
        "titulo": "A Hora das Sombras",
        "sinopse": "Pesquisadores sobem uma montanha isolada e descobrem uma força sobrenatural antiga que se alimenta do medo.",
        "generos": ["Terror", "Suspense"],
        "classificacao_etaria": "16",
        "imagem_banner_url": "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80"
    },
    {
        "titulo": "Cartel da Capital",
        "sinopse": "Série dramática visceral que explora as alianças secretas e a luta pelo poder no submundo do crime organizado.",
        "generos": ["Crime", "Drama", "Ação"],
        "classificacao_etaria": "16",
        "imagem_banner_url": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
        "is_original": True
    },
    {
        "titulo": "Protocolo Vermelho",
        "sinopse": "Um agente aposentado precisa realizar uma última missão suicida para salvar a sua família sequestrada.",
        "generos": ["Ação", "Suspense"],
        "classificacao_etaria": "16",
        "imagem_banner_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
    },
    {
        "titulo": "Noite Profunda",
        "sinopse": "Thriller psicológico perturbador centrado em um detetive que investiga crimes ritualísticos na metrópole.",
        "generos": ["Terror", "Crime", "Suspense"],
        "classificacao_etaria": "18",
        "imagem_banner_url": "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80"
    },
    {
        "titulo": "Subsolo: Guerra Sem Fim",
        "sinopse": "Em um futuro pós-apocalíptico desolado, sobreviventes duelam em arenas clandestinas sob as ruínas da civilização.",
        "generos": ["Ação", "Sci-Fi", "Drama"],
        "classificacao_etaria": "18",
        "imagem_banner_url": "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=800&q=80",
        "is_original": True
    },
    {
        "titulo": "Revolução dos Máquinas",
        "sinopse": "A inteligência artificial assume o controle dos sistemas de defesa mundial e um grupo de rebeldes tenta desligar o núcleo.",
        "generos": ["Sci-Fi", "Ação"],
        "classificacao_etaria": "14",
        "imagem_banner_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    },
    {
        "titulo": "Viagem ao Centro do Oceano",
        "sinopse": "Biólogos marinhos encontram uma espécie inteligente habitando as fossas abissais do Pacífico.",
        "generos": ["Documentário", "Aventura", "Sci-Fi"],
        "classificacao_etaria": "Livre",
        "imagem_banner_url": "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80"
    },
    {
        "titulo": "Stand-up: Rindo Sem Limites",
        "sinopse": "Especial de comédia imperdível reunindo os maiores nomes do humor da atualidade em um show ao vivo.",
        "generos": ["Comédia"],
        "classificacao_etaria": "16",
        "imagem_banner_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
    },
    {
        "titulo": "A Última Melodia",
        "sinopse": "Dramaturgo aposentado compõe a sua obra-prima enquanto reconcilia laços familiares quebrados.",
        "generos": ["Drama", "Música"],
        "classificacao_etaria": "12",
        "imagem_banner_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
    }
]

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

        print("Populando catálogo de conteúdos (18 itens)...")
        for item in TITULOS_SEED:
            conteudo = Conteudo(
                titulo=item["titulo"],
                sinopse=item["sinopse"],
                classificacao_etaria=item["classificacao_etaria"],
                imagem_banner_url=item["imagem_banner_url"],
                is_original=item.get("is_original", False)
            )
            conteudo.generos = item["generos"]
            db.session.add(conteudo)

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
        print("Seed concluído com sucesso!")
        print("Usuários criados para teste:")
        print("  - Username: 'lucas12' | Senha: '123456' | Idade: 12 (Bloqueia filmes 14, 16 e 18)")
        print("  - Username: 'gabriela22' | Senha: '123456' | Idade: 22 (Acesso a todo o catálogo)")

if __name__ == "__main__":
    seed_database()
