import { AuthResponse, Conteudo, RecomendacoesResponse, Usuario } from "@/types";

const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const trimmed = envUrl.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to get token from storage
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

// Generic fetch wrapper with Authorization header
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.erro || data.mensagem || "Erro na requisição com o servidor.";
    if (
      (response.status === 401 || (response.status === 404 && errorMsg.includes("Usuário"))) &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth endpoints
  async login(username: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  async register(
    nome: string,
    username: string,
    password: string,
    idade: number,
    generos_favoritos: string[]
  ): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nome,
        username,
        password,
        idade,
        generos_favoritos,
      }),
    });
  },

  async me(): Promise<{ usuario: Usuario }> {
    return request<{ usuario: Usuario }>("/auth/me");
  },

  // Catalog & Recommendations
  async getConteudo(): Promise<Conteudo[]> {
    return request<Conteudo[]>("/conteudo");
  },

  async getRecomendacoes(): Promise<RecomendacoesResponse> {
    return request<RecomendacoesResponse>("/conteudo/recomendados");
  },

  async marcarComoAssistido(conteudoId: number): Promise<{ sucesso?: boolean; mensagem: string }> {
    return request<{ sucesso?: boolean; mensagem: string }>(`/conteudo/${conteudoId}/assistir`, {
      method: "POST",
    });
  },

  async getHistorico(): Promise<Conteudo[]> {
    return request<Conteudo[]>("/conteudo/historico");
  },
};
