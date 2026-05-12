import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { useProfile } from "@/hooks/use-profile";
import type { TransferRecord } from "@/types";
import { formatBalance, formatTimestamp } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function TransferPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, principal } = useAuth();
  const { walletBalance, refetch: refetchProfile } = useProfile();
  const queryClient = useQueryClient();

  const [recipient, setRecipient] = useState("");
  const [amountRupees, setAmountRupees] = useState("");
  const [note, setNote] = useState("");

  const { data: history, isLoading } = useQuery<TransferRecord[]>({
    queryKey: ["transfer-history"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransferHistory();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 30_000,
  });

  const transferMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const { Principal } = await import("@icp-sdk/core/principal");
      const amountPaisa = BigInt(
        Math.round(Number.parseFloat(amountRupees) * 100),
      );
      const result = await actor.transferFunds(
        Principal.fromText(recipient.trim()),
        amountPaisa,
        note.trim(),
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
      toast.success("Transfer successful!");
      setRecipient("");
      setAmountRupees("");
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["transfer-history"] });
      refetchProfile();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const canSubmit =
    recipient.trim().length > 5 &&
    Number.parseFloat(amountRupees) > 0 &&
    !transferMutation.isPending;

  return (
    <Layout>
      <div className="mx-auto max-w-md space-y-6 px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
            <ArrowLeftRight className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Money Transfer
            </h1>
            <p className="text-xs text-muted-foreground">
              Send funds instantly to any user
            </p>
          </div>
        </div>

        {/* Balance chip */}
        <div
          data-ocid="transfer.balance_chip"
          className="flex items-center justify-between rounded-xl border border-primary/25 bg-primary/10 px-4 py-3"
        >
          <span className="text-sm text-muted-foreground">
            Available Balance
          </span>
          <span className="font-mono text-lg font-bold text-primary">
            {formatBalance(walletBalance)}
          </span>
        </div>

        {/* Transfer form */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg">
          <h2 className="mb-4 font-display text-sm font-semibold text-foreground">
            New Transfer
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="transfer-recipient"
                className="text-xs font-medium text-muted-foreground"
              >
                Recipient Principal ID
              </Label>
              <Input
                id="transfer-recipient"
                data-ocid="transfer.recipient_input"
                placeholder="xxxxx-xxxxx-..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="transfer-amount"
                className="text-xs font-medium text-muted-foreground"
              >
                Amount (₹)
              </Label>
              <Input
                id="transfer-amount"
                data-ocid="transfer.amount_input"
                type="number"
                min="1"
                step="1"
                placeholder="0.00"
                value={amountRupees}
                onChange={(e) => setAmountRupees(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="transfer-note"
                className="text-xs font-medium text-muted-foreground"
              >
                Note (optional)
              </Label>
              <Input
                id="transfer-note"
                data-ocid="transfer.note_input"
                placeholder="What's it for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={100}
              />
            </div>

            <Button
              data-ocid="transfer.submit_button"
              onClick={() => transferMutation.mutate()}
              disabled={!canSubmit}
              className="w-full gap-2"
            >
              {transferMutation.isPending ? (
                <>
                  <Spinner
                    size="sm"
                    className="border-primary-foreground border-t-transparent"
                  />{" "}
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Money
                </>
              )}
            </Button>
          </div>
        </div>

        {/* History */}
        <section data-ocid="transfer.history_section">
          <h2 className="mb-3 font-display text-base font-semibold text-foreground">
            Transfer History
          </h2>

          {isLoading ? (
            <div
              data-ocid="transfer.loading_state"
              className="flex justify-center py-10"
            >
              <Spinner size="md" />
            </div>
          ) : !history?.length ? (
            <div
              data-ocid="transfer.empty_state"
              className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card/60 py-10 text-center"
            >
              <ArrowLeftRight className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                No transfers yet
              </p>
              <p className="text-xs text-muted-foreground/70">
                Your sent and received transfers will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {history.map((tx, i) => {
                const isSender = tx.senderId.toString() === principal;
                return (
                  <div
                    key={String(tx.id)}
                    data-ocid={`transfer.history_item.${i + 1}`}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isSender ? "bg-destructive/15" : "bg-accent/15"
                      }`}
                    >
                      {isSender ? (
                        <ArrowUpRight className="h-4 w-4 text-destructive" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-accent" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {isSender ? "Sent" : "Received"}
                        {tx.note ? ` · ${tx.note}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(tx.timestamp)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={`font-mono text-sm font-semibold ${
                          isSender ? "text-destructive" : "text-accent"
                        }`}
                      >
                        {isSender ? "-" : "+"}
                        {formatBalance(tx.amount)}
                      </span>
                      <Badge className="rounded-md bg-accent/15 px-1.5 py-0 text-[10px] text-accent">
                        {tx.status.__kind__ ?? String(tx.status)}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
