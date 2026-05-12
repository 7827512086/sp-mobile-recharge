import { u as useAuth, a as useBackend, r as reactExports, b as useQuery, j as jsxRuntimeExports, S as Spinner, T as TransactionStatus } from "./index-DJqSJyUM.js";
import { E as EmptyState } from "./EmptyState-j5cN7fLp.js";
import { L as Layout } from "./Layout-cnp0RluJ.js";
import { B as Badge } from "./badge-BXXqpN6p.js";
import { O as OPERATOR_INFO, f as formatTimestamp, a as formatBalance } from "./types-DAsELOtn.js";
import { C as Clock } from "./clock-ufcn7AeJ.js";
import "./button-DFRBYKs0.js";
import "./index-DQpP8u8x.js";
import "./useLocation-B-5kwumH.js";
import "./createLucideIcon-BDVopTHO.js";
import "./smartphone-C7OPvBHe.js";
const MOBILE_OPS = /* @__PURE__ */ new Set(["jio", "airtel", "vi", "bsnl"]);
const DTH_OPS = /* @__PURE__ */ new Set(["tataSky", "dishTV"]);
function groupByDate(txs) {
  const now = /* @__PURE__ */ new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 864e5);
  const groups = /* @__PURE__ */ new Map();
  for (const tx of txs) {
    const ms = Number(tx.timestamp / 1000000n);
    const d = new Date(ms);
    let key;
    if (d >= todayStart) key = "Today";
    else if (d >= yesterdayStart) key = "Yesterday";
    else
      key = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(d);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(tx);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({
    label,
    items
  }));
}
function StatusBadge({ status }) {
  if (status === TransactionStatus.success)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-md bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent", children: "Success" });
  if (status === TransactionStatus.failed)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-md bg-destructive/20 px-2 py-0.5 text-xs font-semibold text-destructive", children: "Failed" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground", children: "Pending" });
}
function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const { actor, isFetching } = useBackend();
  const [filter, setFilter] = reactExports.useState("all");
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["my-transactions-history"],
    queryFn: async () => {
      if (!actor) return [];
      const txs = await actor.getMyTransactions();
      return [...txs].sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 3e4
  });
  const filteredTx = (transactions ?? []).filter((tx) => {
    if (filter === "mobile") return MOBILE_OPS.has(tx.operator);
    if (filter === "dth") return DTH_OPS.has(tx.operator);
    return true;
  });
  const grouped = groupByDate(filteredTx);
  const FILTER_TABS = [
    { key: "all", label: "All" },
    { key: "mobile", label: "Mobile" },
    { key: "dth", label: "DTH" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md space-y-5 px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Transaction History" }),
      transactions && transactions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
        filteredTx.length,
        " records"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "history.filter_tabs",
        className: "flex rounded-xl border border-border bg-card p-1",
        children: FILTER_TABS.map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            "data-ocid": `history.filter_${key}_tab`,
            type: "button",
            onClick: () => setFilter(key),
            className: `flex flex-1 items-center justify-center rounded-lg py-2 text-sm font-semibold transition-smooth ${filter === key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
            children: label
          },
          key
        ))
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "history.loading_state",
        className: "flex items-center justify-center py-16",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "md" })
      }
    ) : filteredTx.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Clock,
        title: "No transactions found",
        description: filter === "all" ? "Your recharge history will appear here after your first transaction." : `No ${filter === "mobile" ? "mobile" : "DTH"} transactions yet.`
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "history.transactions_list", className: "space-y-6", children: grouped.map(({ label, items }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border overflow-hidden rounded-xl border border-border bg-card", children: items.map((tx, i) => {
        const opInfo = OPERATOR_INFO[tx.operator];
        const isMobile = MOBILE_OPS.has(tx.operator);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `history.transaction_item.${i + 1}`,
            className: "flex items-center gap-3 px-4 py-3.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${opInfo.bgColor}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white", children: opInfo.name.slice(0, 2) })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold text-foreground", children: opInfo.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: `rounded-md px-1.5 py-0.5 text-xs font-medium ${isMobile ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`,
                      children: isMobile ? "Mobile" : "DTH"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-mono text-xs text-muted-foreground", children: tx.targetNumber || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatTimestamp(tx.timestamp) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-col items-end gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-bold text-foreground", children: [
                  "-",
                  formatBalance(tx.amount)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: tx.status })
              ] })
            ]
          },
          String(tx.id)
        );
      }) })
    ] }, label)) })
  ] }) });
}
export {
  HistoryPage as default
};
