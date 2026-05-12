import { u as useAuth, j as jsxRuntimeExports, S as Spinner } from "./index-DJqSJyUM.js";
import { S as Smartphone, A as ArrowLeftRight } from "./smartphone-C7OPvBHe.js";
import { c as createLucideIcon } from "./createLucideIcon-BDVopTHO.js";
import { R as ReceiptText } from "./receipt-text-CHfTFugz.js";
import { P as PiggyBank } from "./piggy-bank-Db9zHT3f.js";
import { W as Wallet } from "./wallet-DAKZ1teJ.js";
import { S as Shield } from "./shield-BaAX3Fi_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M7 21h10", key: "1b0cd5" }],
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }]
];
const TvMinimal = createLucideIcon("tv-minimal", __iconNode);
const FEATURES = [
  {
    icon: Smartphone,
    label: "Mobile Recharge",
    desc: "Jio, Airtel, Vi, BSNL plans"
  },
  { icon: TvMinimal, label: "DTH Recharge", desc: "Tata Sky, Dish TV & more" },
  {
    icon: ArrowLeftRight,
    label: "Money Transfer",
    desc: "Send funds instantly"
  },
  { icon: ReceiptText, label: "Bill Payment", desc: "Electricity, gas, water" },
  {
    icon: PiggyBank,
    label: "Digital Deposits",
    desc: "Earn interest on savings"
  },
  {
    icon: Wallet,
    label: "Secure Wallet",
    desc: "Funds safe on Internet Computer"
  }
];
function LoginPage() {
  const { login, isLoading } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "pointer-events-none absolute inset-0 overflow-hidden",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[80px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent/8 blur-[60px]" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 shadow-lg shadow-primary/20",
            "aria-hidden": "true",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-primary", children: "SP" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold leading-tight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "SP Mobile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: " Recharge App" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Recharge · Transfer · Bills · Deposits" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 grid grid-cols-2 gap-2", children: FEATURES.map(({ icon: Icon, label, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-2 rounded-xl border border-border/60 bg-secondary/40 p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] leading-tight text-muted-foreground", children: desc })
              ] })
            ]
          },
          label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            "data-ocid": "login.connect_button",
            onClick: login,
            disabled: isLoading,
            className: "flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-smooth hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
            type: "button",
            children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Spinner,
                {
                  size: "sm",
                  className: "border-primary-foreground border-t-transparent"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Connecting…" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Connect with Internet Identity" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-[11px] text-muted-foreground", children: "Powered by Internet Computer — no passwords, no middlemen" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex items-center justify-center gap-4", children: ["256-bit encrypted", "Decentralized", "Zero custody"].map(
        (badge) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70",
            children: badge
          },
          badge
        )
      ) })
    ] })
  ] });
}
export {
  LoginPage as default
};
