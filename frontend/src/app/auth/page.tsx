"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Film,
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const GENRES_DISPONIVEIS = [
  "Ação",
  "Animação",
  "Aventura",
  "Comédia",
  "Crime",
  "Cyberpunk",
  "Documentário",
  "Drama",
  "Esporte",
  "Fantasia",
  "Música",
  "Romance",
  "Sci-Fi",
  "Suspense",
  "Terror",
];

export default function AuthPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Login form state
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Register form state
  const [regNome, setRegNome] = useState<string>("");
  const [regUsername, setRegUsername] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regIdade, setRegIdade] = useState<number | "">(20);
  const [selectedGeneros, setSelectedGeneros] = useState<string[]>([
    "Ação",
    "Sci-Fi",
  ]);

  // Handle redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const toggleGenre = (genre: string) => {
    if (selectedGeneros.includes(genre)) {
      setSelectedGeneros(selectedGeneros.filter((g) => g !== genre));
    } else {
      setSelectedGeneros([...selectedGeneros, genre]);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setErrorMsg("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await login(loginUsername.trim(), loginPassword);
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "Falha ao realizar login.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!regNome.trim() || !regUsername.trim() || !regPassword.trim() || regIdade === "") {
      setErrorMsg("Preencha todos os campos obrigatórios.");
      return;
    }

    if (regPassword.length < 4) {
      setErrorMsg("A senha deve possuir pelo menos 4 caracteres.");
      return;
    }

    const ageNum = Number(regIdade);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
      setErrorMsg("Informe uma idade válida (entre 0 e 120 anos).");
      return;
    }

    setLoading(true);
    try {
      await register(
        regNome.trim(),
        regUsername.trim(),
        regPassword,
        ageNum,
        selectedGeneros
      );
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "Falha ao realizar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-zinc-950 via-purple-950/20 to-zinc-950 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link href="/" className="flex items-center gap-2 group mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Film className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">
            RECOMENDA+ STREAMING
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Entre na sua conta ou crie um novo perfil seguro
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex rounded-2xl bg-zinc-900/90 p-1 mb-6 border border-zinc-800">
          <button
            onClick={() => {
              setIsLoginTab(true);
              setErrorMsg("");
            }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-all ${isLoginTab
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/40"
                : "text-zinc-400 hover:text-zinc-200"
              }`}
          >
            Entrar
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setErrorMsg("");
            }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-all ${!isLoginTab
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/40"
                : "text-zinc-400 hover:text-zinc-200"
              }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/60 border border-rose-800/60 flex items-center gap-2 text-rose-300 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {isLoginTab ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Nome de Usuário (Username)
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="ex: lucas12 ou gabriela22"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha secreta"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-zinc-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 text-white font-bold text-sm shadow-xl shadow-purple-600/30 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Autenticando..."
              ) : (
                <>
                  Entrar no Catálogo <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Nome Completo
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                value={regNome}
                onChange={(e) => setRegNome(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="ex: lucas_s"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Sua Idade
                </label>
                <input
                  type="number"
                  placeholder="ex: 18"
                  min={0}
                  max={120}
                  value={regIdade}
                  onChange={(e) => setRegIdade(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Criar Senha
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 4 caracteres"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-zinc-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Favorite Genres Selector for Functional Recommendation Engine */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Escolha seus Gêneros Favoritos (para IA Recomendadora)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-zinc-900/60 rounded-xl border border-zinc-800">
                {GENRES_DISPONIVEIS.map((g) => {
                  const selected = selectedGeneros.includes(g);
                  return (
                    <button
                      type="button"
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${selected
                          ? "bg-purple-600 text-white shadow-sm"
                          : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700"
                        }`}
                    >
                      {selected && <Check className="w-3 h-3" />}
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 text-white font-bold text-sm shadow-xl shadow-purple-600/30 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Criando Conta..."
              ) : (
                <>
                  Concluir Cadastro & Acessar <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
