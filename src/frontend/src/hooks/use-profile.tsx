import type { UserProfileView } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { useBackend } from "./use-backend";

export function useProfile() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<UserProfileView | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      const profile = await actor.getProfile();
      if (profile == null) {
        return actor.register();
      }
      return profile;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 30_000,
  });

  const topUpMutation = useMutation({
    mutationFn: async (amountPaisa: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.topUpWallet(amountPaisa);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    walletBalance: query.data?.walletBalance ?? 0n,
    isAdmin: query.data?.isAdmin ?? false,
    refetch: query.refetch,
    topUp: topUpMutation,
  };
}
