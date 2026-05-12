import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { formatBalance } from "@/types";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  History,
  LayoutDashboard,
  Smartphone,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/recharge", icon: Smartphone, label: "Recharge" },
  { to: "/transfer", icon: ArrowLeftRight, label: "Transfer" },
  { to: "/history", icon: History, label: "History" },
  { to: "/wallet", icon: User, label: "Account" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { walletBalance } = useProfile();
  const { logout, principal } = useAuth();
  const location = useLocation();

  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header
        data-ocid="app.header"
        className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/20 bg-card px-4 py-3 shadow-lg shadow-black/20"
      >
        <Link
          to="/"
          data-ocid="app.logo_link"
          className="flex items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/40">
            <span className="font-display text-sm font-bold text-primary">
              SP
            </span>
          </div>
          <span className="font-display text-base font-bold leading-tight">
            <span className="text-foreground">SP Mobile</span>
            <span className="text-primary block text-xs font-semibold tracking-wide">
              Recharge App
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div
            data-ocid="wallet.balance_chip"
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-mono text-xs font-semibold text-primary">
              {formatBalance(walletBalance)}
            </span>
          </div>
          {shortPrincipal && (
            <button
              data-ocid="app.logout_button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground transition-smooth hover:border-destructive/40 hover:text-destructive"
              aria-label="Logout"
              type="button"
            >
              <span className="hidden sm:inline">{shortPrincipal}</span>
              <span>×</span>
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-24">{children}</main>

      {/* Bottom tab navigation (mobile) */}
      <nav
        data-ocid="app.bottom_nav"
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md"
      >
        <div className="flex items-stretch">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                data-ocid={`nav.${label.toLowerCase()}_tab`}
                className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-smooth ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`}
                />
                <span className="font-body">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 h-0.5 w-10 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
