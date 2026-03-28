import { useQueryClient } from "@tanstack/react-query";
import { Suspense, lazy, useEffect, useState } from "react";
import { Role } from "./backend";
import type { UserProfile } from "./backend";

// RoleEntry type - backend supports this via getMyRoles()
interface RoleEntry {
  role: string;
  isVerified: boolean;
  isSuspended: boolean;
}
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
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

// Multi-role helpers
function panelRole(panel: PanelType): Role | null {
  if (panel === "customer") return Role.customer;
  if (panel === "restaurant") return Role.restaurant_owner;
  if (panel === "delivery") return Role.delivery_agent;
  return null;
}

function userHasRole(myRoles: RoleEntry[], role: Role): boolean {
  return myRoles.some((e: RoleEntry) => e.role === role);
}

function userRoleApproved(myRoles: RoleEntry[], role: Role): boolean {
  if (role === Role.customer) return true;
  const entry = myRoles.find((e: RoleEntry) => e.role === role);
  return entry?.isVerified ?? false;
}

function userRoleSuspended(myRoles: RoleEntry[], role: Role): boolean {
  const entry = myRoles.find((e: RoleEntry) => e.role === role);
  return entry?.isSuspended ?? false;
}

const LOADING_MESSAGES = [
  "Loading...",
  "Waking up the server, please wait...",
  "This is taking longer than usual. Almost there...",
];

interface PageLoaderProps {
  onSkip?: () => void;
}

function PageLoader({ onSkip }: PageLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setMsgIndex(1), 3000);
    const t2 = setTimeout(() => setMsgIndex(2), 8000);
    const t3 = setTimeout(() => setShowSkip(true), 8000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
      }}
    >
      <div className="flex flex-col items-center gap-4 px-8 py-10 rounded-2xl bg-white/70 backdrop-blur-sm shadow-xl border border-orange-100">
        <div
          className="text-5xl"
          style={{ filter: "drop-shadow(0 4px 16px rgba(251,146,60,0.5))" }}
        >
          🔥
        </div>
        <h2
          className="text-2xl font-black tracking-tight"
          style={{ color: "#ea580c" }}
        >
          HungerVibes
        </h2>
        <div className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            className="animate-spin"
            style={{ color: "#f97316" }}
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeOpacity="0.2"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-sm font-medium" style={{ color: "#9a3412" }}>
            {LOADING_MESSAGES[msgIndex]}
          </span>
        </div>
        {showSkip && onSkip && (
          <button
            type="button"
            data-ocid="loader.secondary_button"
            onClick={onSkip}
            className="mt-2 px-5 py-2 rounded-lg bg-orange-100 text-orange-700 font-semibold text-sm hover:bg-orange-200 transition-colors border border-orange-200"
          >
            Continue to Home Page
          </button>
        )}
      </div>
    </div>
  );
}

interface PendingApprovalScreenProps {
  roleName: string;
  onHome: () => void;
  onSignOut: () => void;
}

