import { u as useAuth, c as useProfile, a as useBackend, r as reactExports, b as useQuery, j as jsxRuntimeExports, S as Spinner, d as ue } from "./index-DJqSJyUM.js";
import { L as Layout } from "./Layout-cnp0RluJ.js";
import { B as Badge } from "./badge-BXXqpN6p.js";
import { B as Button } from "./button-DFRBYKs0.js";
import { L as Label, I as Input } from "./label-BdFXT_5g.js";
import { a as formatBalance, O as OPERATOR_INFO, f as formatTimestamp } from "./types-DAsELOtn.js";
import { W as Wallet } from "./wallet-DAKZ1teJ.js";
import { A as ArrowDownLeft } from "./index-CMP8qUH9.js";
import "./useLocation-B-5kwumH.js";
import "./createLucideIcon-BDVopTHO.js";
import "./smartphone-C7OPvBHe.js";
import "./index-DQpP8u8x.js";
const PRESET_AMOUNTS = [
  { label: "₹100", value: 10000n },
  { label: "₹500", value: 50000n },
  { label: "₹1000", value: 100000n },
  { label: "₹2000", value: 200000n }
];
function WalletPage() {
  const { isAuthenticated } = useAuth();
  const { walletBalance, isLoading: profileLoading, topUp } = useProfile();
  const { actor, isFetching } = useBackend();
  const [selectedPreset, setSelectedPreset] = reactExports.useState(null);
  const [customAmount, setCustomAmount] = reactExports.useState("");
  const [isTopping, setIsTopping] = reactExports.useState(false);
  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ["my-transactions-wallet"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTransactions();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 3e4
  });
  const computedAmount = () => {
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
      ue.error("Please enter a valid amount");
      return;
    }
    setIsTopping(true);
    try {
      await topUp.mutateAsync(amount);
      ue.success(`Wallet topped up with ${formatBalance(amount)}!`, {
        description: "Your balance has been updated."
      });
      setSelectedPreset(null);
      setCustomAmount("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Top-up failed";
      ue.error(message);
    } finally {
      setIsTopping(false);
    }
  };
  const rechargeTransactions = transactions ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md space-y-6 px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "wallet.balance_card",
        className: "relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-card to-card p-6 shadow-lg",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/15 blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Total Balance" }),
              profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "sm" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": "wallet.balance_display",
                  className: "mt-1 font-mono text-4xl font-bold tracking-tight text-primary",
                  children: formatBalance(walletBalance)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-6 w-6 text-primary" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Add funds via UPI to recharge your mobile or DTH subscription." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        "data-ocid": "wallet.topup_section",
        className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display text-base font-semibold text-foreground", children: "Top Up Wallet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 grid grid-cols-4 gap-2", children: PRESET_AMOUNTS.map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              "data-ocid": `wallet.preset_${label.replace("₹", "")}`,
              type: "button",
              onClick: () => {
                setSelectedPreset(value);
                setCustomAmount("");
              },
              className: `rounded-xl border py-2.5 text-sm font-semibold transition-smooth ${selectedPreset === value ? "border-primary bg-primary/20 text-primary" : "border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
              children: label
            },
            label
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "custom-amount",
                className: "mb-1.5 block text-xs text-muted-foreground",
                children: "Or enter custom amount (₹)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "custom-amount",
                "data-ocid": "wallet.custom_amount_input",
                type: "number",
                min: "1",
                placeholder: "e.g. 250",
                value: customAmount,
                onChange: (e) => {
                  setCustomAmount(e.target.value);
                  setSelectedPreset(null);
                },
                className: "border-border bg-secondary font-mono text-foreground placeholder:text-muted-foreground"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "wallet.confirm_topup_button",
              className: "w-full gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
              onClick: handleTopUp,
              disabled: isTopping || !computedAmount(),
              children: isTopping ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "sm" }),
                " Processing..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-4 w-4" }),
                computedAmount() ? `Confirm Top Up — ${formatBalance(computedAmount())}` : "Confirm Top Up"
              ] })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "wallet.recharge_history_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-baseline justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "Recharge History" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Wallet top-ups are not tracked individually" })
      ] }),
      txLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "wallet.transactions_loading_state",
          className: "flex items-center justify-center py-10",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "md" })
        }
      ) : rechargeTransactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "wallet.transactions_empty_state",
          className: "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 py-10 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-6 w-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold text-foreground", children: "No recharges yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Your recharge history will appear here." })
            ] })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border overflow-hidden rounded-xl border border-border bg-card", children: rechargeTransactions.map((tx, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `wallet.transaction_item.${i + 1}`,
          className: "flex items-center gap-3 px-4 py-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-4 w-4 text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                OPERATOR_INFO[tx.operator].name,
                " Recharge"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatTimestamp(tx.timestamp) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-col items-end gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-semibold text-destructive", children: [
                "-",
                formatBalance(tx.amount)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "rounded-md px-2 py-0.5 text-xs font-semibold",
                  children: "Recharge"
                }
              )
            ] })
          ]
        },
        String(tx.id)
      )) })
    ] })
  ] }) });
}
export {
  WalletPage as default
};
