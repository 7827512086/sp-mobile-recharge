import { c as useProfile, u as useAuth, j as jsxRuntimeExports, L as Link } from "./index-DJqSJyUM.js";
import { a as formatBalance } from "./types-DAsELOtn.js";
import { u as useLocation } from "./useLocation-B-5kwumH.js";
import { c as createLucideIcon } from "./createLucideIcon-BDVopTHO.js";
import { S as Smartphone, A as ArrowLeftRight } from "./smartphone-C7OPvBHe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/recharge", icon: Smartphone, label: "Recharge" },
  { to: "/transfer", icon: ArrowLeftRight, label: "Transfer" },
  { to: "/history", icon: History, label: "History" },
  { to: "/wallet", icon: User, label: "Account" }
];
function Layout({ children }) {
  const { walletBalance } = useProfile();
  const { logout, principal } = useAuth();
  const location = useLocation();
  const shortPrincipal = principal ? `${principal.slice(0, 5)}...${principal.slice(-4)}` : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "header",
      {
        "data-ocid": "app.header",
        className: "sticky top-0 z-50 flex items-center justify-between border-b border-primary/20 bg-card px-4 py-3 shadow-lg shadow-black/20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/",
              "data-ocid": "app.logo_link",
              className: "flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold text-primary", children: "SP" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-base font-bold leading-tight", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "SP Mobile" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary block text-xs font-semibold tracking-wide", children: "Recharge App" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "wallet.balance_chip",
                className: "flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold text-primary", children: formatBalance(walletBalance) })
                ]
              }
            ),
            shortPrincipal && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                "data-ocid": "app.logout_button",
                onClick: logout,
                className: "flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground transition-smooth hover:border-destructive/40 hover:text-destructive",
                "aria-label": "Logout",
                type: "button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: shortPrincipal }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "×" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-auto pb-24", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "nav",
      {
        "data-ocid": "app.bottom_nav",
        className: "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-stretch", children: NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to,
              "data-ocid": `nav.${label.toLowerCase()}_tab`,
              className: `flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-smooth ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon,
                  {
                    className: `h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body", children: label }),
                isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 h-0.5 w-10 rounded-full bg-primary" })
              ]
            },
            to
          );
        }) })
      }
    )
  ] });
}
export {
  History as H,
  Layout as L
};
