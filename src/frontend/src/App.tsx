import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { Role } from "./backend";
import type { UserProfile } from "./backend";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// Lazy-load heavy page bundles so initial load is fast
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const CustomerPage = lazy(() => import("./pages/CustomerPage"));
const DeliveryPage = lazy(() => import("./pages/DeliveryPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const RestaurantPage = lazy(() => import("./pages/RestaurantPage"));

type PanelType = "customer" | "restaurant" | "delivery" | "admin";

const PANEL_STORAGE_KEY = "hv_selected_panel";

function getSavedPanel(): PanelType | null {
  try {
    const v = localStorage.getItem(PANEL_STORAGE_KEY);
    if (
      v === "customer" ||
      v === "restaurant" ||
      v === "delivery" ||
      v === "admin"
    )
      return v;
  } catch {}
  return null;
}

function savePanel(panel: PanelType | null) {
  try {
    if (panel) localStorage.setItem(PANEL_STORAGE_KEY, panel);
    else localStorage.removeItem(PANEL_STORAGE_KEY);
  } catch {}
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground text-sm">Loading HungerVibes...</p>
      </div>
    </div>
  );
}

const roleLabels: Record<string, string> = {
  customer: "Customer",
  restaurant_owner: "Restaurant Partner",
  delivery_agent: "Delivery Agent",
};

interface WrongPanelProps {
  profileRole: string;
  onSignOut: () => void;
  onHome: () => void;
}

function WrongPanelScreen({ profileRole, onSignOut, onHome }: WrongPanelProps) {
  const label = roleLabels[profileRole] ?? profileRole;
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.95 0.05 60), oklch(0.98 0.03 30))",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center space-y-5">
        <div className="text-5xl">🚫</div>
        <h2 className="text-xl font-bold text-foreground">Wrong Panel</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This panel is for <strong>Delivery Agents</strong> only. Your account
          is registered as a <strong>{label}</strong>. Please sign out and log
          in with a Delivery Agent account.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <button
            type="button"
            data-ocid="wrong_panel.primary_button"
            onClick={onSignOut}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Sign Out
          </button>
          <button
            type="button"
            data-ocid="wrong_panel.secondary_button"
            onClick={onHome}
            className="w-full h-11 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { identity, loginStatus, clear } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<UserProfile | null | undefined>(
    undefined,
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPanel, setSelectedPanel] = useState<PanelType | null>(
    getSavedPanel,
  );
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  function selectPanel(panel: PanelType | null) {
    savePanel(panel);
    setSelectedPanel(panel);
  }

  useEffect(() => {
    if (!actor || !identity || isFetching) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [p, admin] = await Promise.all([
          actor!.getCallerUserProfile(),
          actor!.isCallerAdmin(),
        ]);
        if (!cancelled) {
          setProfile(p ?? null);
          setIsAdmin(admin);
        }
      } catch {
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [actor, identity, isFetching]);

  useEffect(() => {
    if (!identity) {
      setProfile(undefined);
      setIsAdmin(false);
      setLoading(false);
    }
  }, [identity]);

  // Auto-select panel based on profile role — only when identity is present
  // to avoid a race condition after sign-out where profile hasn't cleared yet.
  // biome-ignore lint/correctness/useExhaustiveDependencies: selectPanel is stable
  useEffect(() => {
    if (!profile || selectedPanel || !identity) return;
    if (isAdmin) {
      selectPanel("admin");
      return;
    }
    const role = profile.role;
    if (role === "restaurant_owner") selectPanel("restaurant");
    else if (role === "delivery_agent") selectPanel("delivery");
    else selectPanel("customer");
  }, [profile, isAdmin, selectedPanel, identity]);

  function handleSignOut() {
    clear();
    queryClient.clear();
    selectPanel(null);
    setShowAdminLogin(false);
    setProfile(undefined);
    setIsAdmin(false);
  }

  function handleGoHome() {
    selectPanel(null);
    setShowAdminLogin(false);
  }

  function handleSelectPanel(panel: PanelType) {
    if (panel === "admin") {
      if (isAdmin) {
        selectPanel("admin");
      } else {
        setShowAdminLogin(true);
      }
      return;
    }
    selectPanel(panel);
  }

  function handleAdminLoginSuccess() {
    setShowAdminLogin(false);
    setIsAdmin(true);
    selectPanel("admin");
    setLoading(true);
    if (actor) {
      actor
        .getCallerUserProfile()
        .then((p) => {
          setProfile(p ?? null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }

  // Derive the defaultRole for AuthPage based on selectedPanel
  function getDefaultRole(): Role | undefined {
    if (selectedPanel === "delivery") return Role.delivery_agent;
    if (selectedPanel === "restaurant") return Role.restaurant_owner;
    return undefined;
  }

  // Global loading
  if (loginStatus === "logging-in" || (identity && loading)) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      {showAdminLogin ? (
        <AdminLoginPage
          onSuccess={handleAdminLoginSuccess}
          onBack={() => setShowAdminLogin(false)}
        />
      ) : !selectedPanel ? (
        <HomePage onSelectPanel={handleSelectPanel} />
      ) : !identity ? (
        <AuthPage
          defaultRole={getDefaultRole()}
          onAdminLogin={() => setShowAdminLogin(true)}
          onBack={handleGoHome}
        />
      ) : profile === undefined ? (
        <PageLoader />
      ) : profile === null ? (
        <AuthPage
          defaultRole={getDefaultRole()}
          onRegistered={() => {
            setProfile(undefined);
            setLoading(true);
          }}
          onAdminLogin={() => setShowAdminLogin(true)}
          onBack={handleGoHome}
        />
      ) : selectedPanel === "admin" && isAdmin ? (
        <AdminPage
          profile={profile}
          onSignOut={handleSignOut}
          onHome={handleGoHome}
        />
      ) : selectedPanel === "restaurant" &&
        profile.role === "restaurant_owner" ? (
        <RestaurantPage
          profile={profile}
          onSignOut={handleSignOut}
          onHome={handleGoHome}
        />
      ) : selectedPanel === "delivery" && profile.role === "delivery_agent" ? (
        <DeliveryPage
          profile={profile}
          onSignOut={handleSignOut}
          onHome={handleGoHome}
        />
      ) : selectedPanel === "delivery" && profile.role !== "delivery_agent" ? (
        <WrongPanelScreen
          profileRole={profile.role as string}
          onSignOut={handleSignOut}
          onHome={handleGoHome}
        />
      ) : selectedPanel === "restaurant" &&
        profile.role !== "restaurant_owner" ? (
        <WrongPanelScreen
          profileRole={profile.role as string}
          onSignOut={handleSignOut}
          onHome={handleGoHome}
        />
      ) : profile.role === "restaurant_owner" ? (
        <RestaurantPage
          profile={profile}
          onSignOut={handleSignOut}
          onHome={handleGoHome}
        />
      ) : profile.role === "delivery_agent" ? (
        <DeliveryPage
          profile={profile}
          onSignOut={handleSignOut}
          onHome={handleGoHome}
        />
      ) : (
        <CustomerPage
          profile={profile}
          onSignOut={handleSignOut}
          onHome={handleGoHome}
        />
      )}
    </Suspense>
  );
}
