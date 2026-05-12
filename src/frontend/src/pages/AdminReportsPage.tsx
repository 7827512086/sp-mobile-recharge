import { Operator, TxType } from "@/backend";
import { AdminLayout } from "@/components/AdminLayout";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import type { TxRecord } from "@/types";
import { formatBalance, formatTimestamp, formatTxType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { FileText } from "lucide-react";

const TYPE_FILTERS: { value: TxType | null; label: string }[] = [
  { value: null, label: "All" },
  { value: TxType.recharge, label: "Recharge" },
  { value: TxType.transfer, label: "Transfer" },
  { value: TxType.bill, label: "Bill" },
  { value: TxType.deposit, label: "Deposit" },
  { value: TxType.topUp, label: "Top-Up" },
];

const OPERATOR_FILTERS: { value: Operator | null; label: string }[] = [
  { value: null, label: "All Operators" },
  { value: Operator.jio, label: "Jio" },
  { value: Operator.airtel, label: "Airtel" },
  { value: Operator.vi, label: "Vi" },
  { value: Operator.bsnl, label: "BSNL" },
  { value: Operator.tataSky, label: "Tata Sky" },
  { value: Operator.dishTV, label: "Dish TV" },
];

const STATUS_FILTERS: { value: string | null; label: string }[] = [
  { value: null, label: "Any Status" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
];

export default function AdminReportsPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();

  const location = useLocation();
  const rawSearch = new URLSearchParams(location.search);

  const typeFilter = (rawSearch.get("txType") as TxType) ?? null;
  const operatorFilter = (rawSearch.get("operator") as Operator) ?? null;
  const statusFilter = rawSearch.get("status") ?? null;
  const dateFrom = rawSearch.get("dateFrom") ?? "";
  const dateTo = rawSearch.get("dateTo") ?? "";

  function setSearch(patch: Record<string, string | null>) {
    const current: Record<string, string | null> = {
      txType: typeFilter,
      operator: operatorFilter,
      status: statusFilter,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    };
    const next: Record<string, string> = {};
    for (const key of ["txType", "operator", "status", "dateFrom", "dateTo"]) {
      const val = key in patch ? patch[key] : current[key];
      if (val) next[key] = val;
    }
    // Use window.history to update URL search params without router type conflicts
    const url = new URL(window.location.href);
    for (const key of ["txType", "operator", "status", "dateFrom", "dateTo"]) {
      if (next[key]) url.searchParams.set(key, next[key]);
      else url.searchParams.delete(key);
    }
    window.history.replaceState({}, "", url.toString());
  }

  // Convert dateFrom/dateTo strings to nanosecond timestamps for TxFilter
  function dateToNs(dateStr: string): bigint | undefined {
    if (!dateStr) return undefined;
    const ms = new Date(dateStr).getTime();
    if (Number.isNaN(ms)) return undefined;
    return BigInt(ms) * 1_000_000n;
  }

  const filter = {
    ...(typeFilter ? { txType: typeFilter } : {}),
    ...(operatorFilter ? { operator: operatorFilter } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(dateFrom ? { dateFrom: dateToNs(dateFrom) } : {}),
    ...(dateTo ? { dateTo: dateToNs(`${dateTo}T23:59:59`) } : {}),
  };

  const { data: transactions, isLoading } = useQuery<TxRecord[]>({
    queryKey: [
      "admin-reports",
      typeFilter,
      operatorFilter,
      statusFilter,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetAllTransactionsV2(filter);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 30_000,
  });

  const totalRevenue =
    transactions?.reduce((sum, tx) => sum + tx.amount, 0n) ?? 0n;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
            <FileText className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Transaction Reports
            </h1>
            <p className="text-xs text-muted-foreground">
              All platform transactions with filtering
            </p>
          </div>
        </div>

        {/* Summary chips */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3">
            <p className="text-xs text-muted-foreground">Total Transactions</p>
            <p className="font-mono text-2xl font-bold text-primary">
              {transactions?.length ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-accent/25 bg-accent/10 px-4 py-3">
            <p className="text-xs text-muted-foreground">Total Volume</p>
            <p className="font-mono text-2xl font-bold text-accent">
              {formatBalance(totalRevenue)}
            </p>
          </div>
        </div>

        {/* Date-range filters */}
        <div
          className="grid grid-cols-2 gap-3"
          data-ocid="admin.reports.date_filters"
        >
          <div>
            <label
              className="mb-1 block text-xs font-medium text-muted-foreground"
              htmlFor="date-from"
            >
              From Date
            </label>
            <input
              type="date"
              data-ocid="admin.reports.date_from_input"
              value={dateFrom}
              onChange={(e) => setSearch({ dateFrom: e.target.value || null })}
              className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              id="date-from"
            />
          </div>
          <div>
            <label
              className="mb-1 block text-xs font-medium text-muted-foreground"
              htmlFor="date-to"
            >
              To Date
            </label>
            <input
              type="date"
              data-ocid="admin.reports.date_to_input"
              value={dateTo}
              onChange={(e) => setSearch({ dateTo: e.target.value || null })}
              className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              id="date-to"
            />
          </div>
        </div>

        {/* Operator & Status dropdowns */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className="mb-1 block text-xs font-medium text-muted-foreground"
              htmlFor="op-filter"
            >
              Operator
            </label>
            <select
              data-ocid="admin.reports.operator_select"
              value={operatorFilter ?? ""}
              onChange={(e) => setSearch({ operator: e.target.value || null })}
              className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              id="op-filter"
            >
              {OPERATOR_FILTERS.map(({ value, label }) => (
                <option key={label} value={value ?? ""}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="mb-1 block text-xs font-medium text-muted-foreground"
              htmlFor="status-filter"
            >
              Status
            </label>
            <select
              data-ocid="admin.reports.status_select"
              value={statusFilter ?? ""}
              onChange={(e) => setSearch({ status: e.target.value || null })}
              className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              id="status-filter"
            >
              {STATUS_FILTERS.map(({ value, label }) => (
                <option key={label} value={value ?? ""}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type filter tabs */}
        <div
          data-ocid="admin.reports.type_filter"
          className="flex gap-2 overflow-x-auto pb-1"
        >
          {TYPE_FILTERS.map(({ value, label }) => (
            <button
              key={label}
              type="button"
              data-ocid={`admin.reports.filter.${label.toLowerCase()}`}
              onClick={() => setSearch({ txType: value })}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth ${
                typeFilter === value
                  ? "border-accent/50 bg-accent/15 text-accent"
                  : "border-border bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Transactions table */}
        {isLoading ? (
          <div
            data-ocid="admin.reports.loading_state"
            className="flex justify-center py-16"
          >
            <Spinner size="md" />
          </div>
        ) : !transactions?.length ? (
          <div
            data-ocid="admin.reports.empty_state"
            className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card/60 py-16 text-center"
          >
            <FileText className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">
              No transactions found
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 border-b border-border bg-muted/40 px-4 py-2.5">
              <span className="text-xs font-semibold text-muted-foreground">
                Type / Time
              </span>
              <span className="text-right text-xs font-semibold text-muted-foreground">
                Amount
              </span>
              <span className="ml-3 text-right text-xs font-semibold text-muted-foreground">
                Status
              </span>
              <span className="ml-3 text-right text-xs font-semibold text-muted-foreground">
                ID
              </span>
            </div>
            <div className="divide-y divide-border">
              {transactions.map((tx, i) => (
                <div
                  key={String(tx.id)}
                  data-ocid={`admin.reports.tx_item.${i + 1}`}
                  className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-0 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {formatTxType(tx.txType)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(tx.timestamp)}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {formatBalance(tx.amount)}
                  </span>
                  <div className="ml-3">
                    <Badge
                      className={`rounded-md px-1.5 py-0 text-[10px] ${
                        String(tx.status) === "success"
                          ? "bg-accent/15 text-accent"
                          : String(tx.status) === "failed"
                            ? "bg-destructive/15 text-destructive"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {String(tx.status)}
                    </Badge>
                  </div>
                  <span className="ml-3 font-mono text-[10px] text-muted-foreground/60">
                    #{String(tx.id)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
