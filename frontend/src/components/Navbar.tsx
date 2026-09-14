"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  User,
  LogOut,
  ShieldAlert,
  LogIn,
  Bell,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
  genres: string[];
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreSelect,
  genres,
}) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const fallbackGenres = [
    "Animação",
    "Aventura",
    "Ação",
    "Comédia",
    "Crime",
    "Cyberpunk",
    "Documentário",
    "Drama",
    "Esporte",
    "Fantasia",
    "Histórico",
    "Música",
    "Romance",
    "Sci-Fi",
  ];

  const displayGenres = genres.length > 0 ? genres : fallbackGenres;

  return (
    <header className="w-full flex flex-col gap-4 pt-4 pb-2 z-20">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar filmes, séries, gêneros..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-12 py-2.5 bg-[#121422] border border-zinc-800/80 rounded-2xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-inner"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3.5 text-xs text-zinc-400 hover:text-white"
              >
                Limpar
              </button>
            ) : (
              <kbd className="hidden sm:flex items-center gap-0.5 absolute right-3.5 px-2 py-0.5 bg-zinc-800/80 border border-zinc-700/60 rounded text-[10px] text-zinc-400 font-mono">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Bell Icon Notification Badge */}
          <button className="relative p-2.5 rounded-xl bg-[#121422] border border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/80" />
          </button>

          {/* User Profile or Entrar/Cadastrar Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#121422] border border-zinc-800 hover:border-purple-500/50 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-md">
                  {user.nome ? user.nome.charAt(0) : "U"}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-zinc-200 truncate max-w-[120px]">
                    {user.nome}
                  </span>
                  <span className="text-[10px] text-purple-400 font-medium">
                    {user.idade} anos
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 glass-header bg-[#121424] border border-zinc-800 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <div className="pb-3 mb-3 border-b border-zinc-800">
                    <p className="text-sm font-bold text-white">{user.nome}</p>
                    <p className="text-xs text-zinc-400">@{user.username}</p>
                    <div className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/40 text-[11px] text-purple-300">
                      <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                      <span>Classificação: Até {user.idade} anos</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-600 hover:text-white transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sair da Conta
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full primary-btn-gradient text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              Entrar / Cadastrar
            </Link>
          )}
        </div>
      </div>

      {/* Genre Filter Pills Bar */}
      <div className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => onGenreSelect("Todos")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedGenre === "Todos"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
              : "bg-[#121422] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800/80"
          }`}
        >
          Todos os Gêneros
        </button>

        {displayGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => onGenreSelect(genre)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedGenre === genre
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-[#121422] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800/80"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </header>
  );
};

