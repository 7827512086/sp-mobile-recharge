import { Operator, PlanType } from "@/backend";
import { AdminLayout } from "@/components/AdminLayout";
import { EmptyState } from "@/components/EmptyState";
import { Spinner } from "@/components/Spinner";
import { useBackend } from "@/hooks/use-backend";
import type { CreatePlanArgs, PlanView, UpdatePlanArgs } from "@/types";
import { OPERATOR_INFO, formatBalance } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ListChecks,
  Pencil,
  Plus,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const OPERATORS = Object.values(Operator);
const PLAN_TYPES = Object.values(PlanType);

const BLANK_PLAN: CreatePlanArgs = {
  operator: Operator.jio,
  planType: PlanType.mobile,
  name: "",
  description: "",
  price: 0n,
  validity: 28n,
};

type ModalMode = { kind: "create" } | { kind: "edit"; plan: PlanView };

function FormField({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        className="mb-1 block text-xs font-medium text-muted-foreground"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const INPUT_CLASS =
  "w-full rounded-xl border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export default function AdminPlansPage() {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalMode | null>(null);
  const [form, setForm] = useState<CreatePlanArgs>({ ...BLANK_PLAN });
  const [editForm, setEditForm] = useState<UpdatePlanArgs | null>(null);

  const { data: plans, isLoading } = useQuery<PlanView[]>({
    queryKey: ["admin", "plans"],
    queryFn: async () => {
      if (!actor) return [];
      return [
        ...(await actor.getActivePlans(PlanType.mobile)),
        ...(await actor.getActivePlans(PlanType.dth)),
      ];
    },
    enabled: !!actor && !isFetching,
  });

  const invalidatePlans = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
    queryClient.invalidateQueries({ queryKey: ["plans"] });
  };

  const createMutation = useMutation({
    mutationFn: async (args: CreatePlanArgs) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminCreatePlan(args);
    },
    onSuccess: () => {
      toast.success("Plan created successfully!");
      invalidatePlans();
      setModal(null);
      setForm({ ...BLANK_PLAN });
    },
    onError: (e: Error) =>
      toast.error("Failed to create plan", { description: e.message }),
  });

  const updateMutation = useMutation({
    mutationFn: async (args: UpdatePlanArgs) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminUpdatePlan(args);
    },
    onSuccess: () => {
      toast.success("Plan updated successfully!");
      invalidatePlans();
      setModal(null);
      setEditForm(null);
    },
    onError: (e: Error) =>
      toast.error("Failed to update plan", { description: e.message }),
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminTogglePlan(id);
    },
    onSuccess: () => {
      toast.success("Plan status updated!");
      invalidatePlans();
    },
    onError: (e: Error) =>
      toast.error("Toggle failed", { description: e.message }),
  });

  const openCreate = () => {
    setForm({ ...BLANK_PLAN });
    setModal({ kind: "create" });
  };

  const openEdit = (plan: PlanView) => {
    setEditForm({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      validity: plan.validity,
    });
    setModal({ kind: "edit", plan });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    updateMutation.mutate(editForm);
  };

  const isModalOpen = modal !== null;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Plans Management
            </h1>
            <p className="text-xs text-muted-foreground">
              {(plans ?? []).length} total plans
            </p>
          </div>
          <button
            data-ocid="admin.plans.add_plan_button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-smooth hover:bg-accent/20 active:scale-95"
            type="button"
          >
            <Plus className="h-4 w-4" />
            New Plan
          </button>
        </div>

        {/* Plans list */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : !plans?.length ? (
          <EmptyState
            icon={ListChecks}
            title="No plans yet"
            description="Create your first recharge plan to get started."
            action={{ label: "Add Plan", onClick: openCreate }}
          />
        ) : (
          <div data-ocid="admin.plans_list" className="space-y-3">
            {plans.map((plan, i) => {
              const op = OPERATOR_INFO[plan.operator as Operator];
              return (
                <div
                  key={String(plan.id)}
                  data-ocid={`admin.plan_item.${i + 1}`}
                  className={`flex items-center gap-4 rounded-2xl border p-4 transition-smooth ${
                    plan.isActive
                      ? "border-border bg-card"
                      : "border-border/40 bg-card/50 opacity-60"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${op.bgColor} ${op.textColor}`}
                  >
                    {op.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{plan.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {op.name} · {String(plan.validity)} days ·{" "}
                      <span className="capitalize">{plan.planType}</span>
                    </p>
                    {plan.description && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground/70">
                        {plan.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-mono text-base font-bold text-foreground">
                      {formatBalance(plan.price)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        data-ocid={`admin.plan_edit_button.${i + 1}`}
                        onClick={() => openEdit(plan)}
                        className="flex items-center gap-1 rounded-lg border border-border bg-secondary px-2 py-1 text-[10px] font-medium text-muted-foreground transition-smooth hover:border-accent/40 hover:text-accent"
                        type="button"
                        aria-label={`Edit ${plan.name}`}
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        data-ocid={`admin.plan_toggle_button.${i + 1}`}
                        onClick={() => toggleMutation.mutate(plan.id)}
                        disabled={toggleMutation.isPending}
                        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase transition-smooth ${
                          plan.isActive
                            ? "bg-primary/15 text-primary hover:bg-primary/25"
                            : "bg-muted text-muted-foreground hover:bg-secondary"
                        }`}
                        type="button"
                      >
                        {plan.isActive ? (
                          <ToggleRight className="h-3 w-3" />
                        ) : (
                          <ToggleLeft className="h-3 w-3" />
                        )}
                        {plan.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          data-ocid="admin.plans.dialog"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
          onKeyDown={(e) => e.key === "Escape" && setModal(null)}
        >
          <div className="w-full max-w-md rounded-t-2xl border border-accent/20 bg-card p-5 shadow-2xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-foreground">
                {modal.kind === "create" ? "Create New Plan" : "Edit Plan"}
              </h2>
              <button
                data-ocid="admin.plans.close_button"
                onClick={() => setModal(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-smooth hover:border-border hover:text-foreground"
                type="button"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Create Form */}
            {modal.kind === "create" && (
              <form data-ocid="admin.plans.create_form" onSubmit={handleCreate}>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Operator" htmlFor="plan-operator">
                    <select
                      data-ocid="admin.plans.operator_select"
                      id="plan-operator"
                      value={form.operator}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          operator: e.target.value as Operator,
                        }))
                      }
                      className={INPUT_CLASS}
                    >
                      {OPERATORS.map((op) => (
                        <option key={op} value={op}>
                          {OPERATOR_INFO[op].name}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Plan Type" htmlFor="plan-type">
                    <select
                      data-ocid="admin.plans.type_select"
                      id="plan-type"
                      value={form.planType}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          planType: e.target.value as PlanType,
                        }))
                      }
                      className={INPUT_CLASS}
                    >
                      {PLAN_TYPES.map((pt) => (
                        <option key={pt} value={pt}>
                          {pt.charAt(0).toUpperCase() + pt.slice(1)}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField
                    label="Plan Name"
                    htmlFor="plan-name"
                    className="col-span-2"
                  >
                    <input
                      data-ocid="admin.plans.name_input"
                      id="plan-name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="e.g. Unlimited 28 Days"
                      className={INPUT_CLASS}
                    />
                  </FormField>
                  <FormField
                    label="Description"
                    htmlFor="plan-desc"
                    className="col-span-2"
                  >
                    <input
                      data-ocid="admin.plans.description_input"
                      id="plan-desc"
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      placeholder="Unlimited calls + 1.5GB/day"
                      className={INPUT_CLASS}
                    />
                  </FormField>
                  <FormField label="Price (paise)" htmlFor="plan-price">
                    <input
                      data-ocid="admin.plans.price_input"
                      id="plan-price"
                      type="number"
                      min="0"
                      value={String(form.price)}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          price: BigInt(e.target.value || "0"),
                        }))
                      }
                      placeholder="e.g. 27900"
                      className={`${INPUT_CLASS} font-mono`}
                    />
                  </FormField>
                  <FormField label="Validity (days)" htmlFor="plan-validity">
                    <input
                      data-ocid="admin.plans.validity_input"
                      id="plan-validity"
                      type="number"
                      min="1"
                      value={String(form.validity)}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          validity: BigInt(e.target.value || "1"),
                        }))
                      }
                      className={`${INPUT_CLASS} font-mono`}
                    />
                  </FormField>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    data-ocid="admin.plans.create_submit_button"
                    type="submit"
                    disabled={createMutation.isPending || !form.name}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground shadow-md transition-smooth hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                  >
                    {createMutation.isPending ? (
                      <Spinner
                        size="sm"
                        className="border-accent-foreground border-t-transparent"
                      />
                    ) : null}
                    Create Plan
                  </button>
                  <button
                    data-ocid="admin.plans.create_cancel_button"
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Edit Form */}
            {modal.kind === "edit" && editForm && (
              <form data-ocid="admin.plans.edit_form" onSubmit={handleUpdate}>
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      OPERATOR_INFO[modal.plan.operator as Operator].bgColor
                    } ${OPERATOR_INFO[modal.plan.operator as Operator].textColor}`}
                  >
                    {OPERATOR_INFO[modal.plan.operator as Operator].name[0]}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {OPERATOR_INFO[modal.plan.operator as Operator].name} ·{" "}
                    <span className="capitalize">{modal.plan.planType}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Plan Name"
                    htmlFor="edit-name"
                    className="col-span-2"
                  >
                    <input
                      data-ocid="admin.plans.edit_name_input"
                      id="edit-name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((f) => f && { ...f, name: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </FormField>
                  <FormField
                    label="Description"
                    htmlFor="edit-desc"
                    className="col-span-2"
                  >
                    <input
                      data-ocid="admin.plans.edit_description_input"
                      id="edit-desc"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm(
                          (f) => f && { ...f, description: e.target.value },
                        )
                      }
                      className={INPUT_CLASS}
                    />
                  </FormField>
                  <FormField label="Price (paise)" htmlFor="edit-price">
                    <input
                      data-ocid="admin.plans.edit_price_input"
                      id="edit-price"
                      type="number"
                      min="0"
                      value={String(editForm.price)}
                      onChange={(e) =>
                        setEditForm(
                          (f) =>
                            f && { ...f, price: BigInt(e.target.value || "0") },
                        )
                      }
                      className={`${INPUT_CLASS} font-mono`}
                    />
                  </FormField>
                  <FormField label="Validity (days)" htmlFor="edit-validity">
                    <input
                      data-ocid="admin.plans.edit_validity_input"
                      id="edit-validity"
                      type="number"
                      min="1"
                      value={String(editForm.validity)}
                      onChange={(e) =>
                        setEditForm(
                          (f) =>
                            f && {
                              ...f,
                              validity: BigInt(e.target.value || "1"),
                            },
                        )
                      }
                      className={`${INPUT_CLASS} font-mono`}
                    />
                  </FormField>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    data-ocid="admin.plans.edit_save_button"
                    type="submit"
                    disabled={updateMutation.isPending || !editForm.name}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground shadow-md transition-smooth hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                  >
                    {updateMutation.isPending ? (
                      <Spinner
                        size="sm"
                        className="border-accent-foreground border-t-transparent"
                      />
                    ) : null}
                    Save Changes
                  </button>
                  <button
                    data-ocid="admin.plans.edit_cancel_button"
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
