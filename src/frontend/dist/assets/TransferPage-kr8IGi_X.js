const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CMP8qUH9.js","assets/createLucideIcon-BDVopTHO.js","assets/index-DJqSJyUM.js","assets/index-BGzDrKyq.css"])))=>i.map(i=>d[i]);
import { a as useBackend, u as useAuth, c as useProfile, f as useQueryClient, r as reactExports, b as useQuery, g as useMutation, j as jsxRuntimeExports, S as Spinner, d as ue, _ as __vitePreload } from "./index-DJqSJyUM.js";
import { L as Layout } from "./Layout-cnp0RluJ.js";
import { B as Badge } from "./badge-BXXqpN6p.js";
import { B as Button } from "./button-DFRBYKs0.js";
import { L as Label, I as Input } from "./label-BdFXT_5g.js";
import { a as formatBalance, f as formatTimestamp } from "./types-DAsELOtn.js";
import { A as ArrowLeftRight } from "./smartphone-C7OPvBHe.js";
import { c as createLucideIcon } from "./createLucideIcon-BDVopTHO.js";
import { A as ArrowDownLeft } from "./index-CMP8qUH9.js";
import "./useLocation-B-5kwumH.js";
import "./index-DQpP8u8x.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
function TransferPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, principal } = useAuth();
  const { walletBalance, refetch: refetchProfile } = useProfile();
  const queryClient = useQueryClient();
  const [recipient, setRecipient] = reactExports.useState("");
  const [amountRupees, setAmountRupees] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const { data: history, isLoading } = useQuery({
    queryKey: ["transfer-history"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransferHistory();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 3e4
  });
  const transferMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-CMP8qUH9.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2,3]) : void 0);
      const amountPaisa = BigInt(
        Math.round(Number.parseFloat(amountRupees) * 100)
      );
      const result = await actor.transferFunds(
        Principal.fromText(recipient.trim()),
        amountPaisa,
        note.trim()
      );
      if (result.__kind__ === "insufficientBalance")
        throw new Error("Insufficient wallet balance");
      if (result.__kind__ === "recipientNotFound")
        throw new Error("Recipient not found — ask them to sign in once first");
      if (result.__kind__ === "senderNotFound")
        throw new Error("Your profile was not found");
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      ue.success("Transfer successful!");
      setRecipient("");
      setAmountRupees("");
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["transfer-history"] });
      refetchProfile();
    },
    onError: (err) => ue.error(err.message)
  });
  const canSubmit = recipient.trim().length > 5 && Number.parseFloat(amountRupees) > 0 && !transferMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md space-y-6 px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-accent/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { className: "h-5 w-5 text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Money Transfer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Send funds instantly to any user" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "transfer.balance_chip",
        className: "flex items-center justify-between rounded-xl border border-primary/25 bg-primary/10 px-4 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Available Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-lg font-bold text-primary", children: formatBalance(walletBalance) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display text-sm font-semibold text-foreground", children: "New Transfer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "transfer-recipient",
              className: "text-xs font-medium text-muted-foreground",
              children: "Recipient Principal ID"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "transfer-recipient",
              "data-ocid": "transfer.recipient_input",
              placeholder: "xxxxx-xxxxx-...",
              value: recipient,
              onChange: (e) => setRecipient(e.target.value),
              className: "font-mono text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "transfer-amount",
              className: "text-xs font-medium text-muted-foreground",
              children: "Amount (₹)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "transfer-amount",
              "data-ocid": "transfer.amount_input",
              type: "number",
              min: "1",
              step: "1",
              placeholder: "0.00",
              value: amountRupees,
              onChange: (e) => setAmountRupees(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "transfer-note",
              className: "text-xs font-medium text-muted-foreground",
              children: "Note (optional)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "transfer-note",
              "data-ocid": "transfer.note_input",
              placeholder: "What's it for?",
              value: note,
              onChange: (e) => setNote(e.target.value),
              maxLength: 100
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "transfer.submit_button",
            onClick: () => transferMutation.mutate(),
            disabled: !canSubmit,
            className: "w-full gap-2",
            children: transferMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Spinner,
                {
                  size: "sm",
                  className: "border-primary-foreground border-t-transparent"
                }
              ),
              " ",
              "Sending…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
              " Send Money"
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "transfer.history_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-display text-base font-semibold text-foreground", children: "Transfer History" }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "transfer.loading_state",
          className: "flex justify-center py-10",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "md" })
        }
      ) : !(history == null ? void 0 : history.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "transfer.empty_state",
          className: "flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card/60 py-10 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { className: "h-8 w-8 text-muted-foreground/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No transfers yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70", children: "Your sent and received transfers will appear here" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border overflow-hidden rounded-xl border border-border bg-card", children: history.map((tx, i) => {
        const isSender = tx.senderId.toString() === principal;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `transfer.history_item.${i + 1}`,
            className: "flex items-center gap-3 px-4 py-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isSender ? "bg-destructive/15" : "bg-accent/15"}`,
                  children: isSender ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-4 w-4 text-accent" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-sm font-medium text-foreground", children: [
                  isSender ? "Sent" : "Received",
                  tx.note ? ` · ${tx.note}` : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatTimestamp(tx.timestamp) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `font-mono text-sm font-semibold ${isSender ? "text-destructive" : "text-accent"}`,
                    children: [
                      isSender ? "-" : "+",
                      formatBalance(tx.amount)
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-md bg-accent/15 px-1.5 py-0 text-[10px] text-accent", children: tx.status.__kind__ ?? String(tx.status) })
              ] })
            ]
          },
          String(tx.id)
        );
      }) })
    ] })
  ] }) });
}
export {
  TransferPage as default
};
