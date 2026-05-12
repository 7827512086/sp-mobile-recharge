import { TransactionStatus } from "@/backend";
import { EmptyState } from "@/components/EmptyState";
import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import {
  OPERATOR_INFO,
  type Transaction,
  formatBalance,
  formatTimestamp,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { useState } from "react";

type FilterType = "all" | "mobile" | "dth";

const MOBILE_OPS = new Set(["jio", "airtel", "vi", "bsnl"]);
const DTH_OPS = new Set(["tataSky", "dishTV"]);

function groupByDate(
  txs: Transaction[],
): Array<{ label: string; items: Transaction[] }> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86_400_000);

  const groups = new Map<string, Transaction[]>();
  for (const tx of txs) {
    const ms = Number(tx.timestamp / 1_000_000n);
    const d = new Date(ms);
    let key: string;
    if (d >= todayStart) key = "Today";
    else if (d >= yesterdayStart) key = "Yesterday";
    else
      key = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(d);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tx);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({
    label,
    items,
  }));
}

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

export default function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const { actor, isFetching } = useBackend();
  const [filter, setFilter] = useState<FilterType>("all");

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["my-transactions-history"],
    queryFn: async () => {
      if (!actor) return [];
      const txs = await actor.getMyTransactions();
      return [...txs].sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 30_000,
  });

  const filteredTx = (transactions ?? []).filter((tx) => {
    if (filter === "mobile") return MOBILE_OPS.has(tx.operator as string);
    if (filter === "dth") return DTH_OPS.has(tx.operator as string);
    return true;
  });

  const grouped = groupByDate(filteredTx);

  const FILTER_TABS: Array<{ key: FilterType; label: string }> = [
    { key: "all", label: "All" },
    { key: "mobile", label: "Mobile" },
    { key: "dth", label: "DTH" },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-md space-y-5 px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground">
            Transaction History
          </h1>
          {transactions && transactions.length > 0 && (
            <span className="font-mono text-xs text-muted-foreground">
              {filteredTx.length} records
            </span>
          )}
        </div>

        {/* Filter tabs */}
        <div
          data-ocid="history.filter_tabs"
          className="flex rounded-xl border border-border bg-card p-1"
        >
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              data-ocid={`history.filter_${key}_tab`}
              type="button"
              onClick={() => setFilter(key)}
              className={`flex flex-1 items-center justify-center rounded-lg py-2 text-sm font-semibold transition-smooth ${
                filter === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div
            data-ocid="history.loading_state"
            className="flex items-center justify-center py-16"
          >
            <Spinner size="md" />
          </div>
        ) : filteredTx.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No transactions found"
            description={
              filter === "all"
                ? "Your recharge history will appear here after your first transaction."
                : `No ${filter === "mobile" ? "mobile" : "DTH"} transactions yet.`
            }
          />
        ) : (
          <div data-ocid="history.transactions_list" className="space-y-6">
            {grouped.map(({ label, items }) => (
              <section key={label}>
                <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
                <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                  {items.map((tx, i) => {
                    const opInfo = OPERATOR_INFO[tx.operator];
                    const isMobile = MOBILE_OPS.has(tx.operator as string);
                    return (
                      <div
                        key={String(tx.id)}
                        data-ocid={`history.transaction_item.${i + 1}`}
                        className="flex items-center gap-3 px-4 py-3.5"
                      >
                        {/* Operator logo */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${opInfo.bgColor}`}
                        >
                          <span className="text-xs font-bold text-white">
                            {opInfo.name.slice(0, 2)}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {opInfo.name}
                            </p>
                            <Badge
                              className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${
                                isMobile
                                  ? "bg-primary/15 text-primary"
                                  : "bg-accent/15 text-accent"
                              }`}
                            >
                              {isMobile ? "Mobile" : "DTH"}
                            </Badge>
                          </div>
                          <p className="truncate font-mono text-xs text-muted-foreground">
                            {tx.targetNumber || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(tx.timestamp)}
                          </p>
                        </div>

                        {/* Amount + status */}
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <span className="font-mono text-sm font-bold text-foreground">
                            -{formatBalance(tx.amount)}
                          </span>
                          <StatusBadge status={tx.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
