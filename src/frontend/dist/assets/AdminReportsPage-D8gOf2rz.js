import { a as useBackend, u as useAuth, b as useQuery, j as jsxRuntimeExports, O as Operator, h as TxType, S as Spinner } from "./index-DJqSJyUM.js";
import { A as AdminLayout, F as FileText } from "./AdminLayout-Dk4cUZpS.js";
import { B as Badge } from "./badge-BXXqpN6p.js";
import { a as formatBalance, d as formatTxType, f as formatTimestamp } from "./types-DAsELOtn.js";
import { u as useLocation } from "./useLocation-B-5kwumH.js";
import "./shield-BaAX3Fi_.js";
import "./createLucideIcon-BDVopTHO.js";
import "./arrow-left-0p5opU2E.js";
import "./index-DQpP8u8x.js";
const TYPE_FILTERS = [
  { value: null, label: "All" },
  { value: TxType.recharge, label: "Recharge" },
  { value: TxType.transfer, label: "Transfer" },
  { value: TxType.bill, label: "Bill" },
  { value: TxType.deposit, label: "Deposit" },
  { value: TxType.topUp, label: "Top-Up" }
];
const OPERATOR_FILTERS = [
  { value: null, label: "All Operators" },
  { value: Operator.jio, label: "Jio" },
  { value: Operator.airtel, label: "Airtel" },
  { value: Operator.vi, label: "Vi" },
  { value: Operator.bsnl, label: "BSNL" },
  { value: Operator.tataSky, label: "Tata Sky" },
  { value: Operator.dishTV, label: "Dish TV" }
];
const STATUS_FILTERS = [
  { value: null, label: "Any Status" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" }
];
function AdminReportsPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const rawSearch = new URLSearchParams(location.search);
  const typeFilter = rawSearch.get("txType") ?? null;
  const operatorFilter = rawSearch.get("operator") ?? null;
  const statusFilter = rawSearch.get("status") ?? null;
  const dateFrom = rawSearch.get("dateFrom") ?? "";
  const dateTo = rawSearch.get("dateTo") ?? "";
  function setSearch(patch) {
    const current = {
      txType: typeFilter,
      operator: operatorFilter,
      status: statusFilter,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null
    };
    const next = {};
    for (const key of ["txType", "operator", "status", "dateFrom", "dateTo"]) {
      const val = key in patch ? patch[key] : current[key];
      if (val) next[key] = val;
    }
    const url = new URL(window.location.href);
    for (const key of ["txType", "operator", "status", "dateFrom", "dateTo"]) {
      if (next[key]) url.searchParams.set(key, next[key]);
      else url.searchParams.delete(key);
    }
    window.history.replaceState({}, "", url.toString());
  }
  function dateToNs(dateStr) {
    if (!dateStr) return void 0;
    const ms = new Date(dateStr).getTime();
    if (Number.isNaN(ms)) return void 0;
    return BigInt(ms) * 1000000n;
  }
  const filter = {
    ...typeFilter ? { txType: typeFilter } : {},
    ...operatorFilter ? { operator: operatorFilter } : {},
    ...statusFilter ? { status: statusFilter } : {},
    ...dateFrom ? { dateFrom: dateToNs(dateFrom) } : {},
    ...dateTo ? { dateTo: dateToNs(`${dateTo}T23:59:59`) } : {}
  };
  const { data: transactions, isLoading } = useQuery({
    queryKey: [
      "admin-reports",
      typeFilter,
      operatorFilter,
      statusFilter,
      dateFrom,
      dateTo
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetAllTransactionsV2(filter);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 3e4
  });
  const totalRevenue = (transactions == null ? void 0 : transactions.reduce((sum, tx) => sum + tx.amount, 0n)) ?? 0n;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-6 px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-accent/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Transaction Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "All platform transactions with filtering" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/25 bg-primary/10 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Transactions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-2xl font-bold text-primary", children: (transactions == null ? void 0 : transactions.length) ?? 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-accent/25 bg-accent/10 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Volume" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-2xl font-bold text-accent", children: formatBalance(totalRevenue) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-2 gap-3",
        "data-ocid": "admin.reports.date_filters",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                className: "mb-1 block text-xs font-medium text-muted-foreground",
                htmlFor: "date-from",
                children: "From Date"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "date",
                "data-ocid": "admin.reports.date_from_input",
                value: dateFrom,
                onChange: (e) => setSearch({ dateFrom: e.target.value || null }),
                className: "w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30",
                id: "date-from"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                className: "mb-1 block text-xs font-medium text-muted-foreground",
                htmlFor: "date-to",
                children: "To Date"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "date",
                "data-ocid": "admin.reports.date_to_input",
                value: dateTo,
                onChange: (e) => setSearch({ dateTo: e.target.value || null }),
                className: "w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30",
                id: "date-to"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            className: "mb-1 block text-xs font-medium text-muted-foreground",
            htmlFor: "op-filter",
            children: "Operator"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            "data-ocid": "admin.reports.operator_select",
            value: operatorFilter ?? "",
            onChange: (e) => setSearch({ operator: e.target.value || null }),
            className: "w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30",
            id: "op-filter",
            children: OPERATOR_FILTERS.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: value ?? "", children: label }, label))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            className: "mb-1 block text-xs font-medium text-muted-foreground",
            htmlFor: "status-filter",
            children: "Status"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            "data-ocid": "admin.reports.status_select",
            value: statusFilter ?? "",
            onChange: (e) => setSearch({ status: e.target.value || null }),
            className: "w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30",
            id: "status-filter",
            children: STATUS_FILTERS.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: value ?? "", children: label }, label))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "admin.reports.type_filter",
        className: "flex gap-2 overflow-x-auto pb-1",
        children: TYPE_FILTERS.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `admin.reports.filter.${label.toLowerCase()}`,
            onClick: () => setSearch({ txType: value }),
            className: `shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth ${typeFilter === value ? "border-accent/50 bg-accent/15 text-accent" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`,
            children: label
          },
          label
        ))
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "admin.reports.loading_state",
        className: "flex justify-center py-16",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "md" })
      }
    ) : !(transactions == null ? void 0 : transactions.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "admin.reports.empty_state",
        className: "flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card/60 py-16 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 text-muted-foreground/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No transactions found" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_auto_auto_auto] gap-0 border-b border-border bg-muted/40 px-4 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground", children: "Type / Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right text-xs font-semibold text-muted-foreground", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 text-right text-xs font-semibold text-muted-foreground", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 text-right text-xs font-semibold text-muted-foreground", children: "ID" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: transactions.map((tx, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `admin.reports.tx_item.${i + 1}`,
          className: "grid grid-cols-[1fr_auto_auto_auto] items-center gap-0 px-4 py-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium text-foreground", children: formatTxType(tx.txType) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatTimestamp(tx.timestamp) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-semibold text-foreground", children: formatBalance(tx.amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: `rounded-md px-1.5 py-0 text-[10px] ${String(tx.status) === "success" ? "bg-accent/15 text-accent" : String(tx.status) === "failed" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"}`,
                children: String(tx.status)
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-3 font-mono text-[10px] text-muted-foreground/60", children: [
              "#",
              String(tx.id)
            ] })
          ]
        },
        String(tx.id)
      )) })
    ] })
  ] }) });
}
export {
  AdminReportsPage as default
};
