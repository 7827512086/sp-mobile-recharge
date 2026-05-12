import { a as useBackend, u as useAuth, c as useProfile, f as useQueryClient, r as reactExports, b as useQuery, g as useMutation, j as jsxRuntimeExports, S as Spinner, d as ue } from "./index-DJqSJyUM.js";
import { L as Layout } from "./Layout-cnp0RluJ.js";
import { B as Badge } from "./badge-BXXqpN6p.js";
import { B as Button } from "./button-DFRBYKs0.js";
import { a as formatBalance, f as formatTimestamp, c as getDepositRateForDuration } from "./types-DAsELOtn.js";
import { P as PiggyBank } from "./piggy-bank-Db9zHT3f.js";
import { T as TrendingUp } from "./trending-up-Cez95XhN.js";
import "./useLocation-B-5kwumH.js";
import "./createLucideIcon-BDVopTHO.js";
import "./smartphone-C7OPvBHe.js";
import "./index-DQpP8u8x.js";
const DURATION_OPTIONS = [
  { days: 30, label: "30 Days" },
  { days: 60, label: "60 Days" },
  { days: 90, label: "90 Days" },
  { days: 365, label: "1 Year" }
];
const AMOUNT_PRESETS = [500, 1e3, 2500, 5e3];
function DepositStatusBadge({ status }) {
  if (status === "active")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-md bg-primary/15 px-1.5 py-0 text-[10px] font-semibold text-primary", children: "Active" });
  if (status === "matured")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-md bg-accent/15 px-1.5 py-0 text-[10px] font-semibold text-accent", children: "Matured" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-md bg-muted px-1.5 py-0 text-[10px] text-muted-foreground", children: "Withdrawn" });
}
function DepositsPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const { walletBalance, refetch: refetchProfile } = useProfile();
  const queryClient = useQueryClient();
  const [selectedDays, setSelectedDays] = reactExports.useState(90);
  const [amountRupees, setAmountRupees] = reactExports.useState("");
  const rate = getDepositRateForDuration(selectedDays);
  const annualRatePct = (rate / 100).toFixed(2);
  const amountPaisa = Number.parseFloat(amountRupees) > 0 ? BigInt(Math.round(Number.parseFloat(amountRupees) * 100)) : 0n;
  const estimatedInterest = amountPaisa > 0n ? amountPaisa * BigInt(rate) * BigInt(selectedDays) / (36500n * 100n) : 0n;
  const { data: deposits, isLoading } = useQuery({
    queryKey: ["my-deposits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyDeposits();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 3e4
  });
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createDeposit(
        amountPaisa,
        BigInt(selectedDays)
      );
      if (result.__kind__ === "insufficientBalance")
        throw new Error("Insufficient balance");
      if (result.__kind__ === "userNotFound") throw new Error("User not found");
      if (result.__kind__ === "invalidDuration")
        throw new Error("Invalid deposit duration");
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      ue.success("Deposit created!");
      setAmountRupees("");
      queryClient.invalidateQueries({ queryKey: ["my-deposits"] });
      refetchProfile();
    },
    onError: (err) => ue.error(err.message)
  });
  const matureMutation = useMutation({
    mutationFn: async (depositId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.matureDeposit(depositId);
      if (result.__kind__ === "notYetMatured")
        throw new Error("Deposit has not matured yet");
      if (result.__kind__ === "alreadyProcessed")
        throw new Error("Already processed");
      if (result.__kind__ === "depositNotFound")
        throw new Error("Deposit not found");
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      ue.success("Deposit matured and funds returned!");
      queryClient.invalidateQueries({ queryKey: ["my-deposits"] });
      refetchProfile();
    },
    onError: (err) => ue.error(err.message)
  });
  const canSubmit = amountPaisa > 0n && !createMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md space-y-6 px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-accent/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "h-5 w-5 text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Digital Deposits" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Lock funds and earn interest" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "deposits.balance_chip",
        className: "flex items-center justify-between rounded-xl border border-primary/25 bg-primary/10 px-4 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Available Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-lg font-bold text-primary", children: formatBalance(walletBalance) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display text-sm font-semibold text-foreground", children: "Create Deposit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-medium text-muted-foreground", children: "Duration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-4 gap-2",
            "data-ocid": "deposits.duration_section",
            children: DURATION_OPTIONS.map(({ days, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `deposits.duration.${days}d`,
                onClick: () => setSelectedDays(days),
                className: `rounded-xl border py-2 text-center text-xs font-semibold transition-smooth ${selectedDays === days ? "border-primary/50 bg-primary/15 text-primary" : "border-border bg-secondary text-muted-foreground hover:border-primary/30"}`,
                children: label
              },
              days
            ))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-2 rounded-xl bg-accent/10 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-accent", children: [
          annualRatePct,
          "% p.a."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "for ",
          selectedDays,
          "-day deposit"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-medium text-muted-foreground", children: "Amount (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 grid grid-cols-4 gap-2", children: AMOUNT_PRESETS.map((amt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `deposits.amount_preset.${amt}`,
            onClick: () => setAmountRupees(String(amt)),
            className: `rounded-xl border py-2 text-center text-xs font-semibold transition-smooth ${amountRupees === String(amt) ? "border-primary/50 bg-primary/15 text-primary" : "border-border bg-secondary text-muted-foreground hover:border-primary/30"}`,
            children: [
              "₹",
              amt
            ]
          },
          amt
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            "data-ocid": "deposits.amount_input",
            type: "number",
            min: "100",
            step: "100",
            placeholder: "Custom amount",
            value: amountRupees,
            onChange: (e) => setAmountRupees(e.target.value),
            className: "w-full rounded-xl border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          }
        )
      ] }),
      amountPaisa > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between rounded-xl border border-accent/25 bg-accent/8 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Est. interest earned" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-bold text-accent", children: [
          "+",
          formatBalance(estimatedInterest)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "deposits.create_submit_button",
          onClick: () => createMutation.mutate(),
          disabled: !canSubmit,
          className: "w-full gap-2",
          children: createMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Spinner,
              {
                size: "sm",
                className: "border-primary-foreground border-t-transparent"
              }
            ),
            " ",
            "Creating…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "h-4 w-4" }),
            " Create Deposit"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "deposits.list_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-display text-base font-semibold text-foreground", children: "Your Deposits" }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "deposits.loading_state",
          className: "flex justify-center py-10",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "md" })
        }
      ) : !(deposits == null ? void 0 : deposits.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "deposits.empty_state",
          className: "flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card/60 py-10 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "h-8 w-8 text-muted-foreground/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No deposits yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70", children: "Create your first deposit to start earning" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: deposits.map((dep, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `deposits.item.${i + 1}`,
          className: "rounded-xl border border-border bg-card p-4 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold text-foreground", children: formatBalance(dep.principal) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  String(dep.durationDays),
                  " days ·",
                  " ",
                  Number(dep.interestRate) / 100,
                  "% p.a."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DepositStatusBadge, { status: String(dep.status) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Started ",
                formatTimestamp(dep.startTime)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent", children: [
                "+",
                formatBalance(dep.interestEarned),
                " earned"
              ] })
            ] }),
            dep.status === "matured" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": `deposits.withdraw_button.${i + 1}`,
                size: "sm",
                variant: "outline",
                className: "mt-3 w-full gap-1.5 border-accent/40 text-accent hover:bg-accent/10",
                onClick: () => matureMutation.mutate(dep.id),
                disabled: matureMutation.isPending,
                children: "Withdraw Matured Funds"
              }
            )
          ]
        },
        String(dep.id)
      )) })
    ] })
  ] }) });
}
export {
  DepositsPage as default
};
