"use client";

import React from "react";
import { Play, Check, Star, Sparkles, Bookmark, Tv } from "lucide-react";
import { Conteudo } from "@/types";

interface HeroBannerProps {
  content: Conteudo | null;
  onOpenDetails: (content: Conteudo) => void;
  onToggleWatch: (content: Conteudo) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (content: Conteudo) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  content,
  onOpenDetails,
  onToggleWatch,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  if (!content) return null;

  return (
    <div className="relative w-full h-[440px] md:h-[480px] rounded-3xl overflow-hidden bg-[#0e101a] border border-zinc-800/80 shadow-2xl group my-2">
      {/* Background Poster Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={content.imagem_banner_url}
          alt={content.titulo}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80";
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Cinematic Linear & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a10] via-[#090a10]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090a10] via-[#090a10]/90 to-transparent max-w-3xl" />
      </div>

      {/* Hero Content Area */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-10 max-w-2xl z-10">
        {/* Badges Top Line */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-md text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            DESTAQUE DO CATÁLOGO
          </span>

          {content.is_original && (
            <span className="px-3 py-1 rounded-md text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md flex items-center gap-1">
              <Tv className="w-3 h-3" />
              ORIGINAL RECOMENDA+
            </span>
          )}

          <span
            className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase ${
              content.classificacao_etaria === "Livre"
                ? "bg-emerald-600/90 text-white"
                : content.classificacao_etaria === "18"
                ? "bg-red-600/90 text-white"
                : "bg-amber-600/90 text-white"
            }`}
          >
            {content.classificacao_etaria === "Livre"
              ? "LIVRE"
              : `${content.classificacao_etaria}+`}
          </span>

          <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-zinc-400 bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm">
            4K Ultra HD • 2024
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-lg">
          {content.titulo}
        </h1>

        {/* Metadata Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-300 mb-3">
          {content.generos.map((g, i) => (
            <span
              key={g}
              className="px-2.5 py-0.5 rounded-full bg-zinc-900/80 text-zinc-300 border border-zinc-700/60"
            >
              {g}
            </span>
          ))}
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-300">2h 18min</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-300">Áudio 5.1</span>
        </div>

        {/* Synopsis */}
        <p className="text-zinc-300 text-xs sm:text-sm line-clamp-3 mb-6 leading-relaxed max-w-xl">
          {content.sinopse}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenDetails(content)}
            className="flex items-center gap-2 px-6 py-3 rounded-full primary-btn-gradient text-white font-bold text-xs sm:text-sm transition-transform hover:scale-105"
          >
            <Play className="w-4 h-4 fill-white" />
            Ver Detalhes / Assistir
          </button>

          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(content)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs sm:text-sm border transition-all ${
                isBookmarked
                  ? "bg-pink-950/80 border-pink-500/80 text-pink-300"
                  : "bg-zinc-900/80 border-zinc-700/80 text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-pink-400 text-pink-400" : ""}`} />
              {isBookmarked ? "Na Minha Lista" : "Minha Lista"}
            </button>
          )}

          <button
            onClick={() => onToggleWatch(content)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs sm:text-sm border transition-all ${
              content.ja_assistiu
                ? "bg-emerald-950/80 border-emerald-500/80 text-emerald-300"
                : "bg-zinc-900/80 border-zinc-700/80 text-zinc-200 hover:bg-zinc-800"
            }`}
          >
            <Check className="w-4 h-4" />
            {content.ja_assistiu ? "Já Assistido" : "Marcar como Assistido"}
          </button>
        </div>
      </div>
    </div>
  );
};

