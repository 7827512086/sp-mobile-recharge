import { BillCategory } from "@/backend";
import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { useProfile } from "@/hooks/use-profile";
import type { BillRecord } from "@/types";
import {
  formatBalance,
  formatTimestamp,
  getBillCategoryIcon,
  getBillCategoryLabel,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReceiptText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const BILL_CATEGORIES: { value: BillCategory; label: string; desc: string }[] =
  [
    {
      value: BillCategory.electricity,
      label: "Electricity",
      desc: "DISCOM / state boards",
    },
    {
      value: BillCategory.water,
      label: "Water",
      desc: "Municipal water board",
    },
    { value: BillCategory.gas, label: "Gas", desc: "PNG / piped gas" },
    {
      value: BillCategory.internet,
      label: "Internet",
      desc: "Broadband / fiber",
    },
  ];

export default function BillsPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const { walletBalance, refetch: refetchProfile } = useProfile();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<BillCategory>(
    BillCategory.electricity,
  );
  const [billerId, setBillerId] = useState("");
  const [amountRupees, setAmountRupees] = useState("");

  const { data: bills, isLoading } = useQuery<BillRecord[]>({
    queryKey: ["bill-payments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBillPayments();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 30_000,
  });

  const billMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const amountPaisa = BigInt(
        Math.round(Number.parseFloat(amountRupees) * 100),
      );
      const result = await actor.payBill(
        selectedCategory,
        billerId.trim(),
        amountPaisa,
      );
      if (result.__kind__ === "insufficientBalance")
        throw new Error("Insufficient balance");
      if (result.__kind__ === "userNotFound") throw new Error("User not found");
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      toast.success("Bill paid successfully!");
      setBillerId("");
      setAmountRupees("");
      queryClient.invalidateQueries({ queryKey: ["bill-payments"] });
      refetchProfile();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const canSubmit =
    billerId.trim().length > 0 &&
    Number.parseFloat(amountRupees) > 0 &&
    !billMutation.isPending;

  return (
    <Layout>
      <div className="mx-auto max-w-md space-y-6 px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
            <ReceiptText className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Bill Payment
            </h1>
            <p className="text-xs text-muted-foreground">
              Pay electricity, water, gas & internet bills
            </p>
          </div>
        </div>

        {/* Balance */}
        <div
          data-ocid="bills.balance_chip"
          className="flex items-center justify-between rounded-xl border border-primary/25 bg-primary/10 px-4 py-3"
        >
          <span className="text-sm text-muted-foreground">
            Available Balance
          </span>
          <span className="font-mono text-lg font-bold text-primary">
            {formatBalance(walletBalance)}
          </span>
        </div>

        {/* Category selector */}
        <div
          className="grid grid-cols-2 gap-3"
          data-ocid="bills.category_section"
        >
          {BILL_CATEGORIES.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              data-ocid={`bills.category.${value}`}
              onClick={() => setSelectedCategory(value)}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-smooth ${
                selectedCategory === value
                  ? "border-accent/50 bg-accent/10 ring-1 ring-accent/30"
                  : "border-border bg-card hover:border-accent/30"
              }`}
            >
              <span className="text-2xl">{getBillCategoryIcon(value)}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Pay form */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg">
          <h2 className="mb-4 font-display text-sm font-semibold text-foreground">
            Pay {getBillCategoryLabel(selectedCategory)} Bill
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="biller-id"
                className="text-xs font-medium text-muted-foreground"
              >
                Consumer / Account Number
              </Label>
              <Input
                id="biller-id"
                data-ocid="bills.biller_id_input"
                placeholder="Enter your consumer number"
                value={billerId}
                onChange={(e) => setBillerId(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="bill-amount"
                className="text-xs font-medium text-muted-foreground"
              >
                Amount (₹)
              </Label>
              <Input
                id="bill-amount"
                data-ocid="bills.amount_input"
                type="number"
                min="1"
                step="1"
                placeholder="0.00"
                value={amountRupees}
                onChange={(e) => setAmountRupees(e.target.value)}
              />
            </div>
            <Button
              data-ocid="bills.pay_submit_button"
              onClick={() => billMutation.mutate()}
              disabled={!canSubmit}
              className="w-full gap-2"
            >
              {billMutation.isPending ? (
                <>
                  <Spinner
                    size="sm"
                    className="border-primary-foreground border-t-transparent"
                  />{" "}
                  Processing…
                </>
              ) : (
                <>
                  <ReceiptText className="h-4 w-4" /> Pay Bill
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Payment history */}
        <section data-ocid="bills.history_section">
          <h2 className="mb-3 font-display text-base font-semibold text-foreground">
            Payment History
          </h2>
          {isLoading ? (
            <div
              data-ocid="bills.loading_state"
              className="flex justify-center py-10"
            >
              <Spinner size="md" />
            </div>
          ) : !bills?.length ? (
            <div
              data-ocid="bills.empty_state"
              className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card/60 py-10 text-center"
            >
              <ReceiptText className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                No bills paid yet
              </p>
              <p className="text-xs text-muted-foreground/70">
                Your payment history will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {bills.map((bill, i) => (
                <div
                  key={String(bill.id)}
                  data-ocid={`bills.history_item.${i + 1}`}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-lg">
                    {getBillCategoryIcon(bill.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {getBillCategoryLabel(bill.category)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      Acc: {bill.billerId} · {formatTimestamp(bill.timestamp)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      -{formatBalance(bill.amount)}
                    </span>
                    <Badge
                      className={`rounded-md px-1.5 py-0 text-[10px] ${
                        bill.status === "success"
                          ? "bg-accent/15 text-accent"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {String(bill.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