function PendingApprovalScreen({
  roleName,
  onHome,
  onSignOut,
}: PendingApprovalScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center space-y-5">
        <div className="text-5xl">⏳</div>
        <h2 className="text-xl font-bold text-foreground">
          Awaiting Admin Approval
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your <strong>{roleName}</strong> account is under review. You'll be
          able to access this panel once the admin approves your application.
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-left">
          <p className="text-xs font-semibold text-orange-800 mb-1">
            What happens next?
          </p>
          <p className="text-xs text-orange-700">
            Our admin team will review your application and approve it shortly.
            Check back in a few hours.
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <Button
            data-ocid="pending.home.button"
            variant="outline"
            className="w-full"
            onClick={onHome}
          >
            Back to Home
          </Button>
          <Button
            data-ocid="pending.sign_out.button"
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={onSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

const roleDisplayNames: Record<string, string> = {
  customer: "Customer",
  restaurant_owner: "Restaurant Partner",
  delivery_agent: "Delivery Agent",
};

export default function App() {
  const { identity, loginStatus, clear } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<UserProfile | null | undefined>(
    undefined,
  );
  const [myRoles, setMyRoles] = useState<RoleEntry[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(() => !!identity);
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
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 10000),
        );
        const [p, admin] = await Promise.race([
          Promise.all([actor!.getCallerUserProfile(), actor!.isCallerAdmin()]),
          timeout,
        ]);
        if (cancelled) return;
        setProfile(p ?? null);
        setIsAdmin(admin);

        // Try to get roles separately — if it fails, infer from profile
        try {
          const roles = await (actor as any).getMyRoles();
          if (!cancelled) {
            if (roles && roles.length > 0) {
              setMyRoles(roles);
            } else if (p) {
              // Fallback: synthesize roles from profile.role
              setMyRoles([
                {
                  role: (p as any).role ?? "customer",
                  isVerified: true,
                  isSuspended: false,
                },
              ]);
            }
          }
        } catch {
          if (!cancelled && p) {
            // Fallback: synthesize roles from profile.role
            setMyRoles([
              {
                role: (p as any).role ?? "customer",
                isVerified: true,
                isSuspended: false,
              },
            ]);
          }
        }
      } catch {
        // If the whole thing times out or fails, don't clear profile to null
        // just stop loading and show home so user can retry
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
    setMyRoles([]);
  }

  // Go home WITHOUT signing out — back arrow behavior
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

  function getDefaultRole(): Role | undefined {
    if (selectedPanel === "delivery") return Role.delivery_agent;
    if (selectedPanel === "restaurant") return Role.restaurant_owner;
    return undefined;
  }

  function handleSkipLoading() {
    setLoading(false);
    setProfile(null);
  }

  function handleRoleRegistered() {
    // Refresh profile and roles after adding a new role
    setProfile(undefined);
    setMyRoles([]);
    setLoading(true);
    if (actor) {
      actor
        .getCallerUserProfile()
        .then(async (p) => {
          setProfile(p ?? null);
          // Try to get roles separately with fallback
          try {
            const roles = await (actor as any).getMyRoles();
            if (roles && roles.length > 0) {
              setMyRoles(roles);
            } else if (p) {
              setMyRoles([
                {
                  role: (p as any).role ?? "customer",
                  isVerified: true,
                  isSuspended: false,
                },
              ]);
            }
          } catch {
            if (p) {
              setMyRoles([
                {
                  role: (p as any).role ?? "customer",
                  isVerified: true,
                  isSuspended: false,
                },
              ]);
            }
          }
          setLoading(false);
        })
        .catch(() => {
          setProfile(null);
          setLoading(false);
        });
    }
  }

  // Global loading
  if (loginStatus === "logging-in" || (identity && loading)) {
    return <PageLoader onSkip={handleSkipLoading} />;
  }

  // Determine what to render for a given panel
  function renderPanel() {
    if (showAdminLogin) {
      return (
        <AdminLoginPage
          onSuccess={handleAdminLoginSuccess}
          onBack={() => setShowAdminLogin(false)}
        />
      );
    }

    if (!selectedPanel) {
      return <HomePage onSelectPanel={handleSelectPanel} />;
    }

    // Admin panel
    if (selectedPanel === "admin") {
      if (!identity) {
        return (
          <AdminLoginPage
            onSuccess={handleAdminLoginSuccess}
            onBack={handleGoHome}
          />
        );
      }
      if (isAdmin) {
        return (
          <AdminPage
            profile={profile as UserProfile}
            onSignOut={handleSignOut}
            onHome={handleGoHome}
          />
        );
      }
      // Not admin — show admin login
      return (
        <AdminLoginPage
          onSuccess={handleAdminLoginSuccess}
          onBack={handleGoHome}
        />
      );
    }

    // Non-admin panels
    if (!identity) {
      return <AuthPage defaultRole={getDefaultRole()} onBack={handleGoHome} />;
    }

    if (profile === undefined) {
      return <PageLoader />;
    }

    if (profile === null) {
      // New user — register
      return (
        <AuthPage
          defaultRole={getDefaultRole()}
          onRegistered={handleRoleRegistered}
          onBack={handleGoHome}
        />
      );
    }

    const targetRole = panelRole(selectedPanel);
    if (!targetRole) return <HomePage onSelectPanel={handleSelectPanel} />;

    // Check if user has this role
    if (!userHasRole(myRoles, targetRole)) {
      // User logged in but doesn't have this role — let them add it
      return (
        <AuthPage
          defaultRole={targetRole}
          addingRole
          existingName={profile.name}
          existingPhone={profile.phone}
          onRegistered={handleRoleRegistered}
          onBack={handleGoHome}
        />
      );
    }

    // Check if the role is suspended
    if (userRoleSuspended(myRoles, targetRole)) {
      return (
        <PendingApprovalScreen
          roleName={`${roleDisplayNames[targetRole]} (Suspended)`}
          onHome={handleGoHome}
          onSignOut={handleSignOut}
        />
      );
    }

    // Check if the role is pending approval
    if (!userRoleApproved(myRoles, targetRole)) {
      return (
        <PendingApprovalScreen
          roleName={roleDisplayNames[targetRole] ?? targetRole}
          onHome={handleGoHome}
          onSignOut={handleSignOut}
        />
      );
    }

    // All good — show the panel
    if (selectedPanel === "restaurant") {
      return (
        <RestaurantPage
          profile={profile}
          onSignOut={handleSignOut}
          onHome={handleGoHome}
        />
      );
    }
    if (selectedPanel === "delivery") {
      return (
        <DeliveryPage
          profile={profile}
          onSignOut={handleSignOut}
          onHome={handleGoHome}
        />
      );
    }
    return (
      <CustomerPage
        profile={profile}
        onSignOut={handleSignOut}
        onHome={handleGoHome}
      />
    );
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <Suspense fallback={<PageLoader />}>{renderPanel()}</Suspense>
    </>
  );
}
