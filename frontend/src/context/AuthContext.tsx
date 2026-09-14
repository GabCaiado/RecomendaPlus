"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Usuario } from "@/types";
import { api } from "@/services/api";

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    nome: string,
    username: string,
    password: string,
    idade: number,
    generos_favoritos: string[]
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state from local storage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await api.me();
          setUser(res.usuario);
        } catch {
          // Token is invalid, expired, or user no longer exists in database
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.login(username, password);
    localStorage.setItem("access_token", res.access_token);
    if (res.refresh_token) {
      localStorage.setItem("refresh_token", res.refresh_token);
    }
    setToken(res.access_token);
    setUser(res.usuario);
  };

  const register = async (
    nome: string,
    username: string,
    password: string,
    idade: number,
    generos_favoritos: string[]
  ) => {
    const res = await api.register(nome, username, password, idade, generos_favoritos);
    localStorage.setItem("access_token", res.access_token);
    if (res.refresh_token) {
      localStorage.setItem("refresh_token", res.refresh_token);
    }
    setToken(res.access_token);
    setUser(res.usuario);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await api.me();
      setUser(res.usuario);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
