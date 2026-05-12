import { TransactionStatus } from "@/backend";
import { EmptyState } from "@/components/EmptyState";
import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { useProfile } from "@/hooks/use-profile";
import {
  type BillRecord,
  type DepositRecord,
  OPERATOR_INFO,
  type Transaction,
  type TransferRecord,
  formatBalance,
  formatTimestamp,
} from "@/types";
import { useQueries } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  ArrowRight,
  Clock,
  History,
  PiggyBank,
  Plus,
  ReceiptText,
  Smartphone,
  Tv,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    label: "Recharge Mobile",
    icon: Smartphone,
    to: "/recharge" as const,
    ocid: "home.quick_recharge_mobile",
    color: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    label: "Recharge DTH",
    icon: Tv,
    to: "/recharge" as const,
    ocid: "home.quick_recharge_dth",
    color: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    label: "Money Transfer",
    icon: ArrowLeftRight,
    to: "/transfer" as const,
    ocid: "home.quick_transfer",
    color: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    label: "Pay Bills",
    icon: ReceiptText,
    to: "/bills" as const,
    ocid: "home.quick_bills",
    color: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    label: "Deposits",
    icon: PiggyBank,
    to: "/deposits" as const,
    ocid: "home.quick_deposits",
    color: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    label: "Top Up Wallet",
    icon: Plus,
    to: "/wallet" as const,
    ocid: "home.quick_topup",
    color: "bg-primary/15",
    iconColor: "text-primary",
  },
];

function StatusBadge({ status }: { status: TransactionStatus }) {
  if (status === TransactionStatus.success)
    return (
      <Badge className="rounded-md bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent">
        Success
      </Badge>
    );
  if (status === TransactionStatus.failed)
    return (
      <Badge className="rounded-md bg-destructive/20 px-2 py-0.5 text-xs font-semibold text-destructive">
        Failed
      </Badge>
    );
  return (
    <Badge className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
      Pending
    </Badge>
  );
}

