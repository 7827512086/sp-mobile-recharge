import { type Operator, TransactionStatus } from "@/backend";
import { AdminLayout } from "@/components/AdminLayout";
import { EmptyState } from "@/components/EmptyState";
import { Spinner } from "@/components/Spinner";
import { useBackend } from "@/hooks/use-backend";
import { cn } from "@/lib/utils";
import type { Analytics, Transaction } from "@/types";
import { OPERATOR_INFO, formatBalance, formatTimestamp } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STATUS_STYLES: Record<TransactionStatus, string> = {
  [TransactionStatus.success]: "bg-primary/15 text-primary",
  [TransactionStatus.pending]: "bg-accent/15 text-accent",
  [TransactionStatus.failed]: "bg-destructive/15 text-destructive",
};

const CHART_COLORS = [
  "oklch(0.68 0.18 190)",
  "oklch(0.75 0.16 75)",
  "oklch(0.65 0.18 150)",
  "oklch(0.72 0.15 85)",
  "oklch(0.70 0.15 310)",
  "oklch(0.68 0.22 35)",
];

type StatusFilter = "all" | TransactionStatus;

export default function AdminAnalyticsPage() {
  const { actor, isFetching } = useBackend();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.adminGetAnalytics();
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

  const chartData =
    analytics?.byOperator.map((row, i) => ({
      name:
        OPERATOR_INFO[row.operator as Operator]?.name ?? String(row.operator),
      revenue: Number(row.totalRevenue) / 100,
      count: Number(row.totalCount),
      fill: CHART_COLORS[i % CHART_COLORS.length],
    })) ?? [];

  const filteredTx = (transactions ?? []).filter((tx) =>
    statusFilter === "all" ? true : tx.status === statusFilter,
  );

  const totalRevenue = analytics?.totalRevenue ?? 0n;
  const totalCount = analytics?.totalCount ?? 0n;
  const avgValue =
    totalCount > 0n
      ? formatBalance(totalRevenue / totalCount)
      : formatBalance(0n);

  // Top 3 operators by revenue
  const top3 = [...(analytics?.byOperator ?? [])]
    .sort((a, b) => Number(b.totalRevenue - a.totalRevenue))
    .slice(0, 3);

  const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: TransactionStatus.success, label: "Success" },
    { value: TransactionStatus.failed, label: "Failed" },
  ];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <div className="mb-6">
          <h1 className="font-display text-xl font-bold text-foreground">
            Analytics
          </h1>
          <p className="text-xs text-muted-foreground">
            Revenue and recharge performance overview
          </p>
        </div>

        {/* Summary Stats */}
        {analyticsLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Global Stats */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              {[
                {
                  label: "Total Revenue",
                  value: formatBalance(totalRevenue),
                  accent: "text-accent",
                  ocid: "admin.analytics.total_revenue_card",
                },
                {
                  label: "Total Transactions",
                  value: String(totalCount),
                  accent: "text-primary",
                  ocid: "admin.analytics.total_transactions_card",
                },
                {
                  label: "Avg Transaction",
                  value: avgValue,
                  accent: "text-primary",
                  ocid: "admin.analytics.avg_transaction_card",
                },
              ].map(({ label, value, accent, ocid }) => (
                <div
                  key={label}
                  data-ocid={ocid}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </p>
                  <p className={cn("font-mono text-xl font-bold", accent)}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Top 3 Operator Cards */}
            {top3.length > 0 && (
              <div
                data-ocid="admin.analytics.top_operators_section"
                className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                {top3.map((row, i) => {
                  const op = OPERATOR_INFO[row.operator as Operator];
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div
                      key={String(row.operator)}
                      data-ocid={`admin.analytics.top_operator_card.${i + 1}`}
                      className="relative overflow-hidden rounded-2xl border border-border bg-card p-4"
                    >
                      <div
                        className="absolute inset-0 opacity-5"
                        style={{
                          background: `radial-gradient(circle at top right, ${op.color}, transparent 70%)`,
                        }}
                      />
                      <div className="relative">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                                op.bgColor,
                                op.textColor,
                              )}
                            >
                              {op.name[0]}
                            </div>
                            <span className="font-medium text-foreground">
                              {op.name}
                            </span>
                          </div>
                          <span className="text-lg">{medals[i]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-accent" />
                          <p className="font-mono text-lg font-bold text-accent">
                            {formatBalance(row.totalRevenue)}
                          </p>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {String(row.totalCount)} recharges
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Revenue Chart */}
            {chartData.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="No analytics data"
                description="Analytics will appear once recharges are completed."
                className="mb-6"
              />
            ) : (
              <div
                data-ocid="admin.analytics.chart"
                className="mb-6 rounded-2xl border border-border bg-card p-5"
              >
                <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Revenue by Operator (INR)
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 11,
                        fill: "oklch(0.52 0.018 260)",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: "oklch(0.2 0.022 260 / 0.6)" }}
                      contentStyle={{
                        backgroundColor: "oklch(0.17 0.022 260)",
                        border: "1px solid oklch(0.25 0.024 260)",
                        borderRadius: "10px",
                        color: "oklch(0.93 0.01 260)",
                        fontSize: 12,
                        padding: "8px 12px",
                      }}
                      formatter={(v: number) => [`₹${v.toFixed(2)}`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}

        {/* Transactions with Filter */}
        <div
          data-ocid="admin.analytics.transactions_section"
          className="mb-8 rounded-2xl border border-border bg-card"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
            <h2 className="font-display text-sm font-semibold text-foreground">
              All Transactions
            </h2>
            <div className="flex items-center gap-1">
              {STATUS_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  data-ocid={`admin.analytics.filter.${value}_tab`}
                  onClick={() => setStatusFilter(value)}
                  type="button"
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-smooth",
                    statusFilter === value
                      ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {txLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : filteredTx.length === 0 ? (
            <div
              data-ocid="admin.analytics.transactions.empty_state"
              className="py-10 text-center text-sm text-muted-foreground"
            >
              No transactions match this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Date
                    </th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      User
                    </th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Operator
                    </th>
                    <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-5 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTx.map((tx, i) => {
                    const op = OPERATOR_INFO[tx.operator as Operator];
                    const shortId = `${String(tx.userId).slice(0, 8)}...${String(tx.userId).slice(-4)}`;
                    return (
                      <tr
                        key={String(tx.id)}
                        data-ocid={`admin.analytics.tx_item.${i + 1}`}
                        className="transition-smooth hover:bg-secondary/40"
                      >
                        <td className="px-5 py-3">
                          <span className="text-[11px] text-muted-foreground">
                            {formatTimestamp(tx.timestamp)}
                          </span>
                        </td>
                        <td className="px-3 py-3">
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
                        <td className="px-5 py-3 text-center">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                              STATUS_STYLES[tx.status as TransactionStatus],
                            )}
                          >
                            {tx.status}
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
