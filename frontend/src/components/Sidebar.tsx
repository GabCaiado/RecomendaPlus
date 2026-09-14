"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  ThumbsUp,
  Grid,
  Clock,
  Code2,
  TrendingUp,
  Tv,
  Bookmark,
  User,
  LogIn,
  LogOut,
  Film,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export type TabType =
  | "home"
  | "recomendados"
  | "catalogo"
  | "historico"
  | "paradigmas"
  | "minha-lista"
  | "originais";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  watchedCount: number;
  myListCount?: number;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  count?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  watchedCount,
  myListCount = 0,
}) => {
  const { user, logout } = useAuth();

  const primaryNav: NavItem[] = [
    { id: "home", label: "Início", icon: Home },
    {
      id: "recomendados",
      label: "Recomendados",
      icon: ThumbsUp,
    },
    { id: "catalogo", label: "Catálogo Completo", icon: Grid },
    {
      id: "historico",
      label: "Meu Histórico",
      icon: Clock,
      count: watchedCount,
    },
    { id: "paradigmas", label: "Paradigmas Code", icon: Code2 },
  ];

  const collectionsNav: NavItem[] = [
    {
      id: "originais",
      label: "Originais Recomenda+",
      icon: Tv,
    },
    {
      id: "minha-lista",
      label: "Minha Lista",
      icon: Bookmark,
      count: myListCount,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col bg-[#0c0d16] border-r border-zinc-800/60 h-screen sticky top-0 px-4 py-6 z-30 justify-between">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform duration-300">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider text-white">
              RECOMENDA+
            </span>
            <span className="text-[10px] tracking-widest uppercase text-purple-400 font-bold -mt-1">
              STREAMING
            </span>
          </div>
        </Link>

        <div className="h-px w-full bg-zinc-800/80" />

        {/* NAVEGAÇÃO PRINCIPAL */}
        <div className="flex flex-col gap-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
            Navegação Principal
          </p>

          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? "active-nav-pill text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-zinc-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-950 text-purple-300 border border-purple-800/40">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* COLEÇÕES & LISTAS */}
        <div className="flex flex-col gap-1.5 pt-2">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
            Coleções & Listas
          </p>

          {collectionsNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? "active-nav-pill text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-zinc-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-950 text-pink-300 border border-pink-800/40">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Status Card at bottom of Sidebar */}
      <div className="mt-auto pt-4">
        <div className="p-3.5 rounded-2xl bg-[#12131e] border border-zinc-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-purple-900/50 border border-purple-600/40 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-purple-300" />
            </div>
            <div className="flex flex-col overflow-hidden text-left">
              <span className="text-xs font-bold text-zinc-200 truncate">
                {user ? user.nome : "Visitante Anônimo"}
              </span>
              <span className="text-[10px] text-zinc-400 truncate">
                {user ? `${user.idade} anos` : "Faça login para salvar"}
              </span>
            </div>
          </div>

          {user ? (
            <button
              onClick={logout}
              title="Sair"
              className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 hover:bg-rose-900/60 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/auth"
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white font-medium text-xs transition-all shrink-0"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};

