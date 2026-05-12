import { a as useBackend, b as useQuery, j as jsxRuntimeExports, e as cn, S as Spinner, T as TransactionStatus } from "./index-DJqSJyUM.js";
import { A as AdminLayout } from "./AdminLayout-Dk4cUZpS.js";
import { a as formatBalance, O as OPERATOR_INFO, f as formatTimestamp } from "./types-DAsELOtn.js";
import { T as TrendingUp } from "./trending-up-Cez95XhN.js";
import { c as createLucideIcon } from "./createLucideIcon-BDVopTHO.js";
import { S as Shield } from "./shield-BaAX3Fi_.js";
import "./useLocation-B-5kwumH.js";
import "./arrow-left-0p5opU2E.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
const STATUS_STYLES = {
  [TransactionStatus.success]: "bg-primary/15 text-primary",
  [TransactionStatus.pending]: "bg-accent/15 text-accent",
  [TransactionStatus.failed]: "bg-destructive/15 text-destructive"
};
function StatCard({
  label,
  value,
  icon: Icon,
  accentClass,
  loading,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": ocid,
      className: "flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "flex h-8 w-8 items-center justify-center rounded-xl",
                accentClass === "text-accent" ? "bg-accent/15" : "bg-primary/15"
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-4 w-4", accentClass) })
            }
          )
        ] }),
        loading || value === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("font-mono text-2xl font-bold", accentClass), children: value })
      ]
    }
  );
}
function AdminPage() {
  const { actor, isFetching } = useBackend();
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.adminGetAnalytics();
    },
    enabled: !!actor && !isFetching
  });
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListUsers();
    },
    enabled: !!actor && !isFetching
  });
  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ["admin", "transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetAllTransactions();
    },
    enabled: !!actor && !isFetching
  });
  const recentTx = (transactions ?? []).slice(0, 10);
  const activePlansCount = (analytics == null ? void 0 : analytics.byOperator.reduce(
    (acc, row) => acc + Number(row.totalCount > 0n ? 1 : 0),
    0
  )) ?? 0;
  const stats = [
    {
      label: "Total Revenue",
      value: analyticsLoading ? null : formatBalance((analytics == null ? void 0 : analytics.totalRevenue) ?? 0n),
      icon: TrendingUp,
      accentClass: "text-accent",
      ocid: "admin.stat.total_revenue_card"
    },
    {
      label: "Total Recharges",
      value: analyticsLoading ? null : String((analytics == null ? void 0 : analytics.totalCount) ?? 0n),
      icon: Activity,
      accentClass: "text-primary",
      ocid: "admin.stat.total_recharges_card"
    },
    {
      label: "Active Operators",
      value: analyticsLoading ? null : String(activePlansCount),
      icon: CreditCard,
      accentClass: "text-primary",
      ocid: "admin.stat.active_plans_card"
    },
    {
      label: "Total Users",
      value: usersLoading ? null : String((users == null ? void 0 : users.length) ?? 0),
      icon: Users,
      accentClass: "text-primary",
      ocid: "admin.stat.total_users_card"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 pt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl border border-accent/30 bg-accent/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Admin Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Platform performance at a glance" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 grid grid-cols-2 gap-4 md:grid-cols-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { ...s, loading: s.value === null }, s.label)) }),
    !analyticsLoading && ((analytics == null ? void 0 : analytics.byOperator) ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "admin.operator_revenue_section",
        className: "mb-6 rounded-2xl border border-border bg-card p-5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: "Revenue by Operator" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ((analytics == null ? void 0 : analytics.byOperator) ?? []).map((row, i) => {
            const op = OPERATOR_INFO[row.operator];
            const maxRevenue = Math.max(
              ...((analytics == null ? void 0 : analytics.byOperator) ?? []).map(
                (r) => Number(r.totalRevenue)
              ),
              1
            );
            const pct = Math.round(
              Number(row.totalRevenue) / maxRevenue * 100
            );
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `admin.operator_row.${i + 1}`,
                className: "flex items-center gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        op.bgColor,
                        op.textColor
                      ),
                      children: op.name[0]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: op.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-semibold text-accent", children: formatBalance(row.totalRevenue) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full bg-accent/60 transition-all duration-700",
                        style: { width: `${pct}%` }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[10px] text-muted-foreground", children: [
                      String(row.totalCount),
                      " recharges"
                    ] })
                  ] })
                ]
              },
              String(row.operator)
            );
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "admin.recent_transactions_section",
        className: "mb-8 rounded-2xl border border-border bg-card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-5 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground", children: "Recent Transactions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground", children: "Last 10" })
          ] }),
          txLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) }) : recentTx.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "admin.transactions.empty_state",
              className: "py-10 text-center text-sm text-muted-foreground",
              children: "No transactions yet."
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: "User" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Operator" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Time" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: recentTx.map((tx, i) => {
              const op = OPERATOR_INFO[tx.operator];
              const shortId = `${String(tx.userId).slice(0, 8)}...${String(tx.userId).slice(-4)}`;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  "data-ocid": `admin.tx_row.${i + 1}`,
                  className: "transition-smooth hover:bg-secondary/40",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: shortId }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                            op.bgColor,
                            op.textColor
                          ),
                          children: op.name[0]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: op.name })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-semibold text-foreground", children: formatBalance(tx.amount) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                          STATUS_STYLES[tx.status]
                        ),
                        children: tx.status
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: formatTimestamp(tx.timestamp) }) })
                  ]
                },
                String(tx.id)
              );
            }) })
          ] }) })
        ]
      }
    )
  ] }) });
}
export {
  AdminPage as default
};
