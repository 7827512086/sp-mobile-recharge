import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  principal: string | null;
  login: () => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const { identity, loginStatus, login, clear } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity != null;
  const isLoading = loginStatus === "logging-in";
  const principal = isAuthenticated ? identity!.getPrincipal().toText() : null;

  return {
    isAuthenticated,
    isLoading,
    principal,
    login,
    logout: clear,
  };
}
