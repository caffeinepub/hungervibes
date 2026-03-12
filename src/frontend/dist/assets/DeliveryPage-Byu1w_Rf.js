import { c as createLucideIcon, a as useActor, u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, L as LoaderCircle, O as OrderStatus } from "./index-DkujsoJm.js";
import { B as Button, C as Card, d as CardContent } from "./card-iRxg37tM.js";
import { S as Skeleton } from "./skeleton-DJh90DmI.js";
import { H as House, L as LogOut } from "./log-out-NEY36zRs.js";
import { P as Package } from "./package-DJBFpxnN.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M6 3h12", key: "ggurg9" }],
  ["path", { d: "M6 8h12", key: "6g4wlu" }],
  ["path", { d: "m6 13 8.5 8", key: "u1kupk" }],
  ["path", { d: "M6 13h3", key: "wdp6ag" }],
  ["path", { d: "M9 13c6.667 0 6.667-10 0-10", key: "1nkvk2" }]
];
const IndianRupee = createLucideIcon("indian-rupee", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polygon", { points: "3 11 22 2 13 21 11 13 3 11", key: "1ltx0t" }]
];
const Navigation = createLucideIcon("navigation", __iconNode);
function formatPrice(p) {
  return `₹${(Number(p) / 100).toFixed(0)}`;
}
function DeliveryPage({
  profile,
  onSignOut,
  onHome
}) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [tab, setTab] = reactExports.useState("available");
  const [availableOrders, setAvailableOrders] = reactExports.useState([]);
  const [assignedOrders, setAssignedOrders] = reactExports.useState([]);
  const [activeOrders, setActiveOrders] = reactExports.useState([]);
  const [deliveryHistory, setDeliveryHistory] = reactExports.useState([]);
  const [earnings, setEarnings] = reactExports.useState(0n);
  const [loading, setLoading] = reactExports.useState(true);
  const [responding, setResponding] = reactExports.useState(null);
  async function loadData() {
    if (!actor || !identity) return;
    setLoading(true);
    try {
      const principal = identity.getPrincipal();
      const [all, earn] = await Promise.all([
        actor.getAllOrders(),
        actor.getDeliveryAgentEarnings(principal)
      ]);
      setAvailableOrders(
        all.filter((o) => o.status === "ready_for_pickup" && !o.deliveryAgentId).sort((a, b) => Number(b.id) - Number(a.id))
      );
      const myPrincipalStr = principal.toString();
      setAssignedOrders(
        all.filter(
          (o) => {
            var _a;
            return o.status === "ready_for_pickup" && ((_a = o.deliveryAgentId) == null ? void 0 : _a.toString()) === myPrincipalStr;
          }
        ).sort((a, b) => Number(b.id) - Number(a.id))
      );
      setActiveOrders(
        all.filter(
          (o) => {
            var _a;
            return o.status === "picked_up" && ((_a = o.deliveryAgentId) == null ? void 0 : _a.toString()) === myPrincipalStr;
          }
        ).sort((a, b) => Number(b.id) - Number(a.id))
      );
      setDeliveryHistory(
        all.filter(
          (o) => {
            var _a;
            return ["delivered", "cancelled"].includes(o.status) && ((_a = o.deliveryAgentId) == null ? void 0 : _a.toString()) === myPrincipalStr;
          }
        ).sort((a, b) => Number(b.id) - Number(a.id))
      );
      setEarnings(earn);
    } finally {
      setLoading(false);
    }
  }
  reactExports.useEffect(() => {
    loadData();
  }, [actor, identity]);
  async function respondToAssignment(orderId, accept) {
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
  async function markDelivered(orderId) {
    await (actor == null ? void 0 : actor.updateOrderStatus(orderId, OrderStatus.delivered));
    loadData();
  }
  if (!profile.isVerified) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen flex flex-col items-center justify-center px-4 py-8",
        style: {
          background: "linear-gradient(135deg, oklch(0.97 0.03 80), oklch(0.99 0.01 60))"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 text-center space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl", children: "⏳" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: "Verification Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: "Your delivery agent account is under review by our admin team. You'll be able to start accepting deliveries once your profile is approved." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-left space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-yellow-800", children: "What happens next?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-yellow-700", children: "Our admin team will review your profile and approve it shortly. Check back in a few hours." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "delivery.pending.home.button",
                variant: "outline",
                className: "w-full",
                onClick: onHome,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 16, className: "mr-2" }),
                  "Back to Home"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "delivery.pending.sign_out.button",
                variant: "ghost",
                className: "w-full text-muted-foreground",
                onClick: onSignOut,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16, className: "mr-2" }),
                  "Sign Out"
                ]
              }
            )
          ] })
        ] })
      }
    );
  }
  const assignedCount = assignedOrders.length;
  const activeCount = activeOrders.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold", children: "🛵 HungerVibes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-75", children: profile.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "delivery.home.button",
          onClick: onHome,
          className: "p-1 opacity-70 hover:opacity-100",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 20 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "delivery.sign_out.button",
          onClick: onSignOut,
          className: "p-1 opacity-70 hover:opacity-100",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 20 })
        }
      )
    ] }),
    tab === "available" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-4", children: [
      assignedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-sm mb-2 text-indigo-700", children: [
          "📋 Assigned to You (",
          assignedCount,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: assignedOrders.map((o, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": `delivery.assigned.item.${idx + 1}`,
            className: "border-indigo-300 bg-indigo-50",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
                  "Order #",
                  String(o.id)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-primary font-bold", children: [
                  formatPrice(o.deliveryFee),
                  " earning"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mb-1", children: [
                "📍 ",
                o.deliveryAddress
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mb-3", children: [
                o.items.length,
                " items • Order total",
                " ",
                formatPrice(o.totalAmount)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": `delivery.accept_assignment.button.${idx + 1}`,
                    className: "flex-1",
                    disabled: responding === o.id,
                    onClick: () => respondToAssignment(o.id, true),
                    children: [
                      responding === o.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin mr-1", size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 14, className: "mr-1" }),
                      "Accept"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `delivery.decline_assignment.button.${idx + 1}`,
                    variant: "outline",
                    className: "flex-1",
                    disabled: responding === o.id,
                    onClick: () => respondToAssignment(o.id, false),
                    children: "Decline"
                  }
                )
              ] })
            ] })
          },
          String(o.id)
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-muted-foreground text-sm mb-2", children: "🔍 Available Deliveries" }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "delivery.available.loading_state",
            className: "space-y-3",
            children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i))
          }
        ) : availableOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "delivery.available.empty_state",
            className: "text-center py-10 text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 36, className: "mx-auto mb-2 opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No unassigned orders right now" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "mt-3",
                  onClick: loadData,
                  children: "Refresh"
                }
              )
            ]
          }
        ) : availableOrders.map((o, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": `delivery.available.item.${idx + 1}`,
            className: "mb-3",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
                  "Order #",
                  String(o.id)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-primary font-bold", children: formatPrice(o.deliveryFee) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mb-1", children: [
                "📍 ",
                o.deliveryAddress
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mb-3", children: [
                o.items.length,
                " items • ",
                formatPrice(o.totalAmount)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Self-pickup available — restaurant hasn't assigned an agent yet." })
            ] })
          },
          String(o.id)
        ))
      ] })
    ] }),
    tab === "active" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-muted-foreground text-sm", children: "Active Deliveries" }),
      activeOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "delivery.active.empty_state",
          className: "text-center py-16 text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 40, className: "mx-auto mb-3 opacity-40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No active deliveries" })
          ]
        }
      ) : activeOrders.map((o, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          "data-ocid": `delivery.active.item.${idx + 1}`,
          className: "border-primary",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold mb-1", children: [
              "Order #",
              String(o.id)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mb-1", children: [
              "Deliver to: ",
              o.deliveryAddress
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mb-3", children: [
              o.items.length,
              " items • ",
              formatPrice(o.totalAmount)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": `delivery.delivered.button.${idx + 1}`,
                className: "w-full",
                onClick: () => markDelivered(o.id),
                children: "Mark Delivered ✓"
              }
            )
          ] })
        },
        String(o.id)
      ))
    ] }),
    tab === "earnings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { size: 32, className: "mx-auto mb-2 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-primary", children: formatPrice(earnings) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Total Earnings" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Delivery History" }),
      deliveryHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "delivery.history.empty_state",
          className: "text-center py-8 text-muted-foreground",
          children: "No completed deliveries yet"
        }
      ) : deliveryHistory.map((o, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          "data-ocid": `delivery.history.item.${idx + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
                "Order #",
                String(o.id)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: o.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-primary", children: formatPrice(o.deliveryFee) })
          ] })
        },
        String(o.id)
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-card border-t flex", children: ["available", "active", "earnings"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `delivery.nav.${t}.tab`,
        onClick: () => setTab(t),
        className: `flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors relative ${tab === t ? "text-primary" : "text-muted-foreground"}`,
        children: [
          t === "available" && assignedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-4 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold", children: assignedCount }),
          t === "active" && activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-4 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold", children: activeCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t === "available" ? "🔍" : t === "active" ? "🛵" : "💰" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t === "available" ? "Available" : t === "active" ? "Active" : "Earnings" })
        ]
      },
      t
    )) })
  ] });
}
export {
  DeliveryPage as default
};
