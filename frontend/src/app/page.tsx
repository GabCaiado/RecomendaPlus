"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar, TabType } from "@/components/Sidebar";
import { HeroBanner } from "@/components/HeroBanner";
import { ContentGrid } from "@/components/ContentGrid";
import { ContentModal } from "@/components/ContentModal";
import { Footer } from "@/components/Footer";
import { Conteudo } from "@/types";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Film, CheckCircle2, ShieldAlert, Cpu, Code2, Database, ThumbsUp, Bookmark, Tv } from "lucide-react";

export default function Home() {
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [catalogo, setCatalogo] = useState<Conteudo[]>([]);
  const [recomendacoes, setRecomendacoes] = useState<Conteudo[]>([]);
  const [historico, setHistorico] = useState<Conteudo[]>([]);
  const [myListIds, setMyListIds] = useState<number[]>([]);
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Filters & Tabs state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("Todos");
  const [activeTab, setActiveTab] = useState<TabType>("home");

  // Selected Content Modal
  const [selectedContentModal, setSelectedContentModal] = useState<Conteudo | null>(null);

  // Minha Lista is scoped per logged-in user (or "guest") so it never leaks between profiles
  const myListStorageKey = `recomenda_my_list_ids_${user ? user.id : "guest"}`;

  // Load saved Minha Lista from localStorage whenever the logged-in user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(myListStorageKey);
      setMyListIds(saved ? JSON.parse(saved) : []);
    } catch (e) {
      console.error("Erro ao carregar Minha Lista do localStorage:", e);
      setMyListIds([]);
    }
  }, [myListStorageKey]);

  // Handle Toggle Bookmark
  const handleToggleBookmark = (content: Conteudo) => {
    if (!user) {
      alert("Por favor, faça login para salvar sua Minha Lista!");
      return;
    }

    setMyListIds((prev) => {
      const exists = prev.includes(content.id);
      const updated = exists
        ? prev.filter((id) => id !== content.id)
        : [...prev, content.id];
      try {
        localStorage.setItem(myListStorageKey, JSON.stringify(updated));
      } catch (e) {
        console.error("Erro ao salvar Minha Lista no localStorage:", e);
      }
      return updated;
    });
  };

  // Fetch catalog & recommendations
  const fetchData = async () => {
    setLoadingContent(true);
    setError("");
    try {
      // 1. Fetch full catalog
      const items = await api.getConteudo();
      setCatalogo(items);

      // 2. If user is logged in, fetch functional recommendations & history
      if (localStorage.getItem("access_token")) {
        try {
          const recRes = await api.getRecomendacoes();
          setRecomendacoes(recRes.recomendacoes);
        } catch (e) {
          console.log("Recomendações não disponíveis para convidado.");
        }

        try {
          const hist = await api.getHistorico();
          setHistorico(hist);
        } catch (e) {
          console.log("Histórico não carregado.");
        }
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados do catálogo:", err);
      setError("Não foi possível conectar ao backend. Verifique se o servidor está ativo.");
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Handle Mark as Watched
  const handleToggleWatch = async (content: Conteudo) => {
    if (!user) {
      alert("Por favor, faça login para salvar seu histórico de conteúdos assistidos!");
      return;
    }

    try {
      const response = await api.marcarComoAssistido(content.id);
      alert(response.mensagem);

      // Re-fetch data and refresh user context
      await refreshUser();
      await fetchData();

      // Update modal if open
      if (selectedContentModal && selectedContentModal.id === content.id) {
        setSelectedContentModal({ ...selectedContentModal, ja_assistiu: true });
      }
    } catch (err: any) {
      alert(err.message || "Erro ao marcar como assistido.");
    }
  };

  // Unique genre list extraction
  const allGenres = Array.from(
    new Set(catalogo.flatMap((c) => c.generos))
  ).sort();

  // Filter content based on Search and Selected Genre
  const filterList = (list: Conteudo[]) => {
    return list.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sinopse.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.generos.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGenre =
        selectedGenre === "Todos" || item.generos.includes(selectedGenre);

      return matchesSearch && matchesGenre;
    });
  };

  const filteredCatalogo = filterList(catalogo);
  const filteredRecomendacoes = filterList(recomendacoes);
  const filteredHistorico = filterList(historico);

  // Originais list
  const originaisList = catalogo.filter(
    (c) =>
      c.is_original ||
      ["Eldoria", "Cyberpunk", "Galáxia", "Subsolo", "Floresta", "Cartel"].some((k) =>
        c.titulo.includes(k)
      )
  );
  const filteredOriginais = filterList(originaisList);

  // Minha Lista contents
  const myListContents = catalogo.filter((c) => myListIds.includes(c.id));
  const filteredMyList = filterList(myListContents);

  // Hero featured content (Defaults to "O Reino de Eldoria" or first item)
  const heroContent =
    catalogo.find((c) => c.titulo.includes("Eldoria")) ||
    (recomendacoes.length > 0 ? recomendacoes[0] : catalogo.length > 0 ? catalogo[0] : null);

  return (
    <div className="min-h-screen flex bg-[#090a10] text-zinc-100 font-sans antialiased">
      {/* Fixed Left Sidebar matching Image 2 */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        watchedCount={historico.length}
        myListCount={myListIds.length}
      />

      {/* Main Workspace Area (Right side) */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-4 flex flex-col justify-between max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          {/* Top Navbar: Search + Genre Filter pills */}
          <Navbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedGenre={selectedGenre}
            onGenreSelect={setSelectedGenre}
            genres={allGenres}
          />

          {/* Backend Error Notification */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button
                onClick={fetchData}
                className="px-3 py-1 bg-rose-800 rounded-lg text-xs text-white hover:bg-rose-700"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Content Loading Skeleton */}
          {loadingContent ? (
            <div className="w-full flex flex-col gap-6 my-4">
              <div className="w-full h-96 rounded-3xl bg-[#11131f] animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="aspect-[2/3] rounded-2xl bg-[#11131f] animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: HOME */}
              {activeTab === "home" && (
                <>
                  {/* Hero Featured Banner */}
                  {searchQuery === "" && selectedGenre === "Todos" && (
                    <HeroBanner
                      content={heroContent}
                      onOpenDetails={setSelectedContentModal}
                      onToggleWatch={handleToggleWatch}
                      isBookmarked={heroContent ? myListIds.includes(heroContent.id) : false}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  )}

                  {/* Recommendations Row (For logged in users) */}
                  {user && filteredRecomendacoes.length > 0 && (
                    <ContentGrid
                      title="Recomendados para Você"
                      subtitle="Análise funcional pura baseada nos seus gêneros favoritos e idade."
                      icon="thumbsUp"
                      contents={filteredRecomendacoes}
                      onOpenDetails={setSelectedContentModal}
                      onToggleWatch={handleToggleWatch}
                      myListIds={myListIds}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  )}

                  {/* Main Catalog Grid */}
                  <ContentGrid
                    title="Catálogo Geral"
                    subtitle="Explore todas as produções disponíveis com sinalização de classificação etária."
                    icon="film"
                    contents={filteredCatalogo}
                    onOpenDetails={setSelectedContentModal}
                    onToggleWatch={handleToggleWatch}
                    myListIds={myListIds}
                    onToggleBookmark={handleToggleBookmark}
                  />
                </>
              )}

              {/* TAB 2: RECOMENDADOS */}
              {activeTab === "recomendados" && (
                <div className="flex flex-col gap-4 my-4">
                  {!user ? (
                    <div className="p-8 rounded-3xl bg-[#11131f] border border-zinc-800 text-center flex flex-col items-center gap-3">
                      <ThumbsUp className="w-10 h-10 text-purple-400" />
                      <h3 className="text-xl font-bold text-white">
                        Recomendações Personalizadas
                      </h3>
                      <p className="text-xs text-zinc-400 max-w-md">
                        Faça login para que nosso motor funcional calcule as melhores sugestões baseadas no seu perfil e idade!
                      </p>
                      <a
                        href="/auth"
                        className="mt-2 px-6 py-2.5 rounded-full primary-btn-gradient text-white font-bold text-xs"
                      >
                        Entrar ou Cadastrar
                      </a>
                    </div>
                  ) : (
                    <ContentGrid
                      title="Recomendações Personalizadas"
                      subtitle={`Algoritmo Funcional configurado para os gêneros: ${user.generos_favoritos.join(", ")}`}
                      icon="thumbsUp"
                      contents={filteredRecomendacoes}
                      onOpenDetails={setSelectedContentModal}
                      onToggleWatch={handleToggleWatch}
                      myListIds={myListIds}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  )}
                </div>
              )}

              {/* TAB 3: CATÁLOGO COMPLETO */}
              {activeTab === "catalogo" && (
                <ContentGrid
                  title="Todos os Filmes & Séries"
                  subtitle="Lista completa de títulos cadastrados no banco relacional."
                  icon="film"
                  contents={filteredCatalogo}
                  onOpenDetails={setSelectedContentModal}
                  onToggleWatch={handleToggleWatch}
                  myListIds={myListIds}
                  onToggleBookmark={handleToggleBookmark}
                />
              )}

              {/* TAB 4: ORIGINAIS RECOMENDA+ */}
              {activeTab === "originais" && (
                <ContentGrid
                  title="Originais Recomenda+"
                  subtitle="Produções exclusivas criadas e desenvolvidas com alta qualidade para nossa plataforma."
                  icon="tv"
                  badge="Exclusivo"
                  contents={filteredOriginais}
                  onOpenDetails={setSelectedContentModal}
                  onToggleWatch={handleToggleWatch}
                  myListIds={myListIds}
                  onToggleBookmark={handleToggleBookmark}
                />
              )}

              {/* TAB 5: MINHA LISTA */}
              {activeTab === "minha-lista" && (
                <div className="flex flex-col gap-4 my-4">
                  {filteredMyList.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-[#11131f] border border-zinc-800 text-center flex flex-col items-center gap-3">
                      <Bookmark className="w-10 h-10 text-pink-400" />
                      <h3 className="text-xl font-bold text-white">
                        Sua Minha Lista está vazia
                      </h3>
                      <p className="text-xs text-zinc-400 max-w-md">
                        Explore o catálogo e clique no ícone de marcador (bookmark) em qualquer filme ou série para salvar e assistir mais tarde!
                      </p>
                      <button
                        onClick={() => setActiveTab("catalogo")}
                        className="mt-2 px-6 py-2.5 rounded-full primary-btn-gradient text-white font-bold text-xs"
                      >
                        Explorar Catálogo
                      </button>
                    </div>
                  ) : (
                    <ContentGrid
                      title="Minha Lista de Favoritos"
                      subtitle="Seus títulos salvos para assistir a qualquer momento."
                      icon="bookmark"
                      contents={filteredMyList}
                      onOpenDetails={setSelectedContentModal}
                      onToggleWatch={handleToggleWatch}
                      myListIds={myListIds}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  )}
                </div>
              )}

              {/* TAB 6: MEU HISTÓRICO */}
              {activeTab === "historico" && (
                <div className="flex flex-col gap-4 my-4">
                  {!user ? (
                    <div className="p-8 rounded-3xl bg-[#11131f] border border-zinc-800 text-center">
                      <p className="text-zinc-400 text-xs">
                        Faça login para visualizar seu histórico de assistidos.
                      </p>
                    </div>
                  ) : (
                    <ContentGrid
                      title="Meu Histórico de Assistidos"
                      subtitle="Títulos que você já marcou como assistidos (Procedimento Imperativo)."
                      icon="check"
                      contents={filteredHistorico}
                      onOpenDetails={setSelectedContentModal}
                      onToggleWatch={handleToggleWatch}
                      myListIds={myListIds}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  )}
                </div>
              )}

              {/* TAB 7: PARADIGMAS */}
              {activeTab === "paradigmas" && (
                <div className="flex flex-col gap-6 p-6 rounded-3xl bg-[#11131f] border border-zinc-800/80 my-4">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                    <Cpu className="w-8 h-8 text-purple-400" />
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Arquitetura Multiparadigma
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Como os quatro paradigmas de programação foram implementados no projeto
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#090a10] border border-zinc-800 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                        <Code2 className="w-4 h-4" /> 1. Orientado a Objetos (POO)
                      </div>
                      <p className="text-xs text-zinc-300">
                        Entidades <code className="text-purple-300">Usuario</code> e <code className="text-purple-300">Conteudo</code> encapsulam estado, regras Werkzeug hash e relacionamentos.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090a10] border border-zinc-800 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                        <Sparkles className="w-4 h-4" /> 2. Paradigma Funcional
                      </div>
                      <p className="text-xs text-zinc-300">
                        Invocado em <code className="text-pink-300">app/services/recommendation.py</code> com a função pura <code className="text-pink-300">obter_recomendacoes</code> sem efeitos colaterais.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090a10] border border-zinc-800 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                        <ShieldAlert className="w-4 h-4" /> 3. Paradigma Lógico
                      </div>
                      <p className="text-xs text-zinc-300">
                        Expressado em <code className="text-rose-300">app/services/access_rules.py</code> via inferência Prolog <code className="text-rose-300">inferir_permissao_acesso</code>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090a10] border border-zinc-800 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <Database className="w-4 h-4" /> 4. Paradigma Imperativo
                      </div>
                      <p className="text-xs text-zinc-300">
                        Executado na rota <code className="text-emerald-300">/api/conteudo/id/assistir</code> com controle sequencial explícito e transação em SQLite.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Section */}
        <Footer />
      </main>

      {/* Content Details Modal Dialog */}
      <ContentModal
        content={selectedContentModal}
        onClose={() => setSelectedContentModal(null)}
        onToggleWatch={handleToggleWatch}
        isBookmarked={selectedContentModal ? myListIds.includes(selectedContentModal.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />
    </div>
  );
}
