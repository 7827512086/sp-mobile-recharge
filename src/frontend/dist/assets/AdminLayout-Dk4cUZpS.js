import { u as useAuth, j as jsxRuntimeExports, L as Link } from "./index-DJqSJyUM.js";
import { u as useLocation } from "./useLocation-B-5kwumH.js";
import { S as Shield } from "./shield-BaAX3Fi_.js";
import { A as ArrowLeft } from "./arrow-left-0p5opU2E.js";
import { c as createLucideIcon } from "./createLucideIcon-BDVopTHO.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m3 17 2 2 4-4", key: "1jhpwq" }],
  ["path", { d: "m3 7 2 2 4-4", key: "1obspn" }],
  ["path", { d: "M13 6h8", key: "15sg57" }],
  ["path", { d: "M13 12h8", key: "h98zly" }],
  ["path", { d: "M13 18h8", key: "oe0vm4" }]
];
const ListChecks = createLucideIcon("list-checks", __iconNode$1);
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
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode);
const ADMIN_NAV = [
  { to: "/admin", icon: LayoutGrid, label: "Overview" },
  { to: "/admin/plans", icon: ListChecks, label: "Plans" },
  { to: "/admin/analytics", icon: ChartColumn, label: "Analytics" },
  { to: "/admin/reports", icon: FileText, label: "Reports" },
  { to: "/admin/settings", icon: Settings, label: "Settings" }
];
function AdminLayout({ children }) {
  const location = useLocation();
  const { principal, logout } = useAuth();
  const shortPrincipal = principal ? `${principal.slice(0, 5)}...${principal.slice(-4)}` : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "header",
      {
        "data-ocid": "admin.header",
        className: "sticky top-0 z-50 flex items-center justify-between border-b border-accent/30 bg-card px-4 py-3 shadow-lg shadow-black/20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 ring-1 ring-accent/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-accent" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-base font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "SP Mobile" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: " Recharge" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-xs font-semibold text-accent", children: "ADMIN" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/",
                "data-ocid": "admin.back_to_user_link",
                className: "flex items-center gap-1 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground transition-smooth hover:text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "User View" })
                ]
              }
            ),
            shortPrincipal && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                "data-ocid": "admin.logout_button",
                onClick: logout,
                className: "flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground transition-smooth hover:border-destructive/40 hover:text-destructive",
                "aria-label": "Logout",
                type: "button",
                children: [
                  shortPrincipal,
                  " ×"
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "aside",
        {
          "data-ocid": "admin.sidebar",
          className: "hidden w-56 shrink-0 border-r border-border bg-card/60 md:flex md:flex-col",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col gap-1 p-3 pt-4", children: ADMIN_NAV.map(({ to, icon: Icon, label }) => {
            const isActive = to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(to);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to,
                "data-ocid": `admin.nav.${label.toLowerCase()}_link`,
                className: `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-smooth ${isActive ? "bg-accent/15 text-accent ring-1 ring-accent/25" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
                  label
                ]
              },
              to
            );
          }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-auto pb-20", children })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "nav",
      {
        "data-ocid": "admin.bottom_nav",
        className: "fixed bottom-0 left-0 right-0 z-50 border-t border-accent/20 bg-card/95 backdrop-blur-md md:hidden",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-stretch", children: ADMIN_NAV.map(({ to, icon: Icon, label }) => {
          const isActive = to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(to);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to,
              "data-ocid": `admin.mobile_nav.${label.toLowerCase()}_tab`,
              className: `flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-smooth ${isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon,
                  {
                    className: `h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
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
  AdminLayout as A,
  ChartColumn as C,
  FileText as F,
  ListChecks as L,
  Settings as S
};
