import { c as createLucideIcon, a as useActor, r as reactExports, j as jsxRuntimeExports, L as LoaderCircle, R as Role } from "./index-CpqKU1zb.js";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle, B as Button } from "./card-BCEnsvtS.js";
import { I as Input } from "./input-BaVH8GNb.js";
import { L as Label } from "./label-B2stBytr.js";
import { S as Skeleton } from "./skeleton-BTCqfcEc.js";
import { H as House, L as LogOut } from "./log-out--cBgw6l1.js";
import { P as Package } from "./package-CMmrWXFe.js";
import { S as Store } from "./store-ChKt0_R1.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
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
function AdminPage({
  profile: _profile,
  onSignOut,
  onHome
}) {
  const { actor } = useActor();
  const [tab, setTab] = reactExports.useState("dashboard");
  const [restaurants, setRestaurants] = reactExports.useState([]);
  const [orders, setOrders] = reactExports.useState([]);
  const [customers, setCustomers] = reactExports.useState([]);
  const [agents, setAgents] = reactExports.useState([]);
  const [_owners, setOwners] = reactExports.useState([]);
  const [revenue, setRevenue] = reactExports.useState(0n);
  const [analytics, setAnalytics] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [cpCode, setCpCode] = reactExports.useState("");
  const [cpDiscount, setCpDiscount] = reactExports.useState("");
  const [cpMaxUses, setCpMaxUses] = reactExports.useState("");
  const [cpExpiry, setCpExpiry] = reactExports.useState("");
  const [savingCoupon, setSavingCoupon] = reactExports.useState(false);
  async function loadAll() {
    if (!actor) return;
    setLoading(true);
    try {
      const [rests, allOrders, cust, ag, own, rev, anal] = await Promise.all([
        actor.getAllRestaurants(),
        actor.getAllOrders(),
        actor.getUsersByRole(Role.customer),
        actor.getUsersByRole(Role.delivery_agent),
        actor.getUsersByRole(Role.restaurant_owner),
        actor.getPlatformRevenue(),
        actor.getAnalytics()
      ]);
      setRestaurants(rests);
      setOrders(allOrders.sort((a, b) => Number(b.id) - Number(a.id)));
      setCustomers(cust);
      setAgents(ag);
      setOwners(own);
      setRevenue(rev);
      setAnalytics(
        anal
      );
    } finally {
      setLoading(false);
    }
  }
  reactExports.useEffect(() => {
    loadAll();
  }, [actor]);
  async function approveRest(id) {
    await (actor == null ? void 0 : actor.approveRestaurant(id));
    loadAll();
  }
  async function rejectRest(id) {
    await (actor == null ? void 0 : actor.rejectRestaurant(id));
    loadAll();
  }
  async function suspendRest(id) {
    await (actor == null ? void 0 : actor.suspendRestaurant(id));
    loadAll();
  }
  async function createCoupon(e) {
    e.preventDefault();
    if (!actor) return;
    setSavingCoupon(true);
    try {
      const expiryMs = new Date(cpExpiry).getTime();
      await actor.createCoupon(
        cpCode,
        BigInt(cpDiscount),
        BigInt(cpMaxUses),
        BigInt(expiryMs)
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
    (r) => !r.isApproved && !r.isSuspended
  );
  const approvedRestaurants = restaurants.filter((r) => r.isApproved);
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "restaurants", label: "Restaurants", icon: "🏪" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "orders", label: "Orders", icon: "📦" },
    { id: "coupons", label: "Coupons", icon: "🎟️" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-52 bg-sidebar text-sidebar-foreground flex flex-col py-4 hidden md:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "🔥 HungerVibes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-60", children: "Admin Panel" })
      ] }),
      navItems.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `admin.nav.${n.id}.tab`,
          onClick: () => setTab(n.id),
          className: `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${tab === n.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: n.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: n.label })
          ]
        },
        n.id
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto px-2 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "admin.home.button",
            onClick: onHome,
            className: "flex items-center gap-3 px-4 py-3 text-sm font-medium w-full hover:bg-sidebar-accent/50 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Home" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "admin.sign_out.button",
            onClick: onSignOut,
            className: "flex items-center gap-3 px-4 py-3 text-sm font-medium w-full hover:bg-sidebar-accent/50 transition-colors text-red-400",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sign Out" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden bg-primary text-primary-foreground px-4 py-3 flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold", children: "🔥 Admin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: navItems.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `admin.mobile.nav.${n.id}.tab`,
            onClick: () => setTab(n.id),
            className: `p-1 text-sm ${tab === n.id ? "opacity-100" : "opacity-60"}`,
            children: n.icon
          },
          n.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "admin.loading_state", className: "space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        tab === "dashboard" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: "Platform Overview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TrendingUp,
                {
                  className: "mx-auto mb-1 text-primary",
                  size: 24
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-primary", children: formatPrice(revenue) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Platform Revenue" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "mx-auto mb-1", size: 24 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold", children: (analytics == null ? void 0 : analytics.totalOrders.toString()) ?? "0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Total Orders" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "mx-auto mb-1", size: 24 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold", children: approvedRestaurants.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Restaurants" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mx-auto mb-1", size: 24 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold", children: customers.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Customers" })
            ] }) })
          ] }),
          pendingRestaurants.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-yellow-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm text-yellow-800", children: [
              "⚠️ ",
              pendingRestaurants.length,
              " restaurant(s) pending approval"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                "data-ocid": "admin.go_to_restaurants.button",
                onClick: () => setTab("restaurants"),
                children: "Review Now"
              }
            ) })
          ] }),
          analytics && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Orders by Status" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: analytics.ordersByStatus.map(([status, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex justify-between items-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-xs px-2 py-1 rounded-full font-medium ${statusColor(status)}`,
                      children: status.replace(/_/g, " ")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: count.toString() })
                ]
              },
              status
            )) }) })
          ] })
        ] }),
        tab === "restaurants" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: "Restaurants" }),
          pendingRestaurants.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-sm text-muted-foreground mb-2", children: [
              "Pending Approval (",
              pendingRestaurants.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: pendingRestaurants.map((r, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                "data-ocid": `admin.pending_restaurant.item.${idx + 1}`,
                className: "border-yellow-300",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: r.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
                    r.cuisineType,
                    " • ",
                    r.address
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        "data-ocid": `admin.approve_restaurant.button.${idx + 1}`,
                        onClick: () => approveRest(r.id),
                        children: "Approve"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "destructive",
                        "data-ocid": `admin.reject_restaurant.button.${idx + 1}`,
                        onClick: () => rejectRest(r.id),
                        children: "Reject"
                      }
                    )
                  ] })
                ] })
              },
              String(r.id)
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-sm text-muted-foreground mb-2", children: [
              "All Restaurants (",
              restaurants.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: restaurants.map((r, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                "data-ocid": `admin.restaurant.item.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: r.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: r.cuisineType }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mt-1", children: [
                      r.isApproved && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full", children: "Approved" }),
                      r.isSuspended && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full", children: "Suspended" }),
                      !r.isApproved && !r.isSuspended && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full", children: "Pending" })
                    ] })
                  ] }),
                  r.isApproved && !r.isSuspended && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "destructive",
                      "data-ocid": `admin.suspend_restaurant.button.${idx + 1}`,
                      onClick: () => suspendRest(r.id),
                      children: "Suspend"
                    }
                  )
                ] })
              },
              String(r.id)
            )) })
          ] })
        ] }),
        tab === "users" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: "Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-sm", children: [
              "Delivery Agents (",
              agents.length,
              ")"
            ] }),
            agents.map((u, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                "data-ocid": `admin.agent.item.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: u.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: u.phone }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mt-1", children: [
                    u.isVerified ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full", children: "Verified" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full", children: "Unverified" }),
                    u.isSuspended && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full", children: "Suspended" })
                  ] })
                ] }) })
              },
              `${u.name}-${u.phone}`
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-sm mt-4", children: [
              "Customers (",
              customers.length,
              ")"
            ] }),
            customers.map((u, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                "data-ocid": `admin.customer.item.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: u.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: u.phone })
                ] })
              },
              `${u.name}-${u.phone}`
            ))
          ] })
        ] }),
        tab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold", children: [
            "All Orders (",
            orders.length,
            ")"
          ] }),
          orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "admin.orders.empty_state",
              className: "text-center py-12 text-muted-foreground",
              children: "No orders yet"
            }
          ) : orders.map((o, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              "data-ocid": `admin.order.item.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
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
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
                  o.items.length,
                  " items •",
                  " ",
                  formatPrice(o.totalAmount),
                  " • ",
                  o.paymentMethod
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: o.deliveryAddress })
              ] })
            },
            String(o.id)
          ))
        ] }),
        tab === "coupons" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: "Coupons" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Create Coupon" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: createCoupon, className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Coupon Code" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "admin.coupon_code.input",
                    placeholder: "SUMMER20",
                    value: cpCode,
                    onChange: (e) => setCpCode(e.target.value.toUpperCase()),
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Discount %" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "admin.coupon_discount.input",
                    type: "number",
                    min: "1",
                    max: "100",
                    placeholder: "20",
                    value: cpDiscount,
                    onChange: (e) => setCpDiscount(e.target.value),
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Max Uses" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "admin.coupon_maxuses.input",
                    type: "number",
                    min: "1",
                    placeholder: "100",
                    value: cpMaxUses,
                    onChange: (e) => setCpMaxUses(e.target.value),
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Expiry Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "admin.coupon_expiry.input",
                    type: "date",
                    value: cpExpiry,
                    onChange: (e) => setCpExpiry(e.target.value),
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "admin.create_coupon.submit_button",
                  type: "submit",
                  disabled: savingCoupon,
                  className: "w-full",
                  children: savingCoupon ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      LoaderCircle,
                      {
                        className: "animate-spin mr-2",
                        size: 16
                      }
                    ),
                    "Creating..."
                  ] }) : "Create Coupon"
                }
              )
            ] }) })
          ] })
        ] })
      ] }) })
    ] })
  ] }) });
}
export {
  AdminPage as default
};
