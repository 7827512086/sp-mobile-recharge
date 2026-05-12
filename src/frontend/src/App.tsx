import { FullPageSpinner } from "@/components/Spinner";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import { Toaster, toast } from "sonner";

// Lazy-loaded pages
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const RechargePage = lazy(() => import("@/pages/RechargePage"));
const HistoryPage = lazy(() => import("@/pages/HistoryPage"));
const WalletPage = lazy(() => import("@/pages/WalletPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const AdminPlansPage = lazy(() => import("@/pages/AdminPlansPage"));
const AdminAnalyticsPage = lazy(() => import("@/pages/AdminAnalyticsPage"));
const TransferPage = lazy(() => import("@/pages/TransferPage"));
const BillsPage = lazy(() => import("@/pages/BillsPage"));
const DepositsPage = lazy(() => import("@/pages/DepositsPage"));
const AdminReportsPage = lazy(() => import("@/pages/AdminReportsPage"));
const AdminSettingsPage = lazy(() => import("@/pages/AdminSettingsPage"));

function RootComponent() {
  const { isLoading } = useAuth();
  if (isLoading) return <FullPageSpinner />;
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Outlet />
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "bg-card border-border text-foreground",
            description: "text-muted-foreground",
            actionButton: "bg-primary text-primary-foreground",
          },
        }}
      />
    </Suspense>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <FullPageSpinner />;
  if (!isAuthenticated) return <LoginPage />;
  return <>{children}</>;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { isAdmin, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !profileLoading && isAuthenticated && !isAdmin) {
      navigate({ to: "/" });
      toast.error("Admin access required");
    }
  }, [isLoading, profileLoading, isAuthenticated, isAdmin, navigate]);

  if (isLoading || profileLoading) return <FullPageSpinner />;
  if (!isAuthenticated) return <LoginPage />;
  if (!isAdmin) return <FullPageSpinner />;
  return <>{children}</>;
}

const rootRoute = createRootRoute({ component: RootComponent });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  ),
});

const rechargeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recharge",
  component: () => (
    <AuthGuard>
      <RechargePage />
    </AuthGuard>
  ),
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: () => (
    <AuthGuard>
      <HistoryPage />
    </AuthGuard>
  ),
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: () => (
    <AuthGuard>
      <WalletPage />
    </AuthGuard>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AdminGuard>
      <AdminPage />
    </AdminGuard>
  ),
});

const adminPlansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/plans",
  component: () => (
    <AdminGuard>
      <AdminPlansPage />
    </AdminGuard>
  ),
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/analytics",
  component: () => (
    <AdminGuard>
      <AdminAnalyticsPage />
    </AdminGuard>
  ),
});

const transferRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transfer",
  component: () => (
    <AuthGuard>
      <TransferPage />
    </AuthGuard>
  ),
});

const billsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bills",
  component: () => (
    <AuthGuard>
      <BillsPage />
    </AuthGuard>
  ),
});

const depositsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deposits",
  component: () => (
    <AuthGuard>
      <DepositsPage />
    </AuthGuard>
  ),
});

const adminReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/reports",
  component: () => (
    <AdminGuard>
      <AdminReportsPage />
    </AdminGuard>
  ),
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/settings",
  component: () => (
    <AdminGuard>
      <AdminSettingsPage />
    </AdminGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  homeRoute,
  rechargeRoute,
  historyRoute,
  walletRoute,
  transferRoute,
  billsRoute,
  depositsRoute,
  adminRoute,
  adminPlansRoute,
  adminAnalyticsRoute,
  adminReportsRoute,
  adminSettingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
