import { Operator, PlanType } from "@/backend";
import { EmptyState } from "@/components/EmptyState";
import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { useProfile } from "@/hooks/use-profile";
import { OPERATOR_INFO, type PlanView, formatBalance } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle,
  Smartphone,
  Tv,
  Wifi,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MOBILE_OPERATORS = [
  Operator.jio,
  Operator.airtel,
  Operator.vi,
  Operator.bsnl,
];
const DTH_OPERATORS = [Operator.tataSky, Operator.dishTV];

type RechargeStep = "plans" | "form" | "result";
type ResultState = {
  success: boolean;
  txId?: string;
  message?: string;
};

export default function RechargePage() {
  const { isAuthenticated } = useAuth();
  const { walletBalance } = useProfile();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();

  const [planType, setPlanType] = useState<PlanType>(PlanType.mobile);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(
    null,
  );
  const [selectedPlan, setSelectedPlan] = useState<PlanView | null>(null);
  const [targetNumber, setTargetNumber] = useState("");
  const [numberError, setNumberError] = useState("");
  const [step, setStep] = useState<RechargeStep>("plans");
  const [result, setResult] = useState<ResultState | null>(null);

  const operators =
    planType === PlanType.mobile ? MOBILE_OPERATORS : DTH_OPERATORS;

  const { data: plans, isLoading: plansLoading } = useQuery<PlanView[]>({
    queryKey: ["active-plans", planType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivePlans(planType);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 60_000,
  });

  const rechargeMutation = useMutation({
    mutationFn: async (args: { planId: bigint; targetNumber: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.initiateRecharge(args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["my-transactions-home"] });
      queryClient.invalidateQueries({ queryKey: ["my-transactions-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["my-transactions-history"] });
    },
  });

  const filteredPlans =
    plans?.filter(
      (p) => !selectedOperator || p.operator === selectedOperator,
    ) ?? [];

  function validateNumber(): boolean {
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
        message: `Insufficient balance. You need ${formatBalance(selectedPlan.price)} but have ${formatBalance(walletBalance)}.`,
      });
      setStep("result");
      return;
    }
    try {
      const res = await rechargeMutation.mutateAsync({
        planId: selectedPlan.id,
        targetNumber,
      });
      if (res.__kind__ === "ok") {
        setResult({ success: true, txId: String(res.ok.id) });
        setStep("result");
        toast.success("Recharge successful!");
      } else if (res.__kind__ === "insufficientBalance") {
        setResult({
          success: false,
          message: "Insufficient wallet balance. Please top up and try again.",
        });
        setStep("result");
      } else if (
        res.__kind__ === "planNotFound" ||
        res.__kind__ === "planInactive"
      ) {
        setResult({
          success: false,
          message: "This plan is no longer available.",
        });
        setStep("result");
      } else {
        setResult({
          success: false,
          message:
            (res as { __kind__: "err"; err: string }).err ?? "Recharge failed.",
        });
        setStep("result");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Recharge failed.";
      toast.error(message);
    }
  }

  function resetFlow() {
    setStep("plans");
    setSelectedPlan(null);
    setTargetNumber("");
    setNumberError("");
    setResult(null);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md space-y-5 px-4 py-6">
        {/* Plan type tabs */}
        {step === "plans" && (
          <>
            <div
              data-ocid="recharge.type_tabs"
              className="flex rounded-xl border border-border bg-card p-1"
            >
              <button
                data-ocid="recharge.mobile_tab"
                type="button"
                onClick={() => {
                  setPlanType(PlanType.mobile);
                  setSelectedOperator(null);
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-smooth ${
                  planType === PlanType.mobile
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="h-4 w-4" /> Mobile
              </button>
              <button
                data-ocid="recharge.dth_tab"
                type="button"
                onClick={() => {
                  setPlanType(PlanType.dth);
                  setSelectedOperator(null);
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-smooth ${
                  planType === PlanType.dth
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Tv className="h-4 w-4" /> DTH
              </button>
            </div>

            {/* Operator filter chips */}
            <div
              data-ocid="recharge.operator_filters"
              className="flex flex-wrap gap-2"
            >
              <button
                data-ocid="recharge.operator_all"
                type="button"
                onClick={() => setSelectedOperator(null)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-smooth ${
                  selectedOperator === null
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                All
              </button>
              {operators.map((op) => (
                <button
                  key={op}
                  data-ocid={`recharge.operator_${op}`}
                  type="button"
                  onClick={() =>
                    setSelectedOperator(selectedOperator === op ? null : op)
                  }
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-smooth ${
                    selectedOperator === op
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {OPERATOR_INFO[op].name}
                </button>
              ))}
            </div>

            {/* Plans list */}
            {plansLoading ? (
              <div
                data-ocid="recharge.plans_loading_state"
                className="flex items-center justify-center py-12"
              >
                <Spinner size="md" />
              </div>
            ) : filteredPlans.length === 0 ? (
              <EmptyState
                icon={Wifi}
                title="No plans available"
                description="No active plans found for this selection. Try a different operator."
              />
            ) : (
              <div data-ocid="recharge.plans_list" className="space-y-3">
                {filteredPlans.map((plan, i) => {
                  const op = OPERATOR_INFO[plan.operator];
                  const isAffordable = walletBalance >= plan.price;
                  return (
                    <div
                      key={String(plan.id)}
                      data-ocid={`recharge.plan_card.${i + 1}`}
                      className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-smooth hover:border-primary/40"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${op.bgColor}`}
                      >
                        <span className="text-xs font-bold text-white">
                          {op.name.slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-sm font-semibold text-foreground">
                              {plan.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {op.name} · {Number(plan.validity)} days validity
                            </p>
                          </div>
                          <p className="font-mono text-base font-bold text-primary">
                            {formatBalance(plan.price)}
                          </p>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {plan.description}
                        </p>
                        {!isAffordable && (
                          <p className="mt-1 text-xs text-destructive">
                            Insufficient balance
                          </p>
                        )}
                        <Button
                          data-ocid={`recharge.select_plan_button.${i + 1}`}
                          size="sm"
                          className="mt-3 gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90"
                          disabled={!isAffordable}
                          onClick={() => {
                            setSelectedPlan(plan);
                            setStep("form");
                          }}
                        >
                          Recharge
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Recharge Form */}
        {step === "form" && selectedPlan && (
          <>
            <button
              data-ocid="recharge.back_button"
              type="button"
              onClick={() => setStep("plans")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-smooth hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to plans
            </button>

            {/* Plan summary */}
            <div
              data-ocid="recharge.plan_summary"
              className="rounded-xl border border-primary/30 bg-primary/10 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    {selectedPlan.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {OPERATOR_INFO[selectedPlan.operator].name} ·{" "}
                    {Number(selectedPlan.validity)} days
                  </p>
                </div>
                <p className="font-mono text-xl font-bold text-primary">
                  {formatBalance(selectedPlan.price)}
                </p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {selectedPlan.description}
              </p>
            </div>

            {/* Number input */}
            <div
              data-ocid="recharge.number_form"
              className="rounded-xl border border-border bg-card p-5"
            >
              <Label
                htmlFor="target-number"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                {planType === PlanType.mobile
                  ? "Mobile Number"
                  : "DTH Subscriber ID"}
              </Label>
              <Input
                id="target-number"
                data-ocid="recharge.target_number_input"
                type={planType === PlanType.mobile ? "tel" : "text"}
                placeholder={
                  planType === PlanType.mobile
                    ? "Enter 10-digit number"
                    : "Enter subscriber ID"
                }
                value={targetNumber}
                maxLength={planType === PlanType.mobile ? 10 : undefined}
                onChange={(e) => {
                  setTargetNumber(e.target.value);
                  if (numberError) setNumberError("");
                }}
                className={`border-border bg-secondary font-mono text-foreground placeholder:text-muted-foreground ${
                  numberError ? "border-destructive" : ""
                }`}
              />
              {numberError && (
                <p
                  data-ocid="recharge.number_field_error"
                  className="mt-1.5 text-xs text-destructive"
                >
                  {numberError}
                </p>
              )}

              {/* Balance check */}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                <span className="text-xs text-muted-foreground">
                  Wallet Balance
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {formatBalance(walletBalance)}
                </span>
              </div>

              <Button
                data-ocid="recharge.submit_button"
                className="mt-4 w-full gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                onClick={handleSubmitRecharge}
                disabled={rechargeMutation.isPending || !targetNumber}
              >
                {rechargeMutation.isPending ? (
                  <>
                    <Spinner size="sm" /> Processing...
                  </>
                ) : (
                  `Confirm Recharge — ${formatBalance(selectedPlan.price)}`
                )}
              </Button>
            </div>
          </>
        )}

        {/* Result Screen */}
        {step === "result" && result && (
          <div
            data-ocid="recharge.result_panel"
            className="flex flex-col items-center gap-6 py-10 text-center"
          >
            {result.success ? (
              <>
                <div
                  data-ocid="recharge.success_state"
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 ring-4 ring-accent/20"
                >
                  <CheckCircle className="h-10 w-10 text-accent" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Recharge Successful!
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your plan has been activated on {targetNumber}
                  </p>
                  {result.txId && (
                    <p className="mt-2 font-mono text-xs text-muted-foreground">
                      Transaction ID:{" "}
                      <span className="text-foreground">{result.txId}</span>
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div
                  data-ocid="recharge.error_state"
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/15 ring-4 ring-destructive/20"
                >
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Recharge Failed
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {result.message ??
                      "Something went wrong. Please try again."}
                  </p>
                </div>
              </>
            )}
            <div className="flex w-full gap-3">
              <Button
                data-ocid="recharge.try_again_button"
                variant="outline"
                className="flex-1"
                onClick={resetFlow}
              >
                {result.success ? "New Recharge" : "Try Again"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
