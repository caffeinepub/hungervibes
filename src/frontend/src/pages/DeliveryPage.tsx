import {
  Home,
  IndianRupee,
  Loader2,
  LogOut,
  Navigation,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import { OrderStatus } from "../backend";
import type { Order, UserProfile } from "../backend";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Tab = "available" | "active" | "earnings";

function formatPrice(p: bigint) {
  return `₹${(Number(p) / 100).toFixed(0)}`;
}

export default function DeliveryPage({
  profile,
  onSignOut,
  onHome,
}: { profile: UserProfile; onSignOut: () => void; onHome: () => void }) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [tab, setTab] = useState<Tab>("available");
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [deliveryHistory, setDeliveryHistory] = useState<Order[]>([]);
  const [earnings, setEarnings] = useState<bigint>(0n);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<bigint | null>(null);

  async function loadData() {
    if (!actor || !identity) return;
    setLoading(true);
    try {
      const principal = identity.getPrincipal();
      const [all, earn] = await Promise.all([
        actor.getAllOrders(),
        actor.getDeliveryAgentEarnings(principal),
      ]);
      // Available pool: ready_for_pickup with NO agent assigned
      setAvailableOrders(
        all
          .filter((o) => o.status === "ready_for_pickup" && !o.deliveryAgentId)
          .sort((a, b) => Number(b.id) - Number(a.id)),
      );
      // Assigned to me (pending my response): ready_for_pickup with MY principal
      const myPrincipalStr = principal.toString();
      setAssignedOrders(
        all
          .filter(
            (o) =>
              o.status === "ready_for_pickup" &&
              o.deliveryAgentId?.toString() === myPrincipalStr,
          )
          .sort((a, b) => Number(b.id) - Number(a.id)),
      );
      // Active: picked_up by me
      setActiveOrders(
        all
          .filter(
            (o) =>
              o.status === "picked_up" &&
              o.deliveryAgentId?.toString() === myPrincipalStr,
          )
          .sort((a, b) => Number(b.id) - Number(a.id)),
      );
      // History: delivered or cancelled
      setDeliveryHistory(
        all
          .filter(
            (o) =>
              ["delivered", "cancelled"].includes(o.status) &&
              o.deliveryAgentId?.toString() === myPrincipalStr,
          )
          .sort((a, b) => Number(b.id) - Number(a.id)),
      );
      setEarnings(earn);
    } finally {
      setLoading(false);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    loadData();
  }, [actor, identity]);

  async function respondToAssignment(orderId: bigint, accept: boolean) {
    if (!actor) return;
    setResponding(orderId);
    try {
      await actor.agentRespondToAssignment(orderId, accept);
      await loadData();
      if (accept) setTab("active");
    } finally {
      setResponding(null);
    }
  }

  async function markDelivered(orderId: bigint) {
    await actor?.updateOrderStatus(orderId, OrderStatus.delivered);
    loadData();
  }

  // Show a proper pending screen with sign-out and home buttons so the user is never stuck
  if (!profile.isVerified) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.97 0.03 80), oklch(0.99 0.01 60))",
        }}
      >
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 text-center space-y-5">
          <div className="text-6xl">⏳</div>
          <h2 className="text-xl font-bold">Verification Pending</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your delivery agent account is under review by our admin team.
            You'll be able to start accepting deliveries once your profile is
            approved.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-left space-y-1">
            <p className="text-xs font-semibold text-yellow-800">
              What happens next?
            </p>
            <p className="text-xs text-yellow-700">
              Our admin team will review your profile and approve it shortly.
              Check back in a few hours.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Button
              data-ocid="delivery.pending.home.button"
              variant="outline"
              className="w-full"
              onClick={onHome}
            >
              <Home size={16} className="mr-2" />
              Back to Home
            </Button>
            <Button
              data-ocid="delivery.pending.sign_out.button"
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={onSignOut}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const assignedCount = assignedOrders.length;
  const activeCount = activeOrders.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
        <div className="flex-1">
          <h1 className="text-lg font-bold">🛵 HungerVibes</h1>
          <p className="text-xs opacity-75">{profile.name}</p>
        </div>
        <button
          type="button"
          data-ocid="delivery.home.button"
          onClick={onHome}
          className="p-1 opacity-70 hover:opacity-100"
        >
          <Home size={20} />
        </button>
        <button
          type="button"
          data-ocid="delivery.sign_out.button"
          onClick={onSignOut}
          className="p-1 opacity-70 hover:opacity-100"
        >
          <LogOut size={20} />
        </button>
      </div>

      {tab === "available" && (
        <div className="px-4 py-4 space-y-4">
          {/* Assigned to me section */}
          {assignedCount > 0 && (
            <div>
              <div className="font-semibold text-sm mb-2 text-indigo-700">
                📋 Assigned to You ({assignedCount})
              </div>
              <div className="space-y-3">
                {assignedOrders.map((o, idx) => (
                  <Card
                    key={String(o.id)}
                    data-ocid={`delivery.assigned.item.${idx + 1}`}
                    className="border-indigo-300 bg-indigo-50"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-1">
                        <div className="font-semibold">
                          Order #{String(o.id)}
                        </div>
                        <div className="text-primary font-bold">
                          {formatPrice(o.deliveryFee)} earning
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        📍 {o.deliveryAddress}
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {o.items.length} items • Order total{" "}
                        {formatPrice(o.totalAmount)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          data-ocid={`delivery.accept_assignment.button.${idx + 1}`}
                          className="flex-1"
                          disabled={responding === o.id}
                          onClick={() => respondToAssignment(o.id, true)}
                        >
                          {responding === o.id ? (
                            <Loader2 className="animate-spin mr-1" size={14} />
                          ) : (
                            <Navigation size={14} className="mr-1" />
                          )}
                          Accept
                        </Button>
                        <Button
                          data-ocid={`delivery.decline_assignment.button.${idx + 1}`}
                          variant="outline"
                          className="flex-1"
                          disabled={responding === o.id}
                          onClick={() => respondToAssignment(o.id, false)}
                        >
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Available pool */}
          <div>
            <div className="font-semibold text-muted-foreground text-sm mb-2">
              🔍 Available Deliveries
            </div>
            {loading ? (
              <div
                data-ocid="delivery.available.loading_state"
                className="space-y-3"
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : availableOrders.length === 0 ? (
              <div
                data-ocid="delivery.available.empty_state"
                className="text-center py-10 text-muted-foreground"
              >
                <Package size={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No unassigned orders right now</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={loadData}
                >
                  Refresh
                </Button>
              </div>
            ) : (
              availableOrders.map((o, idx) => (
                <Card
                  key={String(o.id)}
                  data-ocid={`delivery.available.item.${idx + 1}`}
                  className="mb-3"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-1">
                      <div className="font-semibold">Order #{String(o.id)}</div>
                      <div className="text-primary font-bold">
                        {formatPrice(o.deliveryFee)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      📍 {o.deliveryAddress}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {o.items.length} items • {formatPrice(o.totalAmount)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Self-pickup available — restaurant hasn't assigned an
                      agent yet.
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "active" && (
        <div className="px-4 py-4 space-y-3">
          <div className="font-semibold text-muted-foreground text-sm">
            Active Deliveries
          </div>
          {activeOrders.length === 0 ? (
            <div
              data-ocid="delivery.active.empty_state"
              className="text-center py-16 text-muted-foreground"
            >
              <Package size={40} className="mx-auto mb-3 opacity-40" />
              <p>No active deliveries</p>
            </div>
          ) : (
            activeOrders.map((o, idx) => (
              <Card
                key={String(o.id)}
                data-ocid={`delivery.active.item.${idx + 1}`}
                className="border-primary"
              >
                <CardContent className="p-4">
                  <div className="font-semibold mb-1">
                    Order #{String(o.id)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Deliver to: {o.deliveryAddress}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {o.items.length} items • {formatPrice(o.totalAmount)}
                  </div>
                  <Button
                    data-ocid={`delivery.delivered.button.${idx + 1}`}
                    className="w-full"
                    onClick={() => markDelivered(o.id)}
                  >
                    Mark Delivered ✓
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === "earnings" && (
        <div className="px-4 py-4 space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <IndianRupee size={32} className="mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold text-primary">
                {formatPrice(earnings)}
              </div>
              <div className="text-muted-foreground">Total Earnings</div>
            </CardContent>
          </Card>
          <div className="font-semibold">Delivery History</div>
          {deliveryHistory.length === 0 ? (
            <div
              data-ocid="delivery.history.empty_state"
              className="text-center py-8 text-muted-foreground"
            >
              No completed deliveries yet
            </div>
          ) : (
            deliveryHistory.map((o, idx) => (
              <Card
                key={String(o.id)}
                data-ocid={`delivery.history.item.${idx + 1}`}
              >
                <CardContent className="p-4 flex justify-between">
                  <div>
                    <div className="font-medium">Order #{String(o.id)}</div>
                    <div className="text-sm text-muted-foreground">
                      {o.status}
                    </div>
                  </div>
                  <div className="font-semibold text-primary">
                    {formatPrice(o.deliveryFee)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t flex">
        {(["available", "active", "earnings"] as Tab[]).map((t) => (
          <button
            type="button"
            key={t}
            data-ocid={`delivery.nav.${t}.tab`}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors relative ${
              tab === t ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {t === "available" && assignedCount > 0 && (
              <span className="absolute top-1 right-4 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {assignedCount}
              </span>
            )}
            {t === "active" && activeCount > 0 && (
              <span className="absolute top-1 right-4 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
            <span>
              {t === "available" ? "🔍" : t === "active" ? "🛵" : "💰"}
            </span>
            <span>
              {t === "available"
                ? "Available"
                : t === "active"
                  ? "Active"
                  : "Earnings"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
