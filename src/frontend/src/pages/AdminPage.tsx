import { type Operator, TransactionStatus } from "@/backend";
import { AdminLayout } from "@/components/AdminLayout";
import { Spinner } from "@/components/Spinner";
import { useBackend } from "@/hooks/use-backend";
import { cn } from "@/lib/utils";
import type { Analytics, Transaction, UserProfileView } from "@/types";
import { OPERATOR_INFO, formatBalance, formatTimestamp } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Activity, CreditCard, Shield, TrendingUp, Users } from "lucide-react";

const STATUS_STYLES: Record<TransactionStatus, string> = {
  [TransactionStatus.success]: "bg-primary/15 text-primary",
  [TransactionStatus.pending]: "bg-accent/15 text-accent",
  [TransactionStatus.failed]: "bg-destructive/15 text-destructive",
};

function StatCard({
  label,
  value,
  icon: Icon,
  accentClass,
  loading,
  ocid,
}: {
  label: string;
  value: string | null;
  icon: React.ElementType;
  accentClass: string;
  loading: boolean;
  ocid: string;
}) {
  return (
    <div
      data-ocid={ocid}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl",
            accentClass === "text-accent" ? "bg-accent/15" : "bg-primary/15",
          )}
        >
          <Icon className={cn("h-4 w-4", accentClass)} />
        </div>
      </div>
      {loading || value === null ? (
        <Spinner size="sm" />
      ) : (
        <p className={cn("font-mono text-2xl font-bold", accentClass)}>
          {value}
        </p>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { actor, isFetching } = useBackend();

  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.adminGetAnalytics();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: users, isLoading: usersLoading } = useQuery<UserProfileView[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListUsers();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: transactions, isLoading: txLoading } = useQuery<Transaction[]>({
    queryKey: ["admin", "transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetAllTransactions();
    },
    enabled: !!actor && !isFetching,
  });

  const recentTx = (transactions ?? []).slice(0, 10);
  const activePlansCount =
    analytics?.byOperator.reduce(
      (acc, row) => acc + Number(row.totalCount > 0n ? 1 : 0),
      0,
    ) ?? 0;

  const stats = [
    {
      label: "Total Revenue",
      value: analyticsLoading
        ? null
        : formatBalance(analytics?.totalRevenue ?? 0n),
      icon: TrendingUp,
      accentClass: "text-accent",
      ocid: "admin.stat.total_revenue_card",
    },
    {
      label: "Total Recharges",
      value: analyticsLoading ? null : String(analytics?.totalCount ?? 0n),
      icon: Activity,
      accentClass: "text-primary",
      ocid: "admin.stat.total_recharges_card",
    },
    {
      label: "Active Operators",
      value: analyticsLoading ? null : String(activePlansCount),
      icon: CreditCard,
      accentClass: "text-primary",
      ocid: "admin.stat.active_plans_card",
    },
    {
      label: "Total Users",
      value: usersLoading ? null : String(users?.length ?? 0),
      icon: Users,
      accentClass: "text-primary",
      ocid: "admin.stat.total_users_card",
    },
  ];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-4xl px-4 pt-6">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
            <Shield className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Admin Overview
            </h1>
            <p className="text-xs text-muted-foreground">
              Platform performance at a glance
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} loading={s.value === null} />
          ))}
        </div>

        {/* Revenue by Operator */}
        {!analyticsLoading && (analytics?.byOperator ?? []).length > 0 && (
          <div
            data-ocid="admin.operator_revenue_section"
            className="mb-6 rounded-2xl border border-border bg-card p-5"
          >
            <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Revenue by Operator
            </h2>
            <div className="space-y-3">
              {(analytics?.byOperator ?? []).map((row, i) => {
                const op = OPERATOR_INFO[row.operator as Operator];
                const maxRevenue = Math.max(
                  ...(analytics?.byOperator ?? []).map((r) =>
                    Number(r.totalRevenue),
                  ),
                  1,
                );
                const pct = Math.round(
                  (Number(row.totalRevenue) / maxRevenue) * 100,
                );
                return (
                  <div
                    key={String(row.operator)}
                    data-ocid={`admin.operator_row.${i + 1}`}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        op.bgColor,
                        op.textColor,
                      )}
                    >
                      {op.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {op.name}
                        </p>
                        <span className="font-mono text-sm font-semibold text-accent">
                          {formatBalance(row.totalRevenue)}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-accent/60 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {String(row.totalCount)} recharges
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Transactions Table */}
        <div
          data-ocid="admin.recent_transactions_section"
          className="mb-8 rounded-2xl border border-border bg-card"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="font-display text-sm font-semibold text-foreground">
              Recent Transactions
            </h2>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              Last 10
            </span>
          </div>

          {txLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : recentTx.length === 0 ? (
            <div
              data-ocid="admin.transactions.empty_state"
              className="py-10 text-center text-sm text-muted-foreground"
            >
              No transactions yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      User
                    </th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Operator
                    </th>
                    <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentTx.map((tx, i) => {
                    const op = OPERATOR_INFO[tx.operator as Operator];
                    const shortId = `${String(tx.userId).slice(0, 8)}...${String(tx.userId).slice(-4)}`;
                    return (
                      <tr
                        key={String(tx.id)}
                        data-ocid={`admin.tx_row.${i + 1}`}
                        className="transition-smooth hover:bg-secondary/40"
                      >
                        <td className="px-5 py-3">
                          <span className="font-mono text-xs text-muted-foreground">
                            {shortId}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                                op.bgColor,
                                op.textColor,
                              )}
                            >
                              {op.name[0]}
                            </div>
                            <span className="text-xs font-medium text-foreground">
                              {op.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="font-mono text-sm font-semibold text-foreground">
                            {formatBalance(tx.amount)}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                              STATUS_STYLES[tx.status as TransactionStatus],
                            )}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="text-[11px] text-muted-foreground">
                            {formatTimestamp(tx.timestamp)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
