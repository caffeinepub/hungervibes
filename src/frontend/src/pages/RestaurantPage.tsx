import { Home, Loader2, LogOut, Plus, Store, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { OrderStatus } from "../backend";
import type { MenuItem, Order, Restaurant, UserProfile } from "../backend";
import { ExternalBlob } from "../backend";
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

type Tab = "dashboard" | "menu" | "orders" | "register";

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

export default function RestaurantPage({
  profile,
  onSignOut,
  onHome,
}: { profile: UserProfile; onSignOut: () => void; onHome: () => void }) {
  const { actor } = useActor();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [restaurant, setRestaurant] = useState<Restaurant | null | undefined>(
    undefined,
  );
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<bigint>(0n);

  // Register form
  const [regName, setRegName] = useState("");
  const [regDesc, setRegDesc] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCuisine, setRegCuisine] = useState("");
  const [regLogo, setRegLogo] = useState<File | null>(null);
  const [registering, setRegistering] = useState(false);

  // Add item form
  const [showAdd, setShowAdd] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [addingItem, setAddingItem] = useState(false);

  useEffect(() => {
    if (!actor) return;
    actor.getMyRestaurant().then((r) => {
      setRestaurant(r ?? null);
      setLoading(false);
      if (r) {
        setTab("dashboard");
        loadMenu(r.id);
        loadOrders(r.id);
        actor.getRestaurantEarnings(r.id).then((e) => setEarnings(e));
      } else {
        setTab("register");
      }
    });
  }, [actor]);

  function loadMenu(id: bigint) {
    actor?.getMenuByRestaurant(id).then(setMenu);
  }

  function loadOrders(id: bigint) {
    actor
      ?.getOrdersByRestaurant(id)
      .then((o) => setOrders(o.sort((a, b) => Number(b.id) - Number(a.id))));
  }

  async function registerRestaurant(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setRegistering(true);
    try {
      let logo: ExternalBlob | null = null;
      if (regLogo) {
        const bytes = new Uint8Array(await regLogo.arrayBuffer());
        logo = ExternalBlob.fromBytes(bytes);
      }
      await actor.createRestaurant(
        regName,
        regDesc,
        regAddress,
        regPhone,
        regCuisine,
        logo,
      );
      const r = await actor.getMyRestaurant();
      setRestaurant(r ?? null);
      setTab("dashboard");
    } finally {
      setRegistering(false);
    }
  }

  async function addMenuItem(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !restaurant) return;
    setAddingItem(true);
    try {
      let img: ExternalBlob | null = null;
      if (itemImage) {
        img = ExternalBlob.fromBytes(
          new Uint8Array(await itemImage.arrayBuffer()),
        );
      }
      await actor.addMenuItem(
        restaurant.id,
        itemName,
        itemDesc,
        BigInt(Math.round(Number.parseFloat(itemPrice) * 100)),
        itemCategory,
        img,
      );
      setItemName("");
      setItemDesc("");
      setItemPrice("");
      setItemCategory("");
      setItemImage(null);
      setShowAdd(false);
      loadMenu(restaurant.id);
    } finally {
      setAddingItem(false);
    }
  }

  async function deleteItem(id: bigint) {
    if (!actor || !restaurant) return;
    await actor.deleteMenuItem(id);
    loadMenu(restaurant.id);
  }

  async function toggleAvailability(item: MenuItem) {
    if (!actor) return;
    await actor.updateMenuItem(
      item.id,
      null,
      null,
      null,
      null,
      !item.isAvailable,
    );
    if (restaurant) loadMenu(restaurant.id);
  }

  async function acceptOrder(orderId: bigint, accept: boolean) {
    if (!actor || !restaurant) return;
    await actor.acceptOrder(orderId, accept);
    loadOrders(restaurant.id);
  }

  async function updateStatus(orderId: bigint, status: OrderStatus) {
    if (!actor || !restaurant) return;
    await actor.updateOrderStatus(orderId, status);
    loadOrders(restaurant.id);
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  const navTabs: { id: Tab; label: string; icon: string }[] = restaurant
    ? [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "menu", label: "Menu", icon: "🍽️" },
        { id: "orders", label: "Orders", icon: "📦" },
      ]
    : [{ id: "register", label: "Register", icon: "📝" }];

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const todayEarnings = earnings;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
        <div className="flex-1">
          <h1 className="text-lg font-bold">
            🍽️ {restaurant ? restaurant.name : "Register Restaurant"}
          </h1>
          <p className="text-xs opacity-75">{profile.name}</p>
        </div>
        <button
          type="button"
          data-ocid="restaurant.home.button"
          onClick={onHome}
          className="p-1 opacity-70 hover:opacity-100"
        >
          <Home size={20} />
        </button>
        <button
          type="button"
          data-ocid="restaurant.sign_out.button"
          onClick={onSignOut}
          className="p-1 opacity-70 hover:opacity-100"
        >
          <LogOut size={20} />
        </button>
      </div>

      {tab === "register" && (
        <div className="px-4 py-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store size={20} /> Register Your Restaurant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={registerRestaurant} className="space-y-4">
                <div>
                  <Label>Restaurant Name</Label>
                  <Input
                    data-ocid="restaurant.reg_name.input"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    data-ocid="restaurant.reg_desc.input"
                    value={regDesc}
                    onChange={(e) => setRegDesc(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    data-ocid="restaurant.reg_address.input"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    data-ocid="restaurant.reg_phone.input"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Cuisine Type</Label>
                  <Input
                    data-ocid="restaurant.reg_cuisine.input"
                    placeholder="Indian, Chinese, Italian..."
                    value={regCuisine}
                    onChange={(e) => setRegCuisine(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Logo (optional)</Label>
                  <input
                    data-ocid="restaurant.reg_logo.upload_button"
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm mt-1"
                    onChange={(e) => setRegLogo(e.target.files?.[0] ?? null)}
                  />
                </div>
                <Button
                  data-ocid="restaurant.register.submit_button"
                  type="submit"
                  className="w-full"
                  disabled={registering}
                >
                  {registering ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Approval"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "dashboard" && restaurant && (
        <div className="px-4 py-4 space-y-4">
          {!restaurant.isApproved && (
            <Card className="border-yellow-300 bg-yellow-50">
              <CardContent className="p-4 text-yellow-800 text-sm">
                ⏳ Your restaurant is pending admin approval. You can set up
                your menu while you wait.
              </CardContent>
            </Card>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(todayEarnings)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Earnings
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {pendingOrders.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Pending Orders
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{orders.length}</div>
                <div className="text-xs text-muted-foreground">
                  Total Orders
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{menu.length}</div>
                <div className="text-xs text-muted-foreground">Menu Items</div>
              </CardContent>
            </Card>
          </div>
          {pendingOrders.length > 0 && (
            <div>
              <div className="font-semibold mb-2">Pending Orders</div>
              <div className="space-y-2">
                {pendingOrders.map((o, idx) => (
                  <Card
                    key={String(o.id)}
                    data-ocid={`restaurant.pending_order.item.${idx + 1}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">Order #{String(o.id)}</div>
                        <div className="font-semibold text-primary">
                          {formatPrice(o.totalAmount)}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {o.items.length} items • {o.paymentMethod}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          data-ocid={`restaurant.accept_order.button.${idx + 1}`}
                          onClick={() => acceptOrder(o.id, true)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          data-ocid={`restaurant.reject_order.button.${idx + 1}`}
                          onClick={() => acceptOrder(o.id, false)}
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "menu" && restaurant && (
        <div className="px-4 py-4 space-y-3">
          <Button
            data-ocid="restaurant.add_item.open_modal_button"
            className="w-full"
            onClick={() => setShowAdd(!showAdd)}
          >
            <Plus size={16} className="mr-2" />{" "}
            {showAdd ? "Cancel" : "Add Menu Item"}
          </Button>
          {showAdd && (
            <Card data-ocid="restaurant.add_item.panel">
              <CardContent className="p-4">
                <form onSubmit={addMenuItem} className="space-y-3">
                  <Input
                    data-ocid="restaurant.item_name.input"
                    placeholder="Item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                  <Input
                    data-ocid="restaurant.item_desc.input"
                    placeholder="Description"
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                  />
                  <Input
                    data-ocid="restaurant.item_price.input"
                    type="number"
                    step="0.01"
                    placeholder="Price (₹)"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    required
                  />
                  <Input
                    data-ocid="restaurant.item_category.input"
                    placeholder="Category (e.g. Starters, Mains)"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    data-ocid="restaurant.item_image.upload_button"
                    className="block w-full text-sm"
                    onChange={(e) => setItemImage(e.target.files?.[0] ?? null)}
                  />
                  <Button
                    data-ocid="restaurant.add_item.submit_button"
                    type="submit"
                    disabled={addingItem}
                    className="w-full"
                  >
                    {addingItem ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Adding...
                      </>
                    ) : (
                      "Add Item"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          {menu.length === 0 ? (
            <div
              data-ocid="restaurant.menu.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              No menu items yet. Add your first item!
            </div>
          ) : (
            menu.map((item, idx) => (
              <Card
                key={String(item.id)}
                data-ocid={`restaurant.menu.item.${idx + 1}`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl.getDirectURL()}
                      className="w-12 h-12 rounded-lg object-cover"
                      alt={item.name}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                      🍛
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.category} • {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-ocid={`restaurant.toggle_availability.toggle.${idx + 1}`}
                      onClick={() => toggleAvailability(item)}
                      className={`text-xs px-2 py-1 rounded-full ${item.isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </button>
                    <button
                      type="button"
                      data-ocid={`restaurant.delete_item.delete_button.${idx + 1}`}
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === "orders" && restaurant && (
        <div className="px-4 py-4 space-y-3">
          {orders.length === 0 ? (
            <div
              data-ocid="restaurant.orders.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              No orders yet
            </div>
          ) : (
            orders.map((o, idx) => (
              <Card
                key={String(o.id)}
                data-ocid={`restaurant.orders.item.${idx + 1}`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
                    <div className="font-semibold">Order #{String(o.id)}</div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(o.status)}`}
                    >
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {o.items.length} items • {formatPrice(o.totalAmount)}
                  </div>
                  {o.status === "accepted" && (
                    <Button
                      size="sm"
                      data-ocid={`restaurant.preparing.button.${idx + 1}`}
                      onClick={() => updateStatus(o.id, OrderStatus.preparing)}
                    >
                      Mark Preparing
                    </Button>
                  )}
                  {o.status === "preparing" && (
                    <Button
                      size="sm"
                      data-ocid={`restaurant.ready.button.${idx + 1}`}
                      onClick={() =>
                        updateStatus(o.id, OrderStatus.ready_for_pickup)
                      }
                    >
                      Ready for Pickup
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Bottom Nav */}
      {restaurant && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t flex">
          {navTabs.map((t) => (
            <button
              type="button"
              key={t.id}
              data-ocid={`restaurant.nav.${t.id}.tab`}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                tab === t.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
