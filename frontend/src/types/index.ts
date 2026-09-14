export interface Usuario {
  id: number;
  nome: string;
  username: string;
  idade: number;
  generos_favoritos: string[];
  historico_ids: number[];
}

export interface Conteudo {
  id: number;
  titulo: string;
  sinopse: string;
  generos: string[];
  classificacao_etaria: string; // 'Livre' | '10' | '12' | '14' | '16' | '18'
  imagem_banner_url: string;
  acesso_permitido?: boolean;
  ja_assistiu?: boolean;
  is_original?: boolean;
}

export interface AuthResponse {
  mensagem: string;
  access_token: string;
  refresh_token?: string;
  usuario: Usuario;
}

export interface RecomendacoesResponse {
  usuario_id: number;
  generos_favoritos: string[];
  idade: number;
  recomendacoes: Conteudo[];
}
