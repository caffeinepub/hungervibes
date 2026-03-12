import { c as createLucideIcon, a as useActor, r as reactExports, j as jsxRuntimeExports, L as LoaderCircle, O as OrderStatus, E as ExternalBlob } from "./index-BtK-op7o.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, B as Button } from "./card-BkwWiKJ7.js";
import { I as Input } from "./input-BVmkI-cr.js";
import { L as Label } from "./label-sgM_1b6w.js";
import { H as House, L as LogOut } from "./log-out-D3kHsyDp.js";
import { S as Store } from "./store-CKcENcGS.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function formatPrice(p) {
  return `₹${(Number(p) / 100).toFixed(0)}`;
}
function statusColor(s) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    ready_for_pickup: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800"
  };
  return map[s] || "bg-gray-100 text-gray-800";
}
function RestaurantPage({
  profile,
  onSignOut,
  onHome
}) {
  const { actor } = useActor();
  const [tab, setTab] = reactExports.useState("dashboard");
  const [restaurant, setRestaurant] = reactExports.useState(
    void 0
  );
  const [menu, setMenu] = reactExports.useState([]);
  const [orders, setOrders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [earnings, setEarnings] = reactExports.useState(0n);
  const [regName, setRegName] = reactExports.useState("");
  const [regDesc, setRegDesc] = reactExports.useState("");
  const [regAddress, setRegAddress] = reactExports.useState("");
  const [regPhone, setRegPhone] = reactExports.useState("");
  const [regCuisine, setRegCuisine] = reactExports.useState("");
  const [regLogo, setRegLogo] = reactExports.useState(null);
  const [registering, setRegistering] = reactExports.useState(false);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [itemName, setItemName] = reactExports.useState("");
  const [itemDesc, setItemDesc] = reactExports.useState("");
  const [itemPrice, setItemPrice] = reactExports.useState("");
  const [itemCategory, setItemCategory] = reactExports.useState("");
  const [itemImage, setItemImage] = reactExports.useState(null);
  const [addingItem, setAddingItem] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
  function loadMenu(id) {
    actor == null ? void 0 : actor.getMenuByRestaurant(id).then(setMenu);
  }
  function loadOrders(id) {
    actor == null ? void 0 : actor.getOrdersByRestaurant(id).then((o) => setOrders(o.sort((a, b) => Number(b.id) - Number(a.id))));
  }
  async function registerRestaurant(e) {
    e.preventDefault();
    if (!actor) return;
    setRegistering(true);
    try {
      let logo = null;
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
        logo
      );
      const r = await actor.getMyRestaurant();
      setRestaurant(r ?? null);
      setTab("dashboard");
    } finally {
      setRegistering(false);
    }
  }
  async function addMenuItem(e) {
    e.preventDefault();
    if (!actor || !restaurant) return;
    setAddingItem(true);
    try {
      let img = null;
      if (itemImage) {
        img = ExternalBlob.fromBytes(
          new Uint8Array(await itemImage.arrayBuffer())
        );
      }
      await actor.addMenuItem(
        restaurant.id,
        itemName,
        itemDesc,
        BigInt(Math.round(Number.parseFloat(itemPrice) * 100)),
        itemCategory,
        img
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
  async function deleteItem(id) {
    if (!actor || !restaurant) return;
    await actor.deleteMenuItem(id);
    loadMenu(restaurant.id);
  }
  async function toggleAvailability(item) {
    if (!actor) return;
    await actor.updateMenuItem(
      item.id,
      null,
      null,
      null,
      null,
      !item.isAvailable
    );
    if (restaurant) loadMenu(restaurant.id);
  }
  async function acceptOrder(orderId, accept) {
    if (!actor || !restaurant) return;
    await actor.acceptOrder(orderId, accept);
    loadOrders(restaurant.id);
  }
  async function updateStatus(orderId, status) {
    if (!actor || !restaurant) return;
    await actor.updateOrderStatus(orderId, status);
    loadOrders(restaurant.id);
  }
  if (loading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-primary", size: 40 }) });
  const navTabs = restaurant ? [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "menu", label: "Menu", icon: "🍽️" },
    { id: "orders", label: "Orders", icon: "📦" }
  ] : [{ id: "register", label: "Register", icon: "📝" }];
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const todayEarnings = earnings;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-lg font-bold", children: [
          "🍽️ ",
          restaurant ? restaurant.name : "Register Restaurant"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-75", children: profile.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "restaurant.home.button",
          onClick: onHome,
          className: "p-1 opacity-70 hover:opacity-100",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 20 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "restaurant.sign_out.button",
          onClick: onSignOut,
          className: "p-1 opacity-70 hover:opacity-100",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 20 })
        }
      )
    ] }),
    tab === "register" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 20 }),
        " Register Your Restaurant"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: registerRestaurant, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Restaurant Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "restaurant.reg_name.input",
              value: regName,
              onChange: (e) => setRegName(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "restaurant.reg_desc.input",
              value: regDesc,
              onChange: (e) => setRegDesc(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "restaurant.reg_address.input",
              value: regAddress,
              onChange: (e) => setRegAddress(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "restaurant.reg_phone.input",
              value: regPhone,
              onChange: (e) => setRegPhone(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cuisine Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "restaurant.reg_cuisine.input",
              placeholder: "Indian, Chinese, Italian...",
              value: regCuisine,
              onChange: (e) => setRegCuisine(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Logo (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-ocid": "restaurant.reg_logo.upload_button",
              type: "file",
              accept: "image/*",
              className: "block w-full text-sm mt-1",
              onChange: (e) => {
                var _a;
                return setRegLogo(((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "restaurant.register.submit_button",
            type: "submit",
            className: "w-full",
            disabled: registering,
            children: registering ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin mr-2", size: 16 }),
              "Submitting..."
            ] }) : "Submit for Approval"
          }
        )
      ] }) })
    ] }) }),
    tab === "dashboard" && restaurant && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-4", children: [
      !restaurant.isApproved && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-yellow-300 bg-yellow-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 text-yellow-800 text-sm", children: "⏳ Your restaurant is pending admin approval. You can set up your menu while you wait." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-primary", children: formatPrice(todayEarnings) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Total Earnings" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-orange-600", children: pendingOrders.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Pending Orders" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: orders.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Total Orders" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: menu.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Menu Items" })
        ] }) })
      ] }),
      pendingOrders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold mb-2", children: "Pending Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: pendingOrders.map((o, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": `restaurant.pending_order.item.${idx + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
                  "Order #",
                  String(o.id)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-primary", children: formatPrice(o.totalAmount) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mb-3", children: [
                o.items.length,
                " items • ",
                o.paymentMethod
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    "data-ocid": `restaurant.accept_order.button.${idx + 1}`,
                    onClick: () => acceptOrder(o.id, true),
                    children: "Accept"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "destructive",
                    "data-ocid": `restaurant.reject_order.button.${idx + 1}`,
                    onClick: () => acceptOrder(o.id, false),
                    children: "Reject"
                  }
                )
              ] })
            ] })
          },
          String(o.id)
        )) })
      ] })
    ] }),
    tab === "menu" && restaurant && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "restaurant.add_item.open_modal_button",
          className: "w-full",
          onClick: () => setShowAdd(!showAdd),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "mr-2" }),
            " ",
            showAdd ? "Cancel" : "Add Menu Item"
          ]
        }
      ),
      showAdd && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "restaurant.add_item.panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: addMenuItem, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "restaurant.item_name.input",
            placeholder: "Item name",
            value: itemName,
            onChange: (e) => setItemName(e.target.value),
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "restaurant.item_desc.input",
            placeholder: "Description",
            value: itemDesc,
            onChange: (e) => setItemDesc(e.target.value)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "restaurant.item_price.input",
            type: "number",
            step: "0.01",
            placeholder: "Price (₹)",
            value: itemPrice,
            onChange: (e) => setItemPrice(e.target.value),
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "restaurant.item_category.input",
            placeholder: "Category (e.g. Starters, Mains)",
            value: itemCategory,
            onChange: (e) => setItemCategory(e.target.value),
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "file",
            accept: "image/*",
            "data-ocid": "restaurant.item_image.upload_button",
            className: "block w-full text-sm",
            onChange: (e) => {
              var _a;
              return setItemImage(((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "restaurant.add_item.submit_button",
            type: "submit",
            disabled: addingItem,
            className: "w-full",
            children: addingItem ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin mr-2", size: 16 }),
              "Adding..."
            ] }) : "Add Item"
          }
        )
      ] }) }) }),
      menu.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "restaurant.menu.empty_state",
          className: "text-center py-12 text-muted-foreground",
          children: "No menu items yet. Add your first item!"
        }
      ) : menu.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          "data-ocid": `restaurant.menu.item.${idx + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
            item.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: item.imageUrl.getDirectURL(),
                className: "w-12 h-12 rounded-lg object-cover",
                alt: item.name
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-accent flex items-center justify-center", children: "🍛" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
                item.category,
                " • ",
                formatPrice(item.price)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `restaurant.toggle_availability.toggle.${idx + 1}`,
                  onClick: () => toggleAvailability(item),
                  className: `text-xs px-2 py-1 rounded-full ${item.isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`,
                  children: item.isAvailable ? "Available" : "Unavailable"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `restaurant.delete_item.delete_button.${idx + 1}`,
                  onClick: () => deleteItem(item.id),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16, className: "text-destructive" })
                }
              )
            ] })
          ] })
        },
        String(item.id)
      ))
    ] }),
    tab === "orders" && restaurant && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 space-y-3", children: orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "restaurant.orders.empty_state",
        className: "text-center py-12 text-muted-foreground",
        children: "No orders yet"
      }
    ) : orders.map((o, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        "data-ocid": `restaurant.orders.item.${idx + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
              "Order #",
              String(o.id)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs px-2 py-1 rounded-full font-medium ${statusColor(o.status)}`,
                children: o.status.replace(/_/g, " ")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mb-2", children: [
            o.items.length,
            " items • ",
            formatPrice(o.totalAmount)
          ] }),
          o.status === "accepted" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              "data-ocid": `restaurant.preparing.button.${idx + 1}`,
              onClick: () => updateStatus(o.id, OrderStatus.preparing),
              children: "Mark Preparing"
            }
          ),
          o.status === "preparing" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              "data-ocid": `restaurant.ready.button.${idx + 1}`,
              onClick: () => updateStatus(o.id, OrderStatus.ready_for_pickup),
              children: "Ready for Pickup"
            }
          )
        ] })
      },
      String(o.id)
    )) }),
    restaurant && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-card border-t flex", children: navTabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `restaurant.nav.${t.id}.tab`,
        onClick: () => setTab(t.id),
        className: `flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${tab === t.id ? "text-primary" : "text-muted-foreground"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.label })
        ]
      },
      t.id
    )) })
  ] });
}
export {
  RestaurantPage as default
};
