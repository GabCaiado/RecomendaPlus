"use client";

import React, { useState } from "react";
import { Film, ShieldCheck, Code2, Cpu, Database, ChevronDown } from "lucide-react";

export const Footer: React.FC = () => {
  const [showArchitecture, setShowArchitecture] = useState(false);

  return (
    <footer className="w-full mt-12 border-t border-zinc-800/60 pt-8 pb-10 bg-[#090a10] text-xs text-zinc-500">
      <div className="flex flex-col gap-6">
        {/* Toggleable Multiparadigm Architecture details */}
        <div className="flex items-center justify-between py-2 px-4 rounded-xl bg-[#11131f] border border-zinc-800/80">
          <div className="flex items-center gap-2 text-zinc-300 font-semibold">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Arquitetura Multiparadigma (POO, Funcional, Lógico, Imperativo)</span>
          </div>

          <button
            onClick={() => setShowArchitecture(!showArchitecture)}
            className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>{showArchitecture ? "Ocultar detalhes" : "Ver detalhes"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showArchitecture ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showArchitecture && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl bg-[#11131f] border border-zinc-800/80">
              <span className="text-purple-400 font-bold flex items-center gap-1.5 mb-1 text-xs">
                <Code2 className="w-3.5 h-3.5" /> 1. POO (Objetos)
              </span>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Models <code className="text-purple-300">Usuario</code> e <code className="text-purple-300">Conteudo</code> encapsulam regras Werkzeug hash e relacionamentos N:N.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#11131f] border border-zinc-800/80">
              <span className="text-pink-400 font-bold flex items-center gap-1.5 mb-1 text-xs">
                <Cpu className="w-3.5 h-3.5" /> 2. Funcional
              </span>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Motor puro <code className="text-pink-300">obter_recomendacoes</code> imutável baseado em map, filter e intersecção de gêneros.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#11131f] border border-zinc-800/80">
              <span className="text-rose-400 font-bold flex items-center gap-1.5 mb-1 text-xs">
                <ShieldCheck className="w-3.5 h-3.5" /> 3. Lógico
              </span>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Restrições de faixa etária declarativas Prolog via <code className="text-rose-300">inferir_permissao_acesso</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#11131f] border border-zinc-800/80">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 mb-1 text-xs">
                <Database className="w-3.5 h-3.5" /> 4. Imperativo
              </span>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Instruções sequenciais explícitas de mutação de histórico com SQLite transaction.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Copyright & Footer Links Row matching Image 2 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-zinc-400 text-xs">
            © 2025 Recomenda+ Streaming Platform. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-5 text-xs text-zinc-400">
            <span className="hover:text-white cursor-pointer transition-colors">Termos de Uso</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacidade</span>
            <span className="hover:text-white cursor-pointer transition-colors">Ajuda</span>
            <span className="hover:text-white cursor-pointer transition-colors">API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

