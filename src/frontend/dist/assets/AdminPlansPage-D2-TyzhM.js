import { a as useBackend, f as useQueryClient, r as reactExports, P as PlanType, O as Operator, b as useQuery, g as useMutation, j as jsxRuntimeExports, S as Spinner, d as ue } from "./index-DJqSJyUM.js";
import { A as AdminLayout, L as ListChecks } from "./AdminLayout-Dk4cUZpS.js";
import { E as EmptyState } from "./EmptyState-j5cN7fLp.js";
import { O as OPERATOR_INFO, a as formatBalance } from "./types-DAsELOtn.js";
import { P as Plus } from "./plus-BWv_hxTG.js";
import { c as createLucideIcon } from "./createLucideIcon-BDVopTHO.js";
import "./useLocation-B-5kwumH.js";
import "./shield-BaAX3Fi_.js";
import "./arrow-left-0p5opU2E.js";
import "./button-DFRBYKs0.js";
import "./index-DQpP8u8x.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "9", cy: "12", r: "3", key: "u3jwor" }],
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "7", key: "g7kal2" }]
];
const ToggleLeft = createLucideIcon("toggle-left", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "15", cy: "12", r: "3", key: "1afu0r" }],
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "7", key: "g7kal2" }]
];
const ToggleRight = createLucideIcon("toggle-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const OPERATORS = Object.values(Operator);
const PLAN_TYPES = Object.values(PlanType);
const BLANK_PLAN = {
  operator: Operator.jio,
  planType: PlanType.mobile,
  name: "",
  description: "",
  price: 0n,
  validity: 28n
};
function FormField({
  label,
  htmlFor,
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "label",
      {
        className: "mb-1 block text-xs font-medium text-muted-foreground",
        htmlFor,
        children: label
      }
    ),
    children
  ] });
}
const INPUT_CLASS = "w-full rounded-xl border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
function AdminPlansPage() {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [modal, setModal] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({ ...BLANK_PLAN });
  const [editForm, setEditForm] = reactExports.useState(null);
  const { data: plans, isLoading } = useQuery({
    queryKey: ["admin", "plans"],
    queryFn: async () => {
      if (!actor) return [];
      return [
        ...await actor.getActivePlans(PlanType.mobile),
        ...await actor.getActivePlans(PlanType.dth)
      ];
    },
    enabled: !!actor && !isFetching
  });
  const invalidatePlans = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
    queryClient.invalidateQueries({ queryKey: ["plans"] });
  };
  const createMutation = useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminCreatePlan(args);
    },
    onSuccess: () => {
      ue.success("Plan created successfully!");
      invalidatePlans();
      setModal(null);
      setForm({ ...BLANK_PLAN });
    },
    onError: (e) => ue.error("Failed to create plan", { description: e.message })
  });
  const updateMutation = useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminUpdatePlan(args);
    },
    onSuccess: () => {
      ue.success("Plan updated successfully!");
      invalidatePlans();
      setModal(null);
      setEditForm(null);
    },
    onError: (e) => ue.error("Failed to update plan", { description: e.message })
  });
  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminTogglePlan(id);
    },
    onSuccess: () => {
      ue.success("Plan status updated!");
      invalidatePlans();
    },
    onError: (e) => ue.error("Toggle failed", { description: e.message })
  });
  const openCreate = () => {
    setForm({ ...BLANK_PLAN });
    setModal({ kind: "create" });
  };
  const openEdit = (plan) => {
    setEditForm({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      validity: plan.validity
    });
    setModal({ kind: "edit", plan });
  };
  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editForm) return;
    updateMutation.mutate(editForm);
  };
  const isModalOpen = modal !== null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Plans Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            (plans ?? []).length,
            " total plans"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            "data-ocid": "admin.plans.add_plan_button",
            onClick: openCreate,
            className: "flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-smooth hover:bg-accent/20 active:scale-95",
            type: "button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "New Plan"
            ]
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) }) : !(plans == null ? void 0 : plans.length) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: ListChecks,
          title: "No plans yet",
          description: "Create your first recharge plan to get started.",
          action: { label: "Add Plan", onClick: openCreate }
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "admin.plans_list", className: "space-y-3", children: plans.map((plan, i) => {
        const op = OPERATOR_INFO[plan.operator];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `admin.plan_item.${i + 1}`,
            className: `flex items-center gap-4 rounded-2xl border p-4 transition-smooth ${plan.isActive ? "border-border bg-card" : "border-border/40 bg-card/50 opacity-60"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${op.bgColor} ${op.textColor}`,
                  children: op.name[0]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: plan.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  op.name,
                  " · ",
                  String(plan.validity),
                  " days ·",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: plan.planType })
                ] }),
                plan.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 line-clamp-1 text-[11px] text-muted-foreground/70", children: plan.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-base font-bold text-foreground", children: formatBalance(plan.price) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      "data-ocid": `admin.plan_edit_button.${i + 1}`,
                      onClick: () => openEdit(plan),
                      className: "flex items-center gap-1 rounded-lg border border-border bg-secondary px-2 py-1 text-[10px] font-medium text-muted-foreground transition-smooth hover:border-accent/40 hover:text-accent",
                      type: "button",
                      "aria-label": `Edit ${plan.name}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }),
                        "Edit"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      "data-ocid": `admin.plan_toggle_button.${i + 1}`,
                      onClick: () => toggleMutation.mutate(plan.id),
                      disabled: toggleMutation.isPending,
                      className: `flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase transition-smooth ${plan.isActive ? "bg-primary/15 text-primary hover:bg-primary/25" : "bg-muted text-muted-foreground hover:bg-secondary"}`,
                      type: "button",
                      children: [
                        plan.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleLeft, { className: "h-3 w-3" }),
                        plan.isActive ? "Active" : "Inactive"
                      ]
                    }
                  )
                ] })
              ] })
            ]
          },
          String(plan.id)
        );
      }) })
    ] }),
    isModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "admin.plans.dialog",
        className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center",
        onClick: (e) => {
          if (e.target === e.currentTarget) setModal(null);
        },
        onKeyDown: (e) => e.key === "Escape" && setModal(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-t-2xl border border-accent/20 bg-card p-5 shadow-2xl sm:rounded-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: modal.kind === "create" ? "Create New Plan" : "Edit Plan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                "data-ocid": "admin.plans.close_button",
                onClick: () => setModal(null),
                className: "flex h-7 w-7 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-smooth hover:border-border hover:text-foreground",
                type: "button",
                "aria-label": "Close modal",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          modal.kind === "create" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { "data-ocid": "admin.plans.create_form", onSubmit: handleCreate, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Operator", htmlFor: "plan-operator", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  "data-ocid": "admin.plans.operator_select",
                  id: "plan-operator",
                  value: form.operator,
                  onChange: (e) => setForm((f) => ({
                    ...f,
                    operator: e.target.value
                  })),
                  className: INPUT_CLASS,
                  children: OPERATORS.map((op) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: op, children: OPERATOR_INFO[op].name }, op))
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Plan Type", htmlFor: "plan-type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  "data-ocid": "admin.plans.type_select",
                  id: "plan-type",
                  value: form.planType,
                  onChange: (e) => setForm((f) => ({
                    ...f,
                    planType: e.target.value
                  })),
                  className: INPUT_CLASS,
                  children: PLAN_TYPES.map((pt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: pt, children: pt.charAt(0).toUpperCase() + pt.slice(1) }, pt))
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FormField,
                {
                  label: "Plan Name",
                  htmlFor: "plan-name",
                  className: "col-span-2",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      "data-ocid": "admin.plans.name_input",
                      id: "plan-name",
                      value: form.name,
                      onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
                      placeholder: "e.g. Unlimited 28 Days",
                      className: INPUT_CLASS
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FormField,
                {
                  label: "Description",
                  htmlFor: "plan-desc",
                  className: "col-span-2",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      "data-ocid": "admin.plans.description_input",
                      id: "plan-desc",
                      value: form.description,
                      onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
                      placeholder: "Unlimited calls + 1.5GB/day",
                      className: INPUT_CLASS
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Price (paise)", htmlFor: "plan-price", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  "data-ocid": "admin.plans.price_input",
                  id: "plan-price",
                  type: "number",
                  min: "0",
                  value: String(form.price),
                  onChange: (e) => setForm((f) => ({
                    ...f,
                    price: BigInt(e.target.value || "0")
                  })),
                  placeholder: "e.g. 27900",
                  className: `${INPUT_CLASS} font-mono`
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Validity (days)", htmlFor: "plan-validity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  "data-ocid": "admin.plans.validity_input",
                  id: "plan-validity",
                  type: "number",
                  min: "1",
                  value: String(form.validity),
                  onChange: (e) => setForm((f) => ({
                    ...f,
                    validity: BigInt(e.target.value || "1")
                  })),
                  className: `${INPUT_CLASS} font-mono`
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  "data-ocid": "admin.plans.create_submit_button",
                  type: "submit",
                  disabled: createMutation.isPending || !form.name,
                  className: "flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground shadow-md transition-smooth hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95",
                  children: [
                    createMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Spinner,
                      {
                        size: "sm",
                        className: "border-accent-foreground border-t-transparent"
                      }
                    ) : null,
                    "Create Plan"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  "data-ocid": "admin.plans.create_cancel_button",
                  type: "button",
                  onClick: () => setModal(null),
                  className: "rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground",
                  children: "Cancel"
                }
              )
            ] })
          ] }),
          modal.kind === "edit" && editForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { "data-ocid": "admin.plans.edit_form", onSubmit: handleUpdate, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${OPERATOR_INFO[modal.plan.operator].bgColor} ${OPERATOR_INFO[modal.plan.operator].textColor}`,
                  children: OPERATOR_INFO[modal.plan.operator].name[0]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                OPERATOR_INFO[modal.plan.operator].name,
                " ·",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: modal.plan.planType })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FormField,
                {
                  label: "Plan Name",
                  htmlFor: "edit-name",
                  className: "col-span-2",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      "data-ocid": "admin.plans.edit_name_input",
                      id: "edit-name",
                      value: editForm.name,
                      onChange: (e) => setEditForm((f) => f && { ...f, name: e.target.value }),
                      className: INPUT_CLASS
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FormField,
                {
                  label: "Description",
                  htmlFor: "edit-desc",
                  className: "col-span-2",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      "data-ocid": "admin.plans.edit_description_input",
                      id: "edit-desc",
                      value: editForm.description,
                      onChange: (e) => setEditForm(
                        (f) => f && { ...f, description: e.target.value }
                      ),
                      className: INPUT_CLASS
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Price (paise)", htmlFor: "edit-price", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  "data-ocid": "admin.plans.edit_price_input",
                  id: "edit-price",
                  type: "number",
                  min: "0",
                  value: String(editForm.price),
                  onChange: (e) => setEditForm(
                    (f) => f && { ...f, price: BigInt(e.target.value || "0") }
                  ),
                  className: `${INPUT_CLASS} font-mono`
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Validity (days)", htmlFor: "edit-validity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  "data-ocid": "admin.plans.edit_validity_input",
                  id: "edit-validity",
                  type: "number",
                  min: "1",
                  value: String(editForm.validity),
                  onChange: (e) => setEditForm(
                    (f) => f && {
                      ...f,
                      validity: BigInt(e.target.value || "1")
                    }
                  ),
                  className: `${INPUT_CLASS} font-mono`
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  "data-ocid": "admin.plans.edit_save_button",
                  type: "submit",
                  disabled: updateMutation.isPending || !editForm.name,
                  className: "flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground shadow-md transition-smooth hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95",
                  children: [
                    updateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Spinner,
                      {
                        size: "sm",
                        className: "border-accent-foreground border-t-transparent"
                      }
                    ) : null,
                    "Save Changes"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  "data-ocid": "admin.plans.edit_cancel_button",
                  type: "button",
                  onClick: () => setModal(null),
                  className: "rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground",
                  children: "Cancel"
                }
              )
            ] })
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminPlansPage as default
};
