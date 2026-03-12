import {
  Home,
  Loader2,
  LogOut,
  Package,
  RefreshCw,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Role } from "../backend";
import type { Order, Restaurant, UserProfile } from "../backend";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import { useActor } from "../hooks/useActor";

type Tab = "dashboard" | "restaurants" | "users" | "orders" | "coupons";

function formatPrice(p: bigint) {
  return `₹${(Number(p) / 100).toFixed(0)}`;
}

function statusColor(s: string) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    ready_for_pickup: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
  };
  return map[s] || "bg-gray-100 text-gray-800";
}

export default function AdminPage({
  profile: _profile,
  onSignOut,
  onHome,
}: { profile: UserProfile; onSignOut: () => void; onHome: () => void }) {
  const { actor } = useActor();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [agents, setAgents] = useState<UserProfile[]>([]);
  const [_owners, setOwners] = useState<UserProfile[]>([]);
  const [revenue, setRevenue] = useState<bigint>(0n);
  const [analytics, setAnalytics] = useState<{
    totalOrders: bigint;
    totalRevenue: bigint;
    ordersByStatus: [string, bigint][];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Coupon form
  const [cpCode, setCpCode] = useState("");
  const [cpDiscount, setCpDiscount] = useState("");
  const [cpMaxUses, setCpMaxUses] = useState("");
  const [cpExpiry, setCpExpiry] = useState("");
  const [savingCoupon, setSavingCoupon] = useState(false);

  async function loadAll(isRefresh = false) {
    if (!actor) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [rests, allOrders, cust, ag, own, rev, anal] = await Promise.all([
        actor.getAllRestaurants(),
        actor.getAllOrders(),
        actor.getUsersByRole(Role.customer),
        actor.getUsersByRole(Role.delivery_agent),
        actor.getUsersByRole(Role.restaurant_owner),
        actor.getPlatformRevenue(),
        actor.getAnalytics(),
      ]);
      setRestaurants(rests);
      setOrders(allOrders.sort((a, b) => Number(b.id) - Number(a.id)));
      setCustomers(cust);
      setAgents(ag);
      setOwners(own);
      setRevenue(rev);
      setAnalytics(
        anal as {
          totalOrders: bigint;
          totalRevenue: bigint;
          ordersByStatus: [string, bigint][];
        },
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    loadAll();
  }, [actor]);

  async function approveRest(id: bigint) {
    await actor?.approveRestaurant(id);
    loadAll(true);
  }
  async function rejectRest(id: bigint) {
    await actor?.rejectRestaurant(id);
    loadAll(true);
  }
  async function suspendRest(id: bigint) {
    await actor?.suspendRestaurant(id);
    loadAll(true);
  }

  async function createCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSavingCoupon(true);
    try {
      const expiryMs = new Date(cpExpiry).getTime();
      await actor.createCoupon(
        cpCode,
        BigInt(cpDiscount),
        BigInt(cpMaxUses),
        BigInt(expiryMs),
      );
      setCpCode("");
      setCpDiscount("");
      setCpMaxUses("");
      setCpExpiry("");
    } finally {
      setSavingCoupon(false);
    }
  }

  const pendingRestaurants = restaurants.filter(
    (r) => !r.isApproved && !r.isSuspended,
  );
  const approvedRestaurants = restaurants.filter((r) => r.isApproved);

  const pendingAgents = agents.filter((u) => !u.isVerified && !u.isSuspended);
  const verifiedAgents = agents.filter((u) => u.isVerified && !u.isSuspended);
  const suspendedAgents = agents.filter((u) => u.isSuspended);

  const navItems: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "restaurants", label: "Restaurants", icon: "🏪" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "orders", label: "Orders", icon: "📦" },
    { id: "coupons", label: "Coupons", icon: "🎟️" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-52 bg-sidebar text-sidebar-foreground flex flex-col py-4 hidden md:flex">
          <div className="px-4 mb-6">
            <h1 className="text-xl font-bold">🔥 HungerVibes</h1>
            <p className="text-xs opacity-60">Admin Panel</p>
          </div>
          {navItems.map((n) => (
            <button
              type="button"
              key={n.id}
              data-ocid={`admin.nav.${n.id}.tab`}
              onClick={() => setTab(n.id)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                tab === n.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50"
              }`}
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
          <div className="mt-auto px-2 space-y-1">
            <button
              type="button"
              data-ocid="admin.home.button"
              onClick={onHome}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium w-full hover:bg-sidebar-accent/50 transition-colors"
            >
              <Home size={16} />
              <span>Home</span>
            </button>
            <button
              type="button"
              data-ocid="admin.sign_out.button"
              onClick={onSignOut}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium w-full hover:bg-sidebar-accent/50 transition-colors text-red-400"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden bg-primary text-primary-foreground px-4 py-3 flex justify-between items-center">
            <h1 className="font-bold">🔥 Admin</h1>
            <div className="flex gap-1">
              {navItems.map((n) => (
                <button
                  type="button"
                  key={n.id}
                  data-ocid={`admin.mobile.nav.${n.id}.tab`}
                  onClick={() => setTab(n.id)}
                  className={`p-1 text-sm ${tab === n.id ? "opacity-100" : "opacity-60"}`}
                >
                  {n.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div data-ocid="admin.loading_state" className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : (
              <>
                {tab === "dashboard" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">Platform Overview</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        data-ocid="admin.dashboard.refresh.button"
                        onClick={() => loadAll(true)}
                        disabled={refreshing}
                      >
                        <RefreshCw
                          size={14}
                          className={`mr-1 ${refreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <TrendingUp
                            className="mx-auto mb-1 text-primary"
                            size={24}
                          />
                          <div className="text-xl font-bold text-primary">
                            {formatPrice(revenue)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Platform Revenue
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Package className="mx-auto mb-1" size={24} />
                          <div className="text-xl font-bold">
                            {analytics?.totalOrders.toString() ?? "0"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total Orders
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Store className="mx-auto mb-1" size={24} />
                          <div className="text-xl font-bold">
                            {approvedRestaurants.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Restaurants
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Users className="mx-auto mb-1" size={24} />
                          <div className="text-xl font-bold">
                            {customers.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Customers
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Warning: Pending restaurants */}
                    {pendingRestaurants.length > 0 && (
                      <Card className="border-2 border-yellow-400 bg-yellow-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-bold text-yellow-800">
                            ⚠️ {pendingRestaurants.length} Restaurant
                            {pendingRestaurants.length > 1 ? "s" : ""} Pending
                            Approval
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-xs text-yellow-700 mb-2">
                            New restaurant registrations are waiting for your
                            review.
                          </p>
                          <Button
                            size="sm"
                            data-ocid="admin.go_to_restaurants.button"
                            onClick={() => setTab("restaurants")}
                          >
                            Review Now
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {/* Warning: Pending delivery agents */}
                    {pendingAgents.length > 0 && (
                      <Card className="border-2 border-orange-400 bg-orange-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-bold text-orange-800">
                            🛵 {pendingAgents.length} Delivery Agent
                            {pendingAgents.length > 1 ? "s" : ""} Pending
                            Verification
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-xs text-orange-700 mb-2">
                            Delivery agents are awaiting account verification.
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            data-ocid="admin.go_to_agents.button"
                            onClick={() => setTab("users")}
                          >
                            View Agents
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {analytics && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Orders by Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analytics.ordersByStatus.map(([status, count]) => (
                              <div
                                key={status}
                                className="flex justify-between items-center"
                              >
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(status)}`}
                                >
                                  {status.replace(/_/g, " ")}
                                </span>
                                <span className="font-semibold">
                                  {count.toString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {tab === "restaurants" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">Restaurants</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        data-ocid="admin.restaurants.refresh.button"
                        onClick={() => loadAll(true)}
                        disabled={refreshing}
                      >
                        <RefreshCw
                          size={14}
                          className={`mr-1 ${refreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                      </Button>
                    </div>

                    {pendingRestaurants.length > 0 ? (
                      <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 p-4 space-y-3">
                        <div className="font-bold text-yellow-900 flex items-center gap-2">
                          ⚠️ Pending Approval
                          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                            {pendingRestaurants.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {pendingRestaurants.map((r, idx) => (
                            <Card
                              key={String(r.id)}
                              data-ocid={`admin.pending_restaurant.item.${idx + 1}`}
                              className="border-yellow-300 bg-white"
                            >
                              <CardContent className="p-4">
                                <div className="font-semibold">{r.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {r.cuisineType} • {r.address}
                                </div>
                                {r.phone && (
                                  <div className="text-sm text-muted-foreground">
                                    📞 {r.phone}
                                  </div>
                                )}
                                <div className="flex gap-2 mt-3">
                                  <Button
                                    size="sm"
                                    data-ocid={`admin.approve_restaurant.button.${idx + 1}`}
                                    onClick={() => approveRest(r.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    ✓ Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    data-ocid={`admin.reject_restaurant.button.${idx + 1}`}
                                    onClick={() => rejectRest(r.id)}
                                  >
                                    ✗ Reject
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        ✅ No pending restaurant approvals
                      </div>
                    )}

                    <div>
                      <div className="font-semibold text-sm text-muted-foreground mb-2">
                        All Restaurants ({restaurants.length})
                      </div>
                      <div className="space-y-2">
                        {restaurants.map((r, idx) => (
                          <Card
                            key={String(r.id)}
                            data-ocid={`admin.restaurant.item.${idx + 1}`}
                          >
                            <CardContent className="p-4 flex items-center justify-between">
                              <div>
                                <div className="font-medium">{r.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {r.cuisineType}
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {r.isApproved && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                      Approved
                                    </span>
                                  )}
                                  {r.isSuspended && (
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                      Suspended
                                    </span>
                                  )}
                                  {!r.isApproved && !r.isSuspended && (
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">
                                      ⏳ Pending
                                    </span>
                                  )}
                                </div>
                              </div>
                              {r.isApproved && !r.isSuspended && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  data-ocid={`admin.suspend_restaurant.button.${idx + 1}`}
                                  onClick={() => suspendRest(r.id)}
                                >
                                  Suspend
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                        {restaurants.length === 0 && (
                          <div
                            data-ocid="admin.restaurants.empty_state"
                            className="text-center py-12 text-muted-foreground"
                          >
                            No restaurants registered yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {tab === "users" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">Users</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        data-ocid="admin.users.refresh.button"
                        onClick={() => loadAll(true)}
                        disabled={refreshing}
                      >
                        <RefreshCw
                          size={14}
                          className={`mr-1 ${refreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                      </Button>
                    </div>

                    {/* Delivery Agents Section */}
                    <div className="space-y-3">
                      <div className="font-semibold text-sm flex items-center gap-2">
                        🛵 Delivery Agents ({agents.length})
                        {pendingAgents.length > 0 && (
                          <span className="bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {pendingAgents.length} pending
                          </span>
                        )}
                      </div>

                      {/* Pending agents — most prominent */}
                      {pendingAgents.length > 0 && (
                        <div className="rounded-xl border-2 border-orange-400 bg-orange-50 p-4 space-y-2">
                          <div className="font-bold text-orange-900 text-sm">
                            ⏳ Awaiting Verification
                          </div>
                          <p className="text-xs text-orange-700">
                            These agents have registered and are waiting for
                            admin approval. To approve or suspend an agent,
                            please use the backend admin tools or contact
                            support with the agent's name and phone number.
                          </p>
                          {pendingAgents.map((u, idx) => (
                            <Card
                              key={`pending-${u.name}-${u.phone}`}
                              data-ocid={`admin.pending_agent.item.${idx + 1}`}
                              className="border-orange-300 bg-white"
                            >
                              <CardContent className="p-3 flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-sm">
                                    {u.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {u.phone}
                                  </div>
                                </div>
                                <span className="text-xs bg-yellow-200 text-yellow-900 font-bold px-2 py-1 rounded-full">
                                  PENDING
                                </span>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Verified agents */}
                      {verifiedAgents.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                            Verified Agents ({verifiedAgents.length})
                          </div>
                          {verifiedAgents.map((u, idx) => (
                            <Card
                              key={`verified-${u.name}-${u.phone}`}
                              data-ocid={`admin.agent.item.${idx + 1}`}
                            >
                              <CardContent className="p-3 flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-sm">
                                    {u.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {u.phone}
                                  </div>
                                </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                                  ✓ Verified
                                </span>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Suspended agents */}
                      {suspendedAgents.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                            Suspended Agents ({suspendedAgents.length})
                          </div>
                          {suspendedAgents.map((u, idx) => (
                            <Card
                              key={`suspended-${u.name}-${u.phone}`}
                              data-ocid={`admin.suspended_agent.item.${idx + 1}`}
                            >
                              <CardContent className="p-3 flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-sm">
                                    {u.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {u.phone}
                                  </div>
                                </div>
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-semibold">
                                  Suspended
                                </span>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {agents.length === 0 && (
                        <div
                          data-ocid="admin.agents.empty_state"
                          className="text-center py-8 text-muted-foreground text-sm"
                        >
                          No delivery agents registered yet
                        </div>
                      )}
                    </div>

                    {/* Customers Section */}
                    <div className="space-y-2 mt-4">
                      <div className="font-semibold text-sm">
                        👤 Customers ({customers.length})
                      </div>
                      {customers.map((u, idx) => (
                        <Card
                          key={`${u.name}-${u.phone}`}
                          data-ocid={`admin.customer.item.${idx + 1}`}
                        >
                          <CardContent className="p-4">
                            <div className="font-medium">{u.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {u.phone}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {customers.length === 0 && (
                        <div
                          data-ocid="admin.customers.empty_state"
                          className="text-center py-8 text-muted-foreground text-sm"
                        >
                          No customers registered yet
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {tab === "orders" && (
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold">
                      All Orders ({orders.length})
                    </h2>
                    {orders.length === 0 ? (
                      <div
                        data-ocid="admin.orders.empty_state"
                        className="text-center py-12 text-muted-foreground"
                      >
                        No orders yet
                      </div>
                    ) : (
                      orders.map((o, idx) => (
                        <Card
                          key={String(o.id)}
                          data-ocid={`admin.order.item.${idx + 1}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between">
                              <div className="font-semibold">
                                Order #{String(o.id)}
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(o.status)}`}
                              >
                                {o.status.replace(/_/g, " ")}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {o.items.length} items •{" "}
                              {formatPrice(o.totalAmount)} • {o.paymentMethod}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {o.deliveryAddress}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}

                {tab === "coupons" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Coupons</h2>
                    <Card>
                      <CardHeader>
                        <CardTitle>Create Coupon</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={createCoupon} className="space-y-3">
                          <div>
                            <Label>Coupon Code</Label>
                            <Input
                              data-ocid="admin.coupon_code.input"
                              placeholder="SUMMER20"
                              value={cpCode}
                              onChange={(e) =>
                                setCpCode(e.target.value.toUpperCase())
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label>Discount %</Label>
                            <Input
                              data-ocid="admin.coupon_discount.input"
                              type="number"
                              min="1"
                              max="100"
                              placeholder="20"
                              value={cpDiscount}
                              onChange={(e) => setCpDiscount(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label>Max Uses</Label>
                            <Input
                              data-ocid="admin.coupon_maxuses.input"
                              type="number"
                              min="1"
                              placeholder="100"
                              value={cpMaxUses}
                              onChange={(e) => setCpMaxUses(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label>Expiry Date</Label>
                            <Input
                              data-ocid="admin.coupon_expiry.input"
                              type="date"
                              value={cpExpiry}
                              onChange={(e) => setCpExpiry(e.target.value)}
                              required
                            />
                          </div>
                          <Button
                            data-ocid="admin.create_coupon.submit_button"
                            type="submit"
                            disabled={savingCoupon}
                            className="w-full"
                          >
                            {savingCoupon ? (
                              <>
                                <Loader2
                                  className="animate-spin mr-2"
                                  size={16}
                                />
                                Creating...
                              </>
                            ) : (
                              "Create Coupon"
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
