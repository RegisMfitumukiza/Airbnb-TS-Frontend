import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getMe, loginUser, registerUser } from "../api/authApi";
import type { LoginPayload, RegisterPayload, User } from "../types";

const TOKEN_KEY = "token";

function getDashboardPath(user: User) {
  if (user.role === "ADMIN") return "/admin/dashboard";
  if (user.role === "HOST") return "/host/dashboard";
  return "/listings";
}

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const token = localStorage.getItem(TOKEN_KEY);

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: Boolean(token),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: (response) => {
      localStorage.setItem(TOKEN_KEY, response.token);
      queryClient.setQueryData(["me"], response.data);
      navigate(getDashboardPath(response.data));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: (response) => {
      localStorage.setItem(TOKEN_KEY, response.token);
      queryClient.setQueryData(["me"], response.data);
      navigate(getDashboardPath(response.data));
    },
  });

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    queryClient.removeQueries({ queryKey: ["me"] });
    navigate("/login");
  };

  return {
    user: meQuery.data,
    isAuthenticated: Boolean(token) && Boolean(meQuery.data),
    isLoadingUser: meQuery.isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}