import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { useProfile } from "@/hooks/use-profile";
import type { DepositRecord } from "@/types";
import {
  formatBalance,
  formatTimestamp,
  getDepositRateForDuration,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PiggyBank, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DURATION_OPTIONS = [
  { days: 30, label: "30 Days" },
  { days: 60, label: "60 Days" },
  { days: 90, label: "90 Days" },
  { days: 365, label: "1 Year" },
];

const AMOUNT_PRESETS = [500, 1000, 2500, 5000];

function DepositStatusBadge({ status }: { status: string }) {
  if (status === "active")
    return (
      <Badge className="rounded-md bg-primary/15 px-1.5 py-0 text-[10px] font-semibold text-primary">
        Active
      </Badge>
    );
  if (status === "matured")
    return (
      <Badge className="rounded-md bg-accent/15 px-1.5 py-0 text-[10px] font-semibold text-accent">
        Matured
      </Badge>
    );
  return (
    <Badge className="rounded-md bg-muted px-1.5 py-0 text-[10px] text-muted-foreground">
      Withdrawn
    </Badge>
  );
}

export default function DepositsPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const { walletBalance, refetch: refetchProfile } = useProfile();
  const queryClient = useQueryClient();

  const [selectedDays, setSelectedDays] = useState(90);
  const [amountRupees, setAmountRupees] = useState("");

  const rate = getDepositRateForDuration(selectedDays);
  const annualRatePct = (rate / 100).toFixed(2);

  const amountPaisa =
    Number.parseFloat(amountRupees) > 0
      ? BigInt(Math.round(Number.parseFloat(amountRupees) * 100))
      : 0n;
  const estimatedInterest =
    amountPaisa > 0n
      ? (amountPaisa * BigInt(rate) * BigInt(selectedDays)) / (36_500n * 100n)
      : 0n;

  const { data: deposits, isLoading } = useQuery<DepositRecord[]>({
    queryKey: ["my-deposits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyDeposits();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createDeposit(
        amountPaisa,
        BigInt(selectedDays),
      );
      if (result.__kind__ === "insufficientBalance")
        throw new Error("Insufficient balance");
      if (result.__kind__ === "userNotFound") throw new Error("User not found");
      if (result.__kind__ === "invalidDuration")
        throw new Error("Invalid deposit duration");
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      toast.success("Deposit created!");
      setAmountRupees("");
      queryClient.invalidateQueries({ queryKey: ["my-deposits"] });
      refetchProfile();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const matureMutation = useMutation({
    mutationFn: async (depositId: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.matureDeposit(depositId);
      if (result.__kind__ === "notYetMatured")
        throw new Error("Deposit has not matured yet");
      if (result.__kind__ === "alreadyProcessed")
        throw new Error("Already processed");
      if (result.__kind__ === "depositNotFound")
        throw new Error("Deposit not found");
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      toast.success("Deposit matured and funds returned!");
      queryClient.invalidateQueries({ queryKey: ["my-deposits"] });
      refetchProfile();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const canSubmit = amountPaisa > 0n && !createMutation.isPending;

  return (
    <Layout>
      <div className="mx-auto max-w-md space-y-6 px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
            <PiggyBank className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Digital Deposits
            </h1>
            <p className="text-xs text-muted-foreground">
              Lock funds and earn interest
            </p>
          </div>
        </div>

        {/* Balance */}
        <div
          data-ocid="deposits.balance_chip"
          className="flex items-center justify-between rounded-xl border border-primary/25 bg-primary/10 px-4 py-3"
        >
          <span className="text-sm text-muted-foreground">
            Available Balance
          </span>
          <span className="font-mono text-lg font-bold text-primary">
            {formatBalance(walletBalance)}
          </span>
        </div>

        {/* Duration selector */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg">
          <h2 className="mb-4 font-display text-sm font-semibold text-foreground">
            Create Deposit
          </h2>

          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Duration
            </p>
            <div
              className="grid grid-cols-4 gap-2"
              data-ocid="deposits.duration_section"
            >
              {DURATION_OPTIONS.map(({ days, label }) => (
                <button
                  key={days}
                  type="button"
                  data-ocid={`deposits.duration.${days}d`}
                  onClick={() => setSelectedDays(days)}
                  className={`rounded-xl border py-2 text-center text-xs font-semibold transition-smooth ${
                    selectedDays === days
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Rate info */}
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-accent/10 px-3 py-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent">
              {annualRatePct}% p.a.
            </span>
            <span className="text-xs text-muted-foreground">
              for {selectedDays}-day deposit
            </span>
          </div>

          {/* Amount presets */}
          <div className="mb-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Amount (₹)
            </p>
            <div className="mb-2 grid grid-cols-4 gap-2">
              {AMOUNT_PRESETS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  data-ocid={`deposits.amount_preset.${amt}`}
                  onClick={() => setAmountRupees(String(amt))}
                  className={`rounded-xl border py-2 text-center text-xs font-semibold transition-smooth ${
                    amountRupees === String(amt)
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <input
              data-ocid="deposits.amount_input"
              type="number"
              min="100"
              step="100"
              placeholder="Custom amount"
              value={amountRupees}
              onChange={(e) => setAmountRupees(e.target.value)}
              className="w-full rounded-xl border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* Estimated return */}
          {amountPaisa > 0n && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-accent/25 bg-accent/8 px-3 py-2">
              <span className="text-xs text-muted-foreground">
                Est. interest earned
              </span>
              <span className="font-mono text-sm font-bold text-accent">
                +{formatBalance(estimatedInterest)}
              </span>
            </div>
          )}

          <Button
            data-ocid="deposits.create_submit_button"
            onClick={() => createMutation.mutate()}
            disabled={!canSubmit}
            className="w-full gap-2"
          >
            {createMutation.isPending ? (
              <>
                <Spinner
                  size="sm"
                  className="border-primary-foreground border-t-transparent"
                />{" "}
                Creating…
              </>
            ) : (
              <>
                <PiggyBank className="h-4 w-4" /> Create Deposit
              </>
            )}
          </Button>
        </div>

        {/* Active deposits */}
        <section data-ocid="deposits.list_section">
          <h2 className="mb-3 font-display text-base font-semibold text-foreground">
            Your Deposits
          </h2>
          {isLoading ? (
            <div
              data-ocid="deposits.loading_state"
              className="flex justify-center py-10"
            >
              <Spinner size="md" />
            </div>
          ) : !deposits?.length ? (
            <div
              data-ocid="deposits.empty_state"
              className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card/60 py-10 text-center"
            >
              <PiggyBank className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                No deposits yet
              </p>
              <p className="text-xs text-muted-foreground/70">
                Create your first deposit to start earning
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {deposits.map((dep, i) => (
                <div
                  key={String(dep.id)}
                  data-ocid={`deposits.item.${i + 1}`}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">
                        {formatBalance(dep.principal)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {String(dep.durationDays)} days ·{" "}
                        {Number(dep.interestRate) / 100}% p.a.
                      </p>
                    </div>
                    <DepositStatusBadge status={String(dep.status)} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Started {formatTimestamp(dep.startTime)}</span>
                    <span className="text-accent">
                      +{formatBalance(dep.interestEarned)} earned
                    </span>
                  </div>
                  {dep.status === "matured" && (
                    <Button
                      data-ocid={`deposits.withdraw_button.${i + 1}`}
                      size="sm"
                      variant="outline"
                      className="mt-3 w-full gap-1.5 border-accent/40 text-accent hover:bg-accent/10"
                      onClick={() => matureMutation.mutate(dep.id)}
                      disabled={matureMutation.isPending}
                    >
                      Withdraw Matured Funds
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