export default function HomePage() {
  const { principal, isAuthenticated } = useAuth();
  const { walletBalance, isAdmin, isLoading: profileLoading } = useProfile();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();

  const shortPrincipal = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-6)}`
    : null;

  const queryEnabled = !!actor && !isFetching && isAuthenticated;

  const results = useQueries({
    queries: [
      {
        queryKey: ["my-transactions-home"],
        queryFn: async () => (actor ? actor.getMyTransactions() : []),
        enabled: queryEnabled,
        staleTime: 30_000,
      },
      {
        queryKey: ["transfer-history-home"],
        queryFn: async () => (actor ? actor.getTransferHistory() : []),
        enabled: queryEnabled,
        staleTime: 30_000,
      },
      {
        queryKey: ["bill-payments-home"],
        queryFn: async () => (actor ? actor.getMyBillPayments() : []),
        enabled: queryEnabled,
        staleTime: 30_000,
      },
      {
        queryKey: ["deposits-home"],
        queryFn: async () => (actor ? actor.getMyDeposits() : []),
        enabled: queryEnabled,
        staleTime: 30_000,
      },
    ],
  });

  const txLoading = results.some((r) => r.isLoading);

  type UnifiedEntry = {
    id: string;
    label: string;
    sublabel: string;
    amount: bigint;
    timestamp: bigint;
    status: TransactionStatus;
    iconKey: string;
  };

  const allEntries: UnifiedEntry[] = [
    ...((results[0].data as Transaction[] | undefined) ?? []).map((tx) => ({
      id: `r-${String(tx.id)}`,
      label: `${OPERATOR_INFO[tx.operator]?.name ?? String(tx.operator)} Recharge`,
      sublabel: formatTimestamp(tx.timestamp),
      amount: tx.amount,
      timestamp: tx.timestamp,
      status: tx.status,
      iconKey: String(tx.operator),
    })),
    ...((results[1].data as TransferRecord[] | undefined) ?? []).map((tx) => ({
      id: `t-${String(tx.id)}`,
      label: "Money Transfer",
      sublabel: formatTimestamp(tx.timestamp),
      amount: tx.amount,
      timestamp: tx.timestamp,
      status: TransactionStatus.success,
      iconKey: "transfer",
    })),
    ...((results[2].data as BillRecord[] | undefined) ?? []).map((tx) => ({
      id: `b-${String(tx.id)}`,
      label: "Bill Payment",
      sublabel: formatTimestamp(tx.timestamp),
      amount: tx.amount,
      timestamp: tx.timestamp,
      status: TransactionStatus.success,
      iconKey: "bill",
    })),
    ...((results[3].data as DepositRecord[] | undefined) ?? []).map((tx) => ({
      id: `d-${String(tx.id)}`,
      label: "Digital Deposit",
      sublabel: formatTimestamp(tx.startTime),
      amount: tx.principal,
      timestamp: tx.startTime,
      status: TransactionStatus.success,
      iconKey: "deposit",
    })),
  ];

  allEntries.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
  const recentTx = allEntries.slice(0, 5);

  return (
    <Layout>
      <div className="mx-auto max-w-md space-y-6 px-4 py-6">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <div className="mt-0.5 flex items-center gap-2">
              <h1
                data-ocid="home.greeting"
                className="font-display text-lg font-bold text-foreground"
              >
                {shortPrincipal ?? "Loading..."}
              </h1>
              {isAdmin && (
                <Badge
                  data-ocid="home.admin_badge"
                  className="rounded-md bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent"
                >
                  Admin
                </Badge>
              )}
            </div>
          </div>
          {isAdmin && (
            <Link to="/admin">
              <Button
                data-ocid="home.admin_link"
                variant="outline"
                size="sm"
                className="gap-1.5 border-accent/40 text-accent hover:bg-accent/10"
              >
                Admin Panel <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>

        {/* Wallet Balance Card */}
        <div
          data-ocid="home.wallet_card"
          className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-card to-card p-6 shadow-lg"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
          <p className="text-sm font-medium text-muted-foreground">
            Wallet Balance
          </p>
          {profileLoading ? (
            <div className="my-2 flex items-center gap-3">
              <Spinner size="sm" />
            </div>
          ) : (
            <p
              data-ocid="home.wallet_balance"
              className="mt-1 font-mono text-4xl font-bold tracking-tight text-primary"
            >
              {formatBalance(walletBalance)}
            </p>
          )}
          <div className="mt-4 flex gap-3">
            <Link to="/wallet" className="flex-1">
              <Button
                data-ocid="home.add_funds_button"
                variant="outline"
                className="w-full gap-2 border-primary/40 text-primary hover:bg-primary/10"
              >
                <Plus className="h-4 w-4" /> Add Funds
              </Button>
            </Link>
            <Link to="/history" className="flex-1">
              <Button
                data-ocid="home.view_history_button"
                variant="outline"
                className="w-full gap-2 border-border text-muted-foreground hover:text-foreground"
              >
                <History className="h-4 w-4" /> History
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <section data-ocid="home.quick_actions_section">
          <h2 className="mb-3 font-display text-base font-semibold text-foreground">
            Quick Actions
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map(
              ({ label, icon: Icon, to, ocid, color, iconColor }) => (
                <button
                  key={ocid}
                  data-ocid={ocid}
                  type="button"
                  onClick={() => navigate({ to })}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-smooth hover:border-primary/30 hover:bg-card/80 active:scale-95"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}
                  >
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <span className="text-xs font-medium leading-tight text-foreground">
                    {label}
                  </span>
                </button>
              ),
            )}
          </div>
        </section>

        {/* Recent Transactions */}
        <section data-ocid="home.recent_transactions_section">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-foreground">
              Recent Transactions
            </h2>
            <Link
              to="/history"
              data-ocid="home.see_all_history_link"
              className="flex items-center gap-1 text-xs text-primary transition-smooth hover:text-primary/80"
            >
              See all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {txLoading ? (
            <div
              data-ocid="home.transactions_loading_state"
              className="flex items-center justify-center py-10"
            >
              <Spinner size="md" />
            </div>
          ) : recentTx.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No transactions yet"
              description="Your transaction history will appear here after your first transaction."
              action={{
                label: "Recharge Now",
                onClick: () => navigate({ to: "/recharge" }),
              }}
            />
          ) : (
            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {recentTx.map((entry, i) => {
                const opInfo =
                  OPERATOR_INFO[entry.iconKey as keyof typeof OPERATOR_INFO];
                const initials = opInfo
                  ? opInfo.name.slice(0, 2)
                  : entry.label.slice(0, 2).toUpperCase();
                const bgColor = opInfo ? opInfo.bgColor : "bg-muted";
                return (
                  <div
                    key={entry.id}
                    data-ocid={`home.transaction_item.${i + 1}`}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${bgColor}`}
                    >
                      <span className="text-xs font-bold text-foreground">
                        {initials}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {entry.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.sublabel}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        -{formatBalance(entry.amount)}
                      </span>
                      <StatusBadge status={entry.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
