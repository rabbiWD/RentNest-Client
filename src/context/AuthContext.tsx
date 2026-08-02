"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchApi } from "@/lib/api";

export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  profilePhoto?: string;
  status?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  profilePhoto?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to normalize user avatar URL from backend
  const normalizeUser = (backendUser: any): User => {
    return {
      id: backendUser.id || backendUser._id || "usr-" + Math.random().toString(36).substring(2, 7),
      name: backendUser.name || "User",
      email: backendUser.email || "",
      role: (backendUser.role as UserRole) || "TENANT",
      phone: backendUser.phone || backendUser.profile?.phone || "",
      avatarUrl:
        backendUser.profilePhoto ||
        backendUser.profile?.profilePhoto ||
        "",
      status: backendUser.status || "ACTIVE",
    };
  };

  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem("rentnest_token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const res = await fetchApi("/auth/me");
      if (res.data?.profile) {
        const userObj = normalizeUser(res.data.profile.user ? { ...res.data.profile.user, profilePhoto: res.data.profile.profilePhoto } : res.data.profile);
        setUser(userObj);
        localStorage.setItem("rentnest_user", JSON.stringify(userObj));
      }
    } catch (err) {
      console.warn("Session check failed or expired", err);
      // Fall back to stored local user snapshot if available
      const stored = localStorage.getItem("rentnest_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const { user: rawUser, accessToken } = res.data;
      const formattedUser = normalizeUser(rawUser);

      if (accessToken) {
        localStorage.setItem("rentnest_token", accessToken);
        // Also set document cookie for middleware check if needed
        document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `userRole=${formattedUser.role}; path=/; max-age=86400; SameSite=Lax`;
      }
      localStorage.setItem("rentnest_user", JSON.stringify(formattedUser));
      setUser(formattedUser);
      return formattedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const rawUser = res.data?.user || res.data;
      const formattedUser = normalizeUser(rawUser);
      return formattedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rentnest_user");
    localStorage.removeItem("rentnest_token");
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem("rentnest_user", JSON.stringify(updated));
      document.cookie = `userRole=${newRole}; path=/; max-age=86400; SameSite=Lax`;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        refreshProfile,
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
