import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { useProfile } from "@/hooks/use-profile";
import {
  OPERATOR_INFO,
  type Transaction,
  formatBalance,
  formatTimestamp,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PRESET_AMOUNTS = [
  { label: "₹100", value: 10_000n },
  { label: "₹500", value: 50_000n },
  { label: "₹1000", value: 100_000n },
  { label: "₹2000", value: 200_000n },
];

export default function WalletPage() {
  const { isAuthenticated } = useAuth();
  const { walletBalance, isLoading: profileLoading, topUp } = useProfile();
  const { actor, isFetching } = useBackend();
  const [selectedPreset, setSelectedPreset] = useState<bigint | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isTopping, setIsTopping] = useState(false);

  const { data: transactions, isLoading: txLoading } = useQuery<Transaction[]>({
    queryKey: ["my-transactions-wallet"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTransactions();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 30_000,
  });

  const computedAmount = (): bigint | null => {
    if (customAmount.trim()) {
      const n = Number.parseInt(customAmount, 10);
      if (!Number.isNaN(n) && n > 0) return BigInt(n * 100);
      return null;
    }
    return selectedPreset;
  };

  const handleTopUp = async () => {
    const amount = computedAmount();
    if (!amount || amount <= 0n) {
      toast.error("Please enter a valid amount");
      return;
    }
    setIsTopping(true);
    try {
      await topUp.mutateAsync(amount);
      toast.success(`Wallet topped up with ${formatBalance(amount)}!`, {
        description: "Your balance has been updated.",
      });
      setSelectedPreset(null);
      setCustomAmount("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Top-up failed";
      toast.error(message);
    } finally {
      setIsTopping(false);
    }
  };

  const rechargeTransactions = transactions ?? [];

  return (
    <Layout>
      <div className="mx-auto max-w-md space-y-6 px-4 py-6">
        {/* Balance card */}
        <div
          data-ocid="wallet.balance_card"
          className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-card to-card p-6 shadow-lg"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              {profileLoading ? (
                <div className="my-2">
                  <Spinner size="sm" />
                </div>
              ) : (
                <p
                  data-ocid="wallet.balance_display"
                  className="mt-1 font-mono text-4xl font-bold tracking-tight text-primary"
                >
                  {formatBalance(walletBalance)}
                </p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Add funds via UPI to recharge your mobile or DTH subscription.
          </p>
        </div>

        {/* Top Up Section */}
        <section
          data-ocid="wallet.topup_section"
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <h2 className="mb-4 font-display text-base font-semibold text-foreground">
            Top Up Wallet
          </h2>

          {/* Preset buttons */}
          <div className="mb-4 grid grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map(({ label, value }) => (
              <button
                key={label}
                data-ocid={`wallet.preset_${label.replace("₹", "")}`}
                type="button"
                onClick={() => {
                  setSelectedPreset(value);
                  setCustomAmount("");
                }}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition-smooth ${
                  selectedPreset === value
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="mb-5">
            <Label
              htmlFor="custom-amount"
              className="mb-1.5 block text-xs text-muted-foreground"
            >
              Or enter custom amount (₹)
            </Label>
            <Input
              id="custom-amount"
              data-ocid="wallet.custom_amount_input"
              type="number"
              min="1"
              placeholder="e.g. 250"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedPreset(null);
              }}
              className="border-border bg-secondary font-mono text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            data-ocid="wallet.confirm_topup_button"
            className="w-full gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            onClick={handleTopUp}
            disabled={isTopping || !computedAmount()}
          >
            {isTopping ? (
              <>
                <Spinner size="sm" /> Processing...
              </>
            ) : (
              <>
                <ArrowDownLeft className="h-4 w-4" />
                {computedAmount()
                  ? `Confirm Top Up — ${formatBalance(computedAmount()!)}`
                  : "Confirm Top Up"}
              </>
            )}
          </Button>
        </section>

        {/* Recharge History */}
        <section data-ocid="wallet.recharge_history_section">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-base font-semibold text-foreground">
              Recharge History
            </h2>
            <span className="text-xs text-muted-foreground">
              Wallet top-ups are not tracked individually
            </span>
          </div>

          {txLoading ? (
            <div
              data-ocid="wallet.transactions_loading_state"
              className="flex items-center justify-center py-10"
            >
              <Spinner size="md" />
            </div>
          ) : rechargeTransactions.length === 0 ? (
            <div
              data-ocid="wallet.transactions_empty_state"
              className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 py-10 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-foreground">
                  No recharges yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Your recharge history will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {rechargeTransactions.map((tx, i) => (
                <div
                  key={String(tx.id)}
                  data-ocid={`wallet.transaction_item.${i + 1}`}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                    <ArrowDownLeft className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {OPERATOR_INFO[tx.operator].name} Recharge
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(tx.timestamp)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-mono text-sm font-semibold text-destructive">
                      -{formatBalance(tx.amount)}
                    </span>
                    <Badge
                      variant="outline"
                      className="rounded-md px-2 py-0.5 text-xs font-semibold"
                    >
                      Recharge
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
