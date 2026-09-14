"use client";

import React from "react";
import { ContentCard } from "./ContentCard";
import { Conteudo } from "@/types";
import { Sparkles, Film, CheckCircle2, ArrowUpDown, LayoutGrid, ThumbsUp, Bookmark, Tv } from "lucide-react";

interface ContentGridProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: "sparkles" | "film" | "check" | "thumbsUp" | "bookmark" | "tv";
  contents: Conteudo[];
  onOpenDetails: (content: Conteudo) => void;
  onToggleWatch: (content: Conteudo) => void;
  myListIds?: number[];
  onToggleBookmark?: (content: Conteudo) => void;
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  title,
  subtitle,
  badge,
  icon = "film",
  contents,
  onOpenDetails,
  onToggleWatch,
  myListIds = [],
  onToggleBookmark,
}) => {
  if (contents.length === 0) {
    return (
      <div className="w-full bg-[#11131f] rounded-2xl p-8 text-center border border-zinc-800/80 my-4">
        <p className="text-zinc-400 text-sm font-medium">
          Nenhum conteúdo encontrado para esta categoria ou busca.
        </p>
      </div>
    );
  }

  const renderIcon = () => {
    switch (icon) {
      case "thumbsUp":
        return <ThumbsUp className="w-5 h-5 text-purple-400" />;
      case "sparkles":
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case "check":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "bookmark":
        return <Bookmark className="w-5 h-5 text-pink-400" />;
      case "tv":
        return <Tv className="w-5 h-5 text-purple-400" />;
      default:
        return <LayoutGrid className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section className="flex flex-col gap-4 my-6">
      {/* Section Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#141624] border border-purple-900/40 shrink-0">
            {renderIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {title}
              </h2>

              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/40">
                {contents.length} {contents.length === 1 ? "título" : "títulos"}
              </span>

              {badge && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-600 text-white">
                  {badge}
                </span>
              )}
            </div>

            {subtitle && (
              <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Filter/Sorting button on top right */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="px-3.5 py-1.5 rounded-xl bg-[#121422] border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
            <span>Mais Recentes</span>
          </button>
        </div>
      </div>

      {/* Poster Cards Grid (5 columns on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {contents.map((item) => (
          <ContentCard
            key={item.id}
            content={item}
            onOpenDetails={onOpenDetails}
            onToggleWatch={onToggleWatch}
            isBookmarked={myListIds.includes(item.id)}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>
    </section>
  );
};

