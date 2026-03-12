import {
  ArrowLeft,
  Clock,
  Home,
  Loader2,
  LogOut,
  MapPin,
  Search,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PaymentMethod } from "../backend";
import type {
  MenuItem,
  Order,
  OrderItem,
  Restaurant,
  UserProfile,
} from "../backend";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Tab = "home" | "restaurant" | "cart" | "orders";

interface CartItem {
  item: MenuItem;
  qty: number;
}

function formatPrice(p: bigint) {
  return `₹${(Number(p) / 100).toFixed(0)}`;
}

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    pending: "⏳ Waiting for Restaurant",
    accepted: "✅ Restaurant Accepted",
    rejected: "❌ Order Rejected",
    preparing: "🍳 Being Prepared",
    ready_for_pickup: "🔍 Finding Delivery Agent",
    picked_up: "🛵 On the Way!",
    delivered: "✅ Delivered!",
    cancelled: "🚫 Cancelled",
  };
  return map[s] || s.replace(/_/g, " ");
}

function statusColor(s: string) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    ready_for_pickup: "bg-purple-100 text-purple-800",
    picked_up: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
  };
  return map[s] || "bg-gray-100 text-gray-800";
}

export default function CustomerPage({
  profile: _profile,
  onSignOut,
  onHome,
}: { profile: UserProfile; onSignOut: () => void; onHome: () => void }) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  const [tab, setTab] = useState<Tab>("home");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const [loadingRest, setLoadingRest] = useState(true);
  const [selectedRest, setSelectedRest] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.cash,
  );
  const [couponCode, setCouponCode] = useState("");
  const [couponValid, setCouponValid] = useState<boolean | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!actor) return;
    actor.getAllRestaurants().then((r) => {
      setRestaurants(r.filter((x) => x.isApproved && !x.isSuspended));
      setLoadingRest(false);
    });
  }, [actor]);

  function openRestaurant(r: Restaurant) {
    setSelectedRest(r);
    setMenu([]);
    setLoadingMenu(true);
    setTab("restaurant");
    actor?.getMenuByRestaurant(r.id).then((m) => {
      setMenu(m.filter((i) => i.isAvailable));
      setLoadingMenu(false);
    });
  }

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing)
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      return [...prev, { item, qty: 1 }];
    });
  }

  function updateQty(itemId: bigint, delta: number) {
    setCart((prev) => {
      const updated = prev
        .map((c) => (c.item.id === itemId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0);
      return updated;
    });
  }

  const cartTotal = cart.reduce(
    (sum, c) => sum + Number(c.item.price) * c.qty,
    0,
  );
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  async function checkCoupon() {
    if (!actor || !couponCode) return;
    const valid = await actor.validateCoupon(couponCode);
    setCouponValid(valid);
  }

  async function placeOrder() {
    if (!actor || !selectedRest || cart.length === 0 || !deliveryAddress)
      return;
    setPlacingOrder(true);
    try {
      const items: OrderItem[] = cart.map((c) => ({
        foodItemId: c.item.id,
        quantity: BigInt(c.qty),
        price: c.item.price,
      }));
      await actor.placeOrder(
        selectedRest.id,
        items,
        deliveryAddress,
        paymentMethod,
        couponCode || null,
      );
      setCart([]);
      setCouponCode("");
      setCouponValid(null);
      setTab("orders");
      loadOrders();
    } finally {
      setPlacingOrder(false);
    }
  }

  async function loadOrders() {
    if (!actor || !identity) return;
    setLoadingOrders(true);
    try {
      const principal = identity.getPrincipal();
      const o = await actor.getOrdersByCustomer(principal);
      setOrders(o.sort((a, b) => Number(b.id) - Number(a.id)));
    } finally {
      setLoadingOrders(false);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (tab === "orders") loadOrders();
  }, [tab, actor]);

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisineType.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
        {tab !== "home" && (
          <button
            type="button"
            onClick={() => setTab("home")}
            data-ocid="customer.nav.back.button"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-lg font-bold flex-1">
          {tab === "home"
            ? "🔥 HungerVibes"
            : tab === "restaurant"
              ? selectedRest?.name
              : tab === "cart"
                ? "Your Cart"
                : "Your Orders"}
        </h1>
        {tab === "home" && (
          <>
            <button
              type="button"
              onClick={() => setTab("cart")}
              data-ocid="customer.cart.button"
              className="relative"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              data-ocid="customer.home.button"
              onClick={onHome}
              className="p-1 opacity-70 hover:opacity-100"
            >
              <Home size={20} />
            </button>
            <button
              type="button"
              data-ocid="customer.sign_out.button"
              onClick={onSignOut}
              className="p-1 opacity-70 hover:opacity-100"
            >
              <LogOut size={20} />
            </button>
          </>
        )}
      </div>

      {/* Home */}
      {tab === "home" && (
        <div className="px-4 py-4 space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-3 text-muted-foreground"
            />
            <Input
              data-ocid="customer.search_input"
              className="pl-9"
              placeholder="Search restaurants or cuisines"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-sm font-semibold text-muted-foreground">
            Restaurants near you
          </div>
          {loadingRest ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="customer.restaurants.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              No restaurants found
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((r, idx) => (
                <Card
                  key={String(r.id)}
                  data-ocid={`customer.restaurant.item.${idx + 1}`}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openRestaurant(r)}
                >
                  <CardContent className="p-4 flex gap-3">
                    {r.logo ? (
                      <img
                        src={r.logo.getDirectURL()}
                        alt={r.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-2xl flex-shrink-0">
                        🍽️
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{r.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {r.cuisineType}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-500" /> 4.2
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> 25-35 min
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {r.address.slice(0, 20)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Restaurant Menu */}
      {tab === "restaurant" && selectedRest && (
        <div className="px-4 py-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {selectedRest.cuisineType} • {selectedRest.address}
            </p>
          </div>
          {loadingMenu ? (
            <div data-ocid="customer.menu.loading_state" className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {menu.map((item, idx) => {
                const cartItem = cart.find((c) => c.item.id === item.id);
                return (
                  <Card
                    key={String(item.id)}
                    data-ocid={`customer.menu.item.${idx + 1}`}
                  >
                    <CardContent className="p-4 flex gap-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl.getDirectURL()}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-2xl flex-shrink-0">
                          🍛
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                        <div className="font-semibold text-primary mt-1">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {cartItem ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, -1)}
                              data-ocid={`customer.menu.decrease.button.${idx + 1}`}
                              className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-semibold">
                              {cartItem.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, 1)}
                              data-ocid={`customer.menu.increase.button.${idx + 1}`}
                              className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            data-ocid={`customer.menu.add.button.${idx + 1}`}
                            onClick={() => addToCart(item)}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          {cartCount > 0 && (
            <div className="fixed bottom-20 left-0 right-0 px-4">
              <Button
                data-ocid="customer.view_cart.button"
                className="w-full h-12 text-base shadow-lg"
                onClick={() => setTab("cart")}
              >
                View Cart ({cartCount} items) • {formatPrice(BigInt(cartTotal))}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Cart */}
      {tab === "cart" && (
        <div className="px-4 py-4 space-y-4">
          {cart.length === 0 ? (
            <div
              data-ocid="customer.cart.empty_state"
              className="text-center py-16 text-muted-foreground"
            >
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-40" />
              <p>Your cart is empty</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setTab("home")}
              >
                Browse Restaurants
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((c, idx) => (
                  <Card
                    key={String(c.item.id)}
                    data-ocid={`customer.cart.item.${idx + 1}`}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-medium">{c.item.name}</div>
                        <div className="text-sm text-primary">
                          {formatPrice(c.item.price)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(c.item.id, -1)}
                          className="w-7 h-7 rounded-full border flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-semibold">
                          {c.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(c.item.id, 1)}
                          className="w-7 h-7 rounded-full border flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <div className="font-semibold w-16 text-right">
                        {formatPrice(BigInt(Number(c.item.price) * c.qty))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="font-semibold">Delivery Details</div>
                  <Input
                    data-ocid="customer.delivery_address.input"
                    placeholder="Delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                  <div className="flex gap-2">
                    {Object.values(PaymentMethod).map((pm) => (
                      <button
                        type="button"
                        key={pm}
                        data-ocid={`customer.payment.${pm}.toggle`}
                        onClick={() => setPaymentMethod(pm)}
                        className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          paymentMethod === pm
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        }`}
                      >
                        {pm === "cash"
                          ? "💵 Cash on Delivery"
                          : "💳 Online Payment"}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      data-ocid="customer.coupon.input"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponValid(null);
                      }}
                    />
                    <Button
                      variant="outline"
                      data-ocid="customer.coupon.button"
                      onClick={checkCoupon}
                    >
                      Apply
                    </Button>
                  </div>
                  {couponValid === true && (
                    <p
                      className="text-green-600 text-sm"
                      data-ocid="customer.coupon.success_state"
                    >
                      Coupon applied!
                    </p>
                  )}
                  {couponValid === false && (
                    <p
                      className="text-destructive text-sm"
                      data-ocid="customer.coupon.error_state"
                    >
                      Invalid or expired coupon
                    </p>
                  )}
                </CardContent>
              </Card>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(BigInt(cartTotal))}
                </span>
              </div>
              <Button
                data-ocid="customer.place_order.button"
                className="w-full h-12 text-base"
                disabled={placingOrder || !deliveryAddress}
                onClick={placeOrder}
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} /> Placing
                    Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </>
          )}
        </div>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <div className="px-4 py-4 space-y-3">
          <div className="flex justify-between items-center mb-1">
            <div className="font-semibold text-sm text-muted-foreground">
              Your Orders
            </div>
            <Button variant="ghost" size="sm" onClick={loadOrders}>
              Refresh
            </Button>
          </div>
          {loadingOrders ? (
            <div
              data-ocid="customer.orders.loading_state"
              className="space-y-3"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div
              data-ocid="customer.orders.empty_state"
              className="text-center py-16 text-muted-foreground"
            >
              No orders yet
            </div>
          ) : (
            orders.map((o, idx) => (
              <Card
                key={String(o.id)}
                data-ocid={`customer.orders.item.${idx + 1}`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold">Order #{String(o.id)}</div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(
                        o.status,
                      )}`}
                    >
                      {statusLabel(o.status)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {o.items.length} items • {formatPrice(o.totalAmount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {o.deliveryAddress}
                  </div>
                  {/* Progress bar */}
                  {!["cancelled", "rejected", "delivered"].includes(
                    o.status,
                  ) && (
                    <div className="mt-3">
                      <div className="flex gap-1 items-center">
                        {[
                          "pending",
                          "accepted",
                          "preparing",
                          "ready_for_pickup",
                          "picked_up",
                          "delivered",
                        ].map((step) => {
                          const steps = [
                            "pending",
                            "accepted",
                            "preparing",
                            "ready_for_pickup",
                            "picked_up",
                            "delivered",
                          ];
                          const currentIdx = steps.indexOf(o.status);
                          const stepIdx = steps.indexOf(step);
                          return (
                            <div
                              key={step}
                              className={`flex-1 h-1.5 rounded-full ${
                                stepIdx <= currentIdx
                                  ? "bg-primary"
                                  : "bg-muted"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {o.status === "pending" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      data-ocid={`customer.cancel_order.button.${idx + 1}`}
                      onClick={() => actor?.cancelOrder(o.id).then(loadOrders)}
                    >
                      Cancel
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t flex">
        {(["home", "orders"] as Tab[]).map((t) => (
          <button
            type="button"
            key={t}
            data-ocid={`customer.nav.${t}.tab`}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              tab === t ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span>{t === "home" ? "🏠" : "📦"}</span>
            <span>{t === "home" ? "Home" : "Orders"}</span>
          </button>
        ))}
        <button
          type="button"
          data-ocid="customer.nav.cart.tab"
          onClick={() => setTab("cart")}
          className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors relative ${
            tab === "cart" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {cartCount > 0 && (
            <span className="absolute top-1 right-6 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span>🛒</span>
          <span>Cart</span>
        </button>
      </div>
    </div>
  );
}
