import { u as useAuth, c as useProfile, a as useBackend, f as useQueryClient, r as reactExports, P as PlanType, b as useQuery, g as useMutation, j as jsxRuntimeExports, O as Operator, S as Spinner, d as ue } from "./index-DJqSJyUM.js";
import { E as EmptyState } from "./EmptyState-j5cN7fLp.js";
import { L as Layout } from "./Layout-cnp0RluJ.js";
import { B as Button } from "./button-DFRBYKs0.js";
import { L as Label, I as Input } from "./label-BdFXT_5g.js";
import { O as OPERATOR_INFO, a as formatBalance } from "./types-DAsELOtn.js";
import { S as Smartphone } from "./smartphone-C7OPvBHe.js";
import { T as Tv } from "./tv-BzU4w0YV.js";
import { c as createLucideIcon } from "./createLucideIcon-BDVopTHO.js";
import { A as ArrowLeft } from "./arrow-left-0p5opU2E.js";
import "./useLocation-B-5kwumH.js";
import "./index-DQpP8u8x.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
const MOBILE_OPERATORS = [
  Operator.jio,
  Operator.airtel,
  Operator.vi,
  Operator.bsnl
];
const DTH_OPERATORS = [Operator.tataSky, Operator.dishTV];
function RechargePage() {
  const { isAuthenticated } = useAuth();
  const { walletBalance } = useProfile();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [planType, setPlanType] = reactExports.useState(PlanType.mobile);
  const [selectedOperator, setSelectedOperator] = reactExports.useState(
    null
  );
  const [selectedPlan, setSelectedPlan] = reactExports.useState(null);
  const [targetNumber, setTargetNumber] = reactExports.useState("");
  const [numberError, setNumberError] = reactExports.useState("");
  const [step, setStep] = reactExports.useState("plans");
  const [result, setResult] = reactExports.useState(null);
  const operators = planType === PlanType.mobile ? MOBILE_OPERATORS : DTH_OPERATORS;
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["active-plans", planType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivePlans(planType);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 6e4
  });
  const rechargeMutation = useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.initiateRecharge(args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["my-transactions-home"] });
      queryClient.invalidateQueries({ queryKey: ["my-transactions-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["my-transactions-history"] });
    }
  });
  const filteredPlans = (plans == null ? void 0 : plans.filter(
    (p) => !selectedOperator || p.operator === selectedOperator
  )) ?? [];
  function validateNumber() {
    if (planType === PlanType.mobile) {
      if (!/^[6-9]\d{9}$/.test(targetNumber)) {
        setNumberError("Enter a valid 10-digit mobile number");
        return false;
      }
    } else {
      if (!targetNumber.trim()) {
        setNumberError("DTH subscriber ID is required");
        return false;
      }
    }
    setNumberError("");
    return true;
  }
  async function handleSubmitRecharge() {
    if (!selectedPlan || !validateNumber()) return;
    if (walletBalance < selectedPlan.price) {
      setResult({
        success: false,
        message: `Insufficient balance. You need ${formatBalance(selectedPlan.price)} but have ${formatBalance(walletBalance)}.`
      });
      setStep("result");
      return;
    }
    try {
      const res = await rechargeMutation.mutateAsync({
        planId: selectedPlan.id,
        targetNumber
      });
      if (res.__kind__ === "ok") {
        setResult({ success: true, txId: String(res.ok.id) });
        setStep("result");
        ue.success("Recharge successful!");
      } else if (res.__kind__ === "insufficientBalance") {
        setResult({
          success: false,
          message: "Insufficient wallet balance. Please top up and try again."
        });
        setStep("result");
      } else if (res.__kind__ === "planNotFound" || res.__kind__ === "planInactive") {
        setResult({
          success: false,
          message: "This plan is no longer available."
        });
        setStep("result");
      } else {
        setResult({
          success: false,
          message: res.err ?? "Recharge failed."
        });
        setStep("result");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Recharge failed.";
      ue.error(message);
    }
  }
  function resetFlow() {
    setStep("plans");
    setSelectedPlan(null);
    setTargetNumber("");
    setNumberError("");
    setResult(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md space-y-5 px-4 py-6", children: [
    step === "plans" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "recharge.type_tabs",
          className: "flex rounded-xl border border-border bg-card p-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                "data-ocid": "recharge.mobile_tab",
                type: "button",
                onClick: () => {
                  setPlanType(PlanType.mobile);
                  setSelectedOperator(null);
                },
                className: `flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-smooth ${planType === PlanType.mobile ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" }),
                  " Mobile"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                "data-ocid": "recharge.dth_tab",
                type: "button",
                onClick: () => {
                  setPlanType(PlanType.dth);
                  setSelectedOperator(null);
                },
                className: `flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-smooth ${planType === PlanType.dth ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "h-4 w-4" }),
                  " DTH"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "recharge.operator_filters",
          className: "flex flex-wrap gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                "data-ocid": "recharge.operator_all",
                type: "button",
                onClick: () => setSelectedOperator(null),
                className: `rounded-full border px-4 py-1.5 text-xs font-semibold transition-smooth ${selectedOperator === null ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
                children: "All"
              }
            ),
            operators.map((op) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                "data-ocid": `recharge.operator_${op}`,
                type: "button",
                onClick: () => setSelectedOperator(selectedOperator === op ? null : op),
                className: `rounded-full border px-4 py-1.5 text-xs font-semibold transition-smooth ${selectedOperator === op ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
                children: OPERATOR_INFO[op].name
              },
              op
            ))
          ]
        }
      ),
      plansLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "recharge.plans_loading_state",
          className: "flex items-center justify-center py-12",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "md" })
        }
      ) : filteredPlans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: Wifi,
          title: "No plans available",
          description: "No active plans found for this selection. Try a different operator."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "recharge.plans_list", className: "space-y-3", children: filteredPlans.map((plan, i) => {
        const op = OPERATOR_INFO[plan.operator];
        const isAffordable = walletBalance >= plan.price;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `recharge.plan_card.${i + 1}`,
            className: "flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-smooth hover:border-primary/40",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${op.bgColor}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white", children: op.name.slice(0, 2) })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold text-foreground", children: plan.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      op.name,
                      " · ",
                      Number(plan.validity),
                      " days validity"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-base font-bold text-primary", children: formatBalance(plan.price) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2 text-xs text-muted-foreground", children: plan.description }),
                !isAffordable && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: "Insufficient balance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `recharge.select_plan_button.${i + 1}`,
                    size: "sm",
                    className: "mt-3 gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90",
                    disabled: !isAffordable,
                    onClick: () => {
                      setSelectedPlan(plan);
                      setStep("form");
                    },
                    children: "Recharge"
                  }
                )
              ] })
            ]
          },
          String(plan.id)
        );
      }) })
    ] }),
    step === "form" && selectedPlan && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          "data-ocid": "recharge.back_button",
          type: "button",
          onClick: () => setStep("plans"),
          className: "flex items-center gap-1.5 text-sm text-muted-foreground transition-smooth hover:text-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            " Back to plans"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "recharge.plan_summary",
          className: "rounded-xl border border-primary/30 bg-primary/10 p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold text-foreground", children: selectedPlan.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  OPERATOR_INFO[selectedPlan.operator].name,
                  " ·",
                  " ",
                  Number(selectedPlan.validity),
                  " days"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xl font-bold text-primary", children: formatBalance(selectedPlan.price) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: selectedPlan.description })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "recharge.number_form",
          className: "rounded-xl border border-border bg-card p-5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "target-number",
                className: "mb-1.5 block text-sm font-medium text-foreground",
                children: planType === PlanType.mobile ? "Mobile Number" : "DTH Subscriber ID"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "target-number",
                "data-ocid": "recharge.target_number_input",
                type: planType === PlanType.mobile ? "tel" : "text",
                placeholder: planType === PlanType.mobile ? "Enter 10-digit number" : "Enter subscriber ID",
                value: targetNumber,
                maxLength: planType === PlanType.mobile ? 10 : void 0,
                onChange: (e) => {
                  setTargetNumber(e.target.value);
                  if (numberError) setNumberError("");
                },
                className: `border-border bg-secondary font-mono text-foreground placeholder:text-muted-foreground ${numberError ? "border-destructive" : ""}`
              }
            ),
            numberError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "recharge.number_field_error",
                className: "mt-1.5 text-xs text-destructive",
                children: numberError
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between rounded-lg bg-secondary px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Wallet Balance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold text-foreground", children: formatBalance(walletBalance) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "recharge.submit_button",
                className: "mt-4 w-full gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
                onClick: handleSubmitRecharge,
                disabled: rechargeMutation.isPending || !targetNumber,
                children: rechargeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "sm" }),
                  " Processing..."
                ] }) : `Confirm Recharge — ${formatBalance(selectedPlan.price)}`
              }
            )
          ]
        }
      )
    ] }),
    step === "result" && result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "recharge.result_panel",
        className: "flex flex-col items-center gap-6 py-10 text-center",
        children: [
          result.success ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": "recharge.success_state",
                className: "flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 ring-4 ring-accent/20",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-10 w-10 text-accent" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Recharge Successful!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
                "Your plan has been activated on ",
                targetNumber
              ] }),
              result.txId && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 font-mono text-xs text-muted-foreground", children: [
                "Transaction ID:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: result.txId })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": "recharge.error_state",
                className: "flex h-20 w-20 items-center justify-center rounded-full bg-destructive/15 ring-4 ring-destructive/20",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-10 w-10 text-destructive" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Recharge Failed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: result.message ?? "Something went wrong. Please try again." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex w-full gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "recharge.try_again_button",
              variant: "outline",
              className: "flex-1",
              onClick: resetFlow,
              children: result.success ? "New Recharge" : "Try Again"
            }
          ) })
        ]
      }
    )
  ] }) });
}
export {
  RechargePage as default
};
