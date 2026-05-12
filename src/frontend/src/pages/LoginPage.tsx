import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowLeftRight,
  PiggyBank,
  ReceiptText,
  Shield,
  Smartphone,
  Tv2,
  Wallet,
  Wifi,
} from "lucide-react";

const FEATURES = [
  {
    icon: Smartphone,
    label: "Mobile Recharge",
    desc: "Jio, Airtel, Vi, BSNL plans",
  },
  { icon: Tv2, label: "DTH Recharge", desc: "Tata Sky, Dish TV & more" },
  {
    icon: ArrowLeftRight,
    label: "Money Transfer",
    desc: "Send funds instantly",
  },
  { icon: ReceiptText, label: "Bill Payment", desc: "Electricity, gas, water" },
  {
    icon: PiggyBank,
    label: "Digital Deposits",
    desc: "Earn interest on savings",
  },
  {
    icon: Wallet,
    label: "Secure Wallet",
    desc: "Funds safe on Internet Computer",
  },
];

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-5">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent/8 blur-[60px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 shadow-lg shadow-primary/20"
            aria-hidden="true"
          >
            <span className="font-display text-2xl font-bold text-primary">
              SP
            </span>
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold leading-tight">
              <span className="text-foreground">SP Mobile</span>
              <span className="text-primary"> Recharge App</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Recharge · Transfer · Bills · Deposits
            </p>
          </div>
        </div>

        {/* Hero card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/30">
          <div className="mb-5 grid grid-cols-2 gap-2">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-start gap-2 rounded-xl border border-border/60 bg-secondary/40 p-3"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {label}
                  </p>
                  <p className="text-[11px] leading-tight text-muted-foreground">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            data-ocid="login.connect_button"
            onClick={login}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-smooth hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
          >
            {isLoading ? (
              <>
                <Spinner
                  size="sm"
                  className="border-primary-foreground border-t-transparent"
                />
                <span>Connecting…</span>
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                <span>Connect with Internet Identity</span>
              </>
            )}
          </button>

          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Powered by Internet Computer — no passwords, no middlemen
          </p>
        </div>

        {/* Trust badges */}
        <div className="mt-5 flex items-center justify-center gap-4">
          {["256-bit encrypted", "Decentralized", "Zero custody"].map(
            (badge) => (
              <span
                key={badge}
                className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70"
              >
                {badge}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
