"use client";

import React from "react";
import { Play, Check, Lock, Bookmark, Tv } from "lucide-react";
import { Conteudo } from "@/types";

interface ContentCardProps {
  content: Conteudo;
  onOpenDetails: (content: Conteudo) => void;
  onToggleWatch: (content: Conteudo) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (content: Conteudo) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onOpenDetails,
  onToggleWatch,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const isRestricted = content.acesso_permitido === false;

  const getAgeBadgeStyle = (rating: string) => {
    switch (rating) {
      case "Livre":
        return "bg-emerald-600 text-white font-black";
      case "10":
        return "bg-amber-500 text-black font-black";
      case "12":
        return "bg-amber-600 text-white font-black";
      case "14":
        return "bg-orange-600 text-white font-black";
      case "16":
        return "bg-rose-600 text-white font-black";
      case "18":
        return "bg-red-700 text-white font-black";
      default:
        return "bg-purple-600 text-white font-black";
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(content)}
      className="group relative cursor-pointer rounded-2xl overflow-hidden bg-[#11131f] border border-zinc-800/80 flex flex-col transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-900/30 hover:border-purple-500/50"
    >
      {/* 2:3 Vertical Movie Poster Image Container */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-zinc-900">
        <img
          src={content.imagem_banner_url}
          alt={content.titulo}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80";
          }}
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
            isRestricted ? "opacity-30 grayscale" : ""
          }`}
        />

        {/* Poster Bottom Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11131f] via-transparent to-transparent opacity-90" />

        {/* Age Rating Tag & Original Tag Floating Top-Left */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider shadow-md ${getAgeBadgeStyle(
              content.classificacao_etaria
            )}`}
          >
            {content.classificacao_etaria === "Livre"
              ? "LIVRE"
              : `${content.classificacao_etaria}+`}
          </span>

          {content.is_original && (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md flex items-center gap-1">
              <Tv className="w-2.5 h-2.5" />
              ORIGINAL
            </span>
          )}
        </div>

        {/* Watched & Bookmark Badges Floating Top-Right */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
          {content.ja_assistiu && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600/90 text-white flex items-center gap-1 shadow-md">
              <Check className="w-3 h-3" />
            </span>
          )}

          {onToggleBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(content);
              }}
              title={isBookmarked ? "Remover da Minha Lista" : "Salvar na Minha Lista"}
              className={`p-1.5 rounded-md backdrop-blur-md transition-all shadow-md ${
                isBookmarked
                  ? "bg-pink-600 text-white"
                  : "bg-black/60 text-zinc-300 hover:text-white hover:bg-black/90"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-white" : ""}`} />
            </button>
          )}
        </div>

        {/* Locked Overlay for Age Restriction */}
        {isRestricted && (
          <div className="absolute inset-0 z-20 bg-zinc-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center">
            <Lock className="w-7 h-7 text-rose-500 mb-1.5 animate-bounce" />
            <p className="text-[11px] font-bold text-rose-300 uppercase tracking-wider">
              Bloqueado por Idade
            </p>
            <p className="text-[9px] text-zinc-400 mt-1 max-w-[130px]">
              Requer {content.classificacao_etaria} anos
            </p>
          </div>
        )}

        {/* Quick Play Hover Button Overlay */}
        {!isRestricted && (
          <div className="absolute inset-0 z-10 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(content);
              }}
              className="w-10 h-10 rounded-full primary-btn-gradient text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              title="Assistir agora"
            >
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </button>
          </div>
        )}
      </div>

      {/* Card Metadata Section Below Poster */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-[#11131f]">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-100 line-clamp-1 group-hover:text-purple-300 transition-colors">
            {content.titulo}
          </h3>

          {/* Genre Pills */}
          <div className="flex flex-wrap items-center gap-1 mt-1.5 mb-2">
            {content.generos.slice(0, 2).map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800"
              >
                {g}
              </span>
            ))}
            {content.generos.length > 2 && (
              <span className="text-[9px] text-zinc-500 font-bold">
                +{content.generos.length - 2}
              </span>
            )}
          </div>

          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-snug">
            {content.sinopse}
          </p>
        </div>
      </div>
    </div>
  );
};

