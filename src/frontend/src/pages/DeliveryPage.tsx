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
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [earnings, setEarnings] = useState<bigint>(0n);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<bigint | null>(null);

  async function loadData() {
    if (!actor || !identity) return;
    setLoading(true);
    try {
      const principal = identity.getPrincipal();
      const [all, mine, earn] = await Promise.all([
        actor.getAllOrders(),
        actor.getOrdersByDeliveryAgent(principal),
        actor.getDeliveryAgentEarnings(principal),
      ]);
      setAvailableOrders(
        all.filter(
          (o) => o.status === "ready_for_pickup" && !o.deliveryAgentId,
        ),
      );
      setMyOrders(mine.sort((a, b) => Number(b.id) - Number(a.id)));
      setEarnings(earn);
    } finally {
      setLoading(false);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    loadData();
  }, [actor, identity]);

  async function acceptOrder(orderId: bigint) {
    if (!actor) return;
    setAccepting(orderId);
    try {
      await actor.assignDeliveryAgent(orderId);
      await loadData();
      setTab("active");
    } finally {
      setAccepting(null);
    }
  }

  async function markPickedUp(orderId: bigint) {
    await actor?.updateOrderStatus(orderId, OrderStatus.picked_up);
    loadData();
  }

  async function markDelivered(orderId: bigint) {
    await actor?.updateOrderStatus(orderId, OrderStatus.delivered);
    loadData();
  }

  const activeOrders = myOrders.filter((o) => ["picked_up"].includes(o.status));
  const deliveryHistory = myOrders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status),
  );

  if (!profile.isVerified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-xl font-bold mb-2">Verification Pending</h2>
        <p className="text-muted-foreground">
          Your account is being verified by an admin. You'll be able to accept
          deliveries once approved.
        </p>
      </div>
    );
  }

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
        <div className="px-4 py-4 space-y-3">
          <div className="font-semibold text-muted-foreground text-sm">
            Available Deliveries
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
              className="text-center py-16 text-muted-foreground"
            >
              <Package size={40} className="mx-auto mb-3 opacity-40" />
              <p>No orders available right now</p>
              <Button variant="outline" className="mt-3" onClick={loadData}>
                Refresh
              </Button>
            </div>
          ) : (
            availableOrders.map((o, idx) => (
              <Card
                key={String(o.id)}
                data-ocid={`delivery.available.item.${idx + 1}`}
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
                  <Button
                    data-ocid={`delivery.accept.button.${idx + 1}`}
                    className="w-full"
                    disabled={accepting === o.id}
                    onClick={() => acceptOrder(o.id)}
                  >
                    {accepting === o.id ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Accepting...
                      </>
                    ) : (
                      <>
                        <Navigation size={16} className="mr-2" />
                        Accept Delivery
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === "active" && (
        <div className="px-4 py-4 space-y-3">
          <div className="font-semibold text-muted-foreground text-sm">
            Active Delivery
          </div>
          {activeOrders.length === 0 ? (
            <div
              data-ocid="delivery.active.empty_state"
              className="text-center py-16 text-muted-foreground"
            >
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
                    {o.items.length} items
                  </div>
                  {o.status === "picked_up" && (
                    <Button
                      data-ocid={`delivery.delivered.button.${idx + 1}`}
                      className="w-full"
                      onClick={() => markDelivered(o.id)}
                    >
                      Mark Delivered ✓
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
          {/* Show my orders with ready_for_pickup status too */}
          {myOrders
            .filter((o) => o.status === "ready_for_pickup")
            .map((o, idx) => (
              <Card
                key={String(o.id)}
                data-ocid={`delivery.pickup.item.${idx + 1}`}
                className="border-orange-300"
              >
                <CardContent className="p-4">
                  <div className="font-semibold mb-1">
                    Order #{String(o.id)} — Ready for Pickup
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {o.items.length} items
                  </div>
                  <Button
                    data-ocid={`delivery.pickedup.button.${idx + 1}`}
                    className="w-full"
                    onClick={() => markPickedUp(o.id)}
                  >
                    Mark Picked Up
                  </Button>
                </CardContent>
              </Card>
            ))}
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
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              tab === t ? "text-primary" : "text-muted-foreground"
            }`}
          >
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
