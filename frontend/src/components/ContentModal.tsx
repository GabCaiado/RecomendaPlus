"use client";

import React from "react";
import { X, Play, Check, Lock, ShieldAlert, Star, Bookmark, Tv } from "lucide-react";
import { Conteudo } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface ContentModalProps {
  content: Conteudo | null;
  onClose: () => void;
  onToggleWatch: (content: Conteudo) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (content: Conteudo) => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({
  content,
  onClose,
  onToggleWatch,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const { user } = useAuth();
  if (!content) return null;

  const isRestricted = content.acesso_permitido === false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#11131f] rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Banner Header */}
        <div className="relative w-full h-64 md:h-72 bg-zinc-900 overflow-hidden shrink-0">
          <img
            src={content.imagem_banner_url}
            alt={content.titulo}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80";
            }}
            className={`w-full h-full object-cover ${isRestricted ? "grayscale opacity-40" : ""}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11131f] via-[#11131f]/60 to-transparent" />

          {/* Badges */}
          <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-md text-xs font-black tracking-wider uppercase border shadow-lg ${
                content.classificacao_etaria === "Livre"
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : content.classificacao_etaria === "18"
                  ? "bg-red-600 border-red-500 text-white"
                  : "bg-amber-600 border-amber-500 text-white"
              }`}
            >
              {content.classificacao_etaria === "Livre"
                ? "Classificação Livre"
                : `Faixa Etária: ${content.classificacao_etaria} Anos`}
            </span>

            {content.is_original && (
              <span className="px-3 py-1 rounded-md text-xs font-black tracking-wider uppercase bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg flex items-center gap-1.5 border border-purple-400/40">
                <Tv className="w-3.5 h-3.5" />
                Original Recomenda+
              </span>
            )}

            {content.ja_assistiu && (
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                No seu histórico
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              {content.titulo}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {content.generos.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/40"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#090a10] border border-zinc-800 rounded-2xl p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Sinopse do Conteúdo
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {content.sinopse}
            </p>
          </div>

          {/* Logical Rule Indicator / Age Warning */}
          {isRestricted ? (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800/60 flex items-start gap-3">
              <Lock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-300">
                  Acesso Restrito pelo Paradigma Lógico (Prolog)
                </p>
                <p className="text-xs text-rose-200/80 mt-1">
                  Sua idade cadastrada ({user ? `${user.idade} anos` : "não especificada"}) é inferior à classificação de {content.classificacao_etaria} anos exigida para este conteúdo.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-300">
                  Conteúdo Autorizado
                </p>
                <p className="text-xs text-emerald-200/80 mt-1">
                  Sua faixa etária permite assistir a este filme sem restrições.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!isRestricted && (
              <button
                onClick={() => {
                  onToggleWatch(content);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  content.ja_assistiu
                    ? "bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    : "primary-btn-gradient text-white shadow-xl hover:opacity-95"
                }`}
              >
                {content.ja_assistiu ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Marcado como Assistido
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    Assistir Agora & Marcar
                  </>
                )}
              </button>
            )}

            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(content)}
                className={`flex items-center justify-center gap-2 py-3 px-5 rounded-full text-xs sm:text-sm font-bold border transition-all ${
                  isBookmarked
                    ? "bg-pink-950/80 border-pink-600 text-pink-300"
                    : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-pink-400 text-pink-400" : ""}`} />
                {isBookmarked ? "Na Minha Lista" : "Salvar na Minha Lista"}
              </button>
            )}

            <button
              onClick={onClose}
              className="py-3 px-6 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs sm:text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

