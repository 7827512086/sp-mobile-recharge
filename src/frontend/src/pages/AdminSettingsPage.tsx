import { AdminLayout } from "@/components/AdminLayout";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import type { AppSettings } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SettingField = Exclude<
  keyof AppSettings,
  "appDisplayName" | "commissionRateBps"
>;

const TOGGLE_SETTINGS: { field: SettingField; label: string; desc: string }[] =
  [
    {
      field: "enableMobileRecharge",
      label: "Mobile Recharge",
      desc: "Allow users to recharge mobile numbers",
    },
    {
      field: "enableDthRecharge",
      label: "DTH Recharge",
      desc: "Allow users to recharge DTH connections",
    },
    {
      field: "enableMoneyTransfer",
      label: "Money Transfer",
      desc: "Allow peer-to-peer fund transfers",
    },
    {
      field: "enableBillPayment",
      label: "Bill Payment",
      desc: "Allow electricity, gas, water & internet payments",
    },
    {
      field: "enableDigitalDeposit",
      label: "Digital Deposits",
      desc: "Allow users to create interest-bearing deposits",
    },
  ];

export default function AdminSettingsPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [localSettings, setLocalSettings] = useState<AppSettings | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { data: settings, isLoading } = useQuery<AppSettings>({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.adminGetSettings();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (settings && !localSettings) setLocalSettings(settings);
  }, [settings, localSettings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !localSettings) throw new Error("Not connected");
      await actor.adminUpdateSettings({
        appDisplayName: localSettings.appDisplayName,
        commissionRateBps: localSettings.commissionRateBps,
        enableMobileRecharge: localSettings.enableMobileRecharge,
        enableDthRecharge: localSettings.enableDthRecharge,
        enableMoneyTransfer: localSettings.enableMoneyTransfer,
        enableBillPayment: localSettings.enableBillPayment,
        enableDigitalDeposit: localSettings.enableDigitalDeposit,
      });
    },
    onSuccess: () => {
      toast.success("Settings saved!");
      setIsDirty(false);
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["public-settings"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleToggle(field: SettingField, value: boolean) {
    setLocalSettings((prev) => (prev ? { ...prev, [field]: value } : prev));
    setIsDirty(true);
  }

  function handleDisplayNameChange(value: string) {
    setLocalSettings((prev) =>
      prev ? { ...prev, appDisplayName: value } : prev,
    );
    setIsDirty(true);
  }

  function handleCommissionChange(value: string) {
    const bps = Number.parseInt(value, 10);
    if (!Number.isNaN(bps)) {
      setLocalSettings((prev) =>
        prev ? { ...prev, commissionRateBps: BigInt(bps) } : prev,
      );
      setIsDirty(true);
    }
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-xl space-y-6 px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
              <Settings className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                App Settings
              </h1>
              <p className="text-xs text-muted-foreground">
                Configure platform features and branding
              </p>
            </div>
          </div>
          <Button
            data-ocid="admin.settings.save_button"
            disabled={!isDirty || saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            className="gap-2"
          >
            {saveMutation.isPending ? (
              <>
                <Spinner
                  size="sm"
                  className="border-primary-foreground border-t-transparent"
                />{" "}
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>

        {isLoading || !localSettings ? (
          <div
            data-ocid="admin.settings.loading_state"
            className="flex justify-center py-20"
          >
            <Spinner size="md" />
          </div>
        ) : (
          <>
            {/* Branding */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-4 font-display text-sm font-semibold text-foreground">
                Branding
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="display-name"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    App Display Name
                  </Label>
                  <Input
                    id="display-name"
                    data-ocid="admin.settings.display_name_input"
                    value={localSettings.appDisplayName}
                    onChange={(e) => handleDisplayNameChange(e.target.value)}
                    placeholder="SP Mobile Recharge App"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="commission"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Commission Rate (basis points, e.g. 100 = 1%)
                  </Label>
                  <Input
                    id="commission"
                    data-ocid="admin.settings.commission_input"
                    type="number"
                    min="0"
                    max="10000"
                    value={String(localSettings.commissionRateBps)}
                    onChange={(e) => handleCommissionChange(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Feature toggles */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-4 font-display text-sm font-semibold text-foreground">
                Feature Toggles
              </h2>
              <div className="space-y-4">
                {TOGGLE_SETTINGS.map(({ field, label, desc }) => (
                  <div
                    key={field}
                    data-ocid={`admin.settings.toggle.${field}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-secondary/30 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <Switch
                      checked={localSettings[field] as boolean}
                      onCheckedChange={(v) => handleToggle(field, v)}
                      aria-label={`Toggle ${label}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
