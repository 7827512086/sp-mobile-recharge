import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  FileText,
  LayoutGrid,
  ListChecks,
  Settings,
  Shield,
} from "lucide-react";

const ADMIN_NAV = [
  { to: "/admin", icon: LayoutGrid, label: "Overview" },
  { to: "/admin/plans", icon: ListChecks, label: "Plans" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/admin/reports", icon: FileText, label: "Reports" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { principal, logout } = useAuth();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Admin Header — distinct gold accent */}
      <header
        data-ocid="admin.header"
        className="sticky top-0 z-50 flex items-center justify-between border-b border-accent/30 bg-card px-4 py-3 shadow-lg shadow-black/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 ring-1 ring-accent/50">
            <Shield className="h-4 w-4 text-accent" />
          </div>
          <div>
            <span className="font-display text-base font-bold">
              <span className="text-foreground">SP Mobile</span>
              <span className="text-accent"> Recharge</span>
              <span className="ml-1.5 rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-xs font-semibold text-accent">
                ADMIN
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            data-ocid="admin.back_to_user_link"
            className="flex items-center gap-1 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground transition-smooth hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>User View</span>
          </Link>
          {shortPrincipal && (
            <button
              data-ocid="admin.logout_button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground transition-smooth hover:border-destructive/40 hover:text-destructive"
              aria-label="Logout"
              type="button"
            >
              {shortPrincipal} ×
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — desktop */}
        <aside
          data-ocid="admin.sidebar"
          className="hidden w-56 shrink-0 border-r border-border bg-card/60 md:flex md:flex-col"
        >
          <nav className="flex flex-col gap-1 p-3 pt-4">
            {ADMIN_NAV.map(({ to, icon: Icon, label }) => {
              const isActive =
                to === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  data-ocid={`admin.nav.${label.toLowerCase()}_link`}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-smooth ${
                    isActive
                      ? "bg-accent/15 text-accent ring-1 ring-accent/25"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto pb-20">{children}</main>
      </div>

      {/* Bottom nav — mobile */}
      <nav
        data-ocid="admin.bottom_nav"
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-accent/20 bg-card/95 backdrop-blur-md md:hidden"
      >
        <div className="flex items-stretch">
          {ADMIN_NAV.map(({ to, icon: Icon, label }) => {
            const isActive =
              to === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                data-ocid={`admin.mobile_nav.${label.toLowerCase()}_tab`}
                className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-smooth ${
                  isActive
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
