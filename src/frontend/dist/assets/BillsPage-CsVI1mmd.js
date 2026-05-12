import { a as useBackend, u as useAuth, c as useProfile, f as useQueryClient, r as reactExports, B as BillCategory, b as useQuery, g as useMutation, j as jsxRuntimeExports, S as Spinner, d as ue } from "./index-DJqSJyUM.js";
import { L as Layout } from "./Layout-cnp0RluJ.js";
import { B as Badge } from "./badge-BXXqpN6p.js";
import { B as Button } from "./button-DFRBYKs0.js";
import { L as Label, I as Input } from "./label-BdFXT_5g.js";
import { a as formatBalance, g as getBillCategoryIcon, b as getBillCategoryLabel, f as formatTimestamp } from "./types-DAsELOtn.js";
import { R as ReceiptText } from "./receipt-text-CHfTFugz.js";
import "./useLocation-B-5kwumH.js";
import "./createLucideIcon-BDVopTHO.js";
import "./smartphone-C7OPvBHe.js";
import "./index-DQpP8u8x.js";
const BILL_CATEGORIES = [
  {
    value: BillCategory.electricity,
    label: "Electricity",
    desc: "DISCOM / state boards"
  },
  {
    value: BillCategory.water,
    label: "Water",
    desc: "Municipal water board"
  },
  { value: BillCategory.gas, label: "Gas", desc: "PNG / piped gas" },
  {
    value: BillCategory.internet,
    label: "Internet",
    desc: "Broadband / fiber"
  }
];
function BillsPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const { walletBalance, refetch: refetchProfile } = useProfile();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = reactExports.useState(
    BillCategory.electricity
  );
  const [billerId, setBillerId] = reactExports.useState("");
  const [amountRupees, setAmountRupees] = reactExports.useState("");
  const { data: bills, isLoading } = useQuery({
    queryKey: ["bill-payments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBillPayments();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 3e4
  });
  const billMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const amountPaisa = BigInt(
        Math.round(Number.parseFloat(amountRupees) * 100)
      );
      const result = await actor.payBill(
        selectedCategory,
        billerId.trim(),
        amountPaisa
      );
      if (result.__kind__ === "insufficientBalance")
        throw new Error("Insufficient balance");
      if (result.__kind__ === "userNotFound") throw new Error("User not found");
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      ue.success("Bill paid successfully!");
      setBillerId("");
      setAmountRupees("");
      queryClient.invalidateQueries({ queryKey: ["bill-payments"] });
      refetchProfile();
    },
    onError: (err) => ue.error(err.message)
  });
  const canSubmit = billerId.trim().length > 0 && Number.parseFloat(amountRupees) > 0 && !billMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md space-y-6 px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-accent/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptText, { className: "h-5 w-5 text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Bill Payment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pay electricity, water, gas & internet bills" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "bills.balance_chip",
        className: "flex items-center justify-between rounded-xl border border-primary/25 bg-primary/10 px-4 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Available Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-lg font-bold text-primary", children: formatBalance(walletBalance) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 gap-3",
        "data-ocid": "bills.category_section",
        children: BILL_CATEGORIES.map(({ value, label, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `bills.category.${value}`,
            onClick: () => setSelectedCategory(value),
            className: `flex items-center gap-3 rounded-xl border p-3 text-left transition-smooth ${selectedCategory === value ? "border-accent/50 bg-accent/10 ring-1 ring-accent/30" : "border-border bg-card hover:border-accent/30"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: getBillCategoryIcon(value) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: desc })
              ] })
            ]
          },
          value
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-4 font-display text-sm font-semibold text-foreground", children: [
        "Pay ",
        getBillCategoryLabel(selectedCategory),
        " Bill"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "biller-id",
              className: "text-xs font-medium text-muted-foreground",
              children: "Consumer / Account Number"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "biller-id",
              "data-ocid": "bills.biller_id_input",
              placeholder: "Enter your consumer number",
              value: billerId,
              onChange: (e) => setBillerId(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "bill-amount",
              className: "text-xs font-medium text-muted-foreground",
              children: "Amount (₹)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "bill-amount",
              "data-ocid": "bills.amount_input",
              type: "number",
              min: "1",
              step: "1",
              placeholder: "0.00",
              value: amountRupees,
              onChange: (e) => setAmountRupees(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "bills.pay_submit_button",
            onClick: () => billMutation.mutate(),
            disabled: !canSubmit,
            className: "w-full gap-2",
            children: billMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Spinner,
                {
                  size: "sm",
                  className: "border-primary-foreground border-t-transparent"
                }
              ),
              " ",
              "Processing…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptText, { className: "h-4 w-4" }),
              " Pay Bill"
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "bills.history_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-display text-base font-semibold text-foreground", children: "Payment History" }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "bills.loading_state",
          className: "flex justify-center py-10",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "md" })
        }
      ) : !(bills == null ? void 0 : bills.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "bills.empty_state",
          className: "flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card/60 py-10 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptText, { className: "h-8 w-8 text-muted-foreground/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No bills paid yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70", children: "Your payment history will appear here" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border overflow-hidden rounded-xl border border-border bg-card", children: bills.map((bill, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `bills.history_item.${i + 1}`,
          className: "flex items-center gap-3 px-4 py-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-lg", children: getBillCategoryIcon(bill.category) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium text-foreground", children: getBillCategoryLabel(bill.category) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-xs text-muted-foreground", children: [
                "Acc: ",
                bill.billerId,
                " · ",
                formatTimestamp(bill.timestamp)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-col items-end gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-semibold text-foreground", children: [
                "-",
                formatBalance(bill.amount)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: `rounded-md px-1.5 py-0 text-[10px] ${bill.status === "success" ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"}`,
                  children: String(bill.status)
                }
              )
            ] })
          ]
        },
        String(bill.id)
      )) })
    ] })
  ] }) });
}
export {
  BillsPage as default
};
