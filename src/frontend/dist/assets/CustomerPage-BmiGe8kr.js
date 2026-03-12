import { c as createLucideIcon, a as useActor, u as useInternetIdentity, r as reactExports, P as PaymentMethod, j as jsxRuntimeExports, L as LoaderCircle } from "./index-BtK-op7o.js";
import { C as Card, d as CardContent, B as Button } from "./card-BkwWiKJ7.js";
import { I as Input } from "./input-BVmkI-cr.js";
import { S as Skeleton } from "./skeleton-Ba_mmJle.js";
import { H as House, L as LogOut } from "./log-out-D3kHsyDp.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
];
const ShoppingCart = createLucideIcon("shopping-cart", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
function formatPrice(p) {
  return `₹${(Number(p) / 100).toFixed(0)}`;
}
function statusColor(s) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    ready_for_pickup: "bg-purple-100 text-purple-800",
    picked_up: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800"
  };
  return map[s] || "bg-gray-100 text-gray-800";
}
function CustomerPage({
  profile: _profile,
  onSignOut,
  onHome
}) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [tab, setTab] = reactExports.useState("home");
  const [restaurants, setRestaurants] = reactExports.useState([]);
  const [search, setSearch] = reactExports.useState("");
  const [loadingRest, setLoadingRest] = reactExports.useState(true);
  const [selectedRest, setSelectedRest] = reactExports.useState(null);
  const [menu, setMenu] = reactExports.useState([]);
  const [loadingMenu, setLoadingMenu] = reactExports.useState(false);
  const [cart, setCart] = reactExports.useState([]);
  const [deliveryAddress, setDeliveryAddress] = reactExports.useState("");
  const [paymentMethod, setPaymentMethod] = reactExports.useState(
    PaymentMethod.cash
  );
  const [couponCode, setCouponCode] = reactExports.useState("");
  const [couponValid, setCouponValid] = reactExports.useState(null);
  const [placingOrder, setPlacingOrder] = reactExports.useState(false);
  const [orders, setOrders] = reactExports.useState([]);
  const [loadingOrders, setLoadingOrders] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!actor) return;
    actor.getAllRestaurants().then((r) => {
      setRestaurants(r.filter((x) => x.isApproved && !x.isSuspended));
      setLoadingRest(false);
    });
  }, [actor]);
  function openRestaurant(r) {
    setSelectedRest(r);
    setMenu([]);
    setLoadingMenu(true);
    setTab("restaurant");
    actor == null ? void 0 : actor.getMenuByRestaurant(r.id).then((m) => {
      setMenu(m.filter((i) => i.isAvailable));
      setLoadingMenu(false);
    });
  }
  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing)
        return prev.map(
          (c) => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      return [...prev, { item, qty: 1 }];
    });
  }
  function updateQty(itemId, delta) {
    setCart((prev) => {
      const updated = prev.map((c) => c.item.id === itemId ? { ...c, qty: c.qty + delta } : c).filter((c) => c.qty > 0);
      return updated;
    });
  }
  const cartTotal = cart.reduce(
    (sum, c) => sum + Number(c.item.price) * c.qty,
    0
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
      const items = cart.map((c) => ({
        foodItemId: c.item.id,
        quantity: BigInt(c.qty),
        price: c.item.price
      }));
      await actor.placeOrder(
        selectedRest.id,
        items,
        deliveryAddress,
        paymentMethod,
        couponCode || null
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
  reactExports.useEffect(() => {
    if (tab === "orders") loadOrders();
  }, [tab, actor]);
  const filtered = restaurants.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisineType.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3", children: [
      tab !== "home" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setTab("home"),
          "data-ocid": "customer.nav.back.button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold flex-1", children: tab === "home" ? "🔥 HungerVibes" : tab === "restaurant" ? selectedRest == null ? void 0 : selectedRest.name : tab === "cart" ? "Your Cart" : "Your Orders" }),
      tab === "home" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setTab("cart"),
            "data-ocid": "customer.cart.button",
            className: "relative",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 22 }),
              cartCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold", children: cartCount })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "customer.home.button",
            onClick: onHome,
            className: "p-1 opacity-70 hover:opacity-100",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "customer.sign_out.button",
            onClick: onSignOut,
            className: "p-1 opacity-70 hover:opacity-100",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 20 })
          }
        )
      ] })
    ] }),
    tab === "home" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Search,
          {
            size: 16,
            className: "absolute left-3 top-3 text-muted-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "customer.search_input",
            className: "pl-9",
            placeholder: "Search restaurants or cuisines",
            value: search,
            onChange: (e) => setSearch(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-muted-foreground", children: "Restaurants near you" }),
      loadingRest ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "customer.restaurants.empty_state",
          className: "text-center py-12 text-muted-foreground",
          children: "No restaurants found"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((r, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          "data-ocid": `customer.restaurant.item.${idx + 1}`,
          className: "cursor-pointer hover:shadow-md transition-shadow",
          onClick: () => openRestaurant(r),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex gap-3", children: [
            r.logo ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: r.logo.getDirectURL(),
                alt: r.name,
                className: "w-16 h-16 rounded-lg object-cover flex-shrink-0"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-2xl flex-shrink-0", children: "🍽️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate", children: r.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: r.cuisineType }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 12, className: "text-yellow-500" }),
                  " 4.2"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }),
                  " 25-35 min"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12 }),
                  " ",
                  r.address.slice(0, 20)
                ] })
              ] })
            ] })
          ] })
        },
        String(r.id)
      )) })
    ] }),
    tab === "restaurant" && selectedRest && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        selectedRest.cuisineType,
        " • ",
        selectedRest.address
      ] }) }),
      loadingMenu ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "customer.menu.loading_state", className: "space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: menu.map((item, idx) => {
        const cartItem = cart.find((c) => c.item.id === item.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": `customer.menu.item.${idx + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex gap-3", children: [
              item.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: item.imageUrl.getDirectURL(),
                  alt: item.name,
                  className: "w-16 h-16 rounded-lg object-cover flex-shrink-0"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-2xl flex-shrink-0", children: "🍛" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: item.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: item.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-primary mt-1", children: formatPrice(item.price) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: cartItem ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => updateQty(item.id, -1),
                    "data-ocid": `customer.menu.decrease.button.${idx + 1}`,
                    className: "w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold",
                    children: "-"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-center font-semibold", children: cartItem.qty }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => updateQty(item.id, 1),
                    "data-ocid": `customer.menu.increase.button.${idx + 1}`,
                    className: "w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold",
                    children: "+"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  "data-ocid": `customer.menu.add.button.${idx + 1}`,
                  onClick: () => addToCart(item),
                  children: "Add"
                }
              ) })
            ] })
          },
          String(item.id)
        );
      }) }),
      cartCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-20 left-0 right-0 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "customer.view_cart.button",
          className: "w-full h-12 text-base shadow-lg",
          onClick: () => setTab("cart"),
          children: [
            "View Cart (",
            cartCount,
            " items) • ",
            formatPrice(BigInt(cartTotal))
          ]
        }
      ) })
    ] }),
    tab === "cart" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 space-y-4", children: cart.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "customer.cart.empty_state",
        className: "text-center py-16 text-muted-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 40, className: "mx-auto mb-3 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your cart is empty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "mt-4",
              onClick: () => setTab("home"),
              children: "Browse Restaurants"
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: cart.map((c, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          "data-ocid": `customer.cart.item.${idx + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: c.item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-primary", children: formatPrice(c.item.price) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => updateQty(c.item.id, -1),
                  className: "w-7 h-7 rounded-full border flex items-center justify-center",
                  children: "-"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-center font-semibold", children: c.qty }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => updateQty(c.item.id, 1),
                  className: "w-7 h-7 rounded-full border flex items-center justify-center",
                  children: "+"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold w-16 text-right", children: formatPrice(BigInt(Number(c.item.price) * c.qty)) })
          ] })
        },
        String(c.item.id)
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Delivery Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "customer.delivery_address.input",
            placeholder: "Delivery address",
            value: deliveryAddress,
            onChange: (e) => setDeliveryAddress(e.target.value)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: Object.values(PaymentMethod).map((pm) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `customer.payment.${pm}.toggle`,
            onClick: () => setPaymentMethod(pm),
            className: `flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${paymentMethod === pm ? "border-primary bg-primary/10" : "border-border"}`,
            children: pm === "cash" ? "💵 Cash on Delivery" : "💳 Online Payment"
          },
          pm
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "customer.coupon.input",
              placeholder: "Coupon code",
              value: couponCode,
              onChange: (e) => {
                setCouponCode(e.target.value);
                setCouponValid(null);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              "data-ocid": "customer.coupon.button",
              onClick: checkCoupon,
              children: "Apply"
            }
          )
        ] }),
        couponValid === true && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-green-600 text-sm",
            "data-ocid": "customer.coupon.success_state",
            children: "Coupon applied!"
          }
        ),
        couponValid === false && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-destructive text-sm",
            "data-ocid": "customer.coupon.error_state",
            children: "Invalid or expired coupon"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-semibold text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: formatPrice(BigInt(cartTotal)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "customer.place_order.button",
          className: "w-full h-12 text-base",
          disabled: placingOrder || !deliveryAddress,
          onClick: placeOrder,
          children: placingOrder ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin mr-2", size: 18 }),
            " Placing Order..."
          ] }) : "Place Order"
        }
      )
    ] }) }),
    tab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 space-y-3", children: loadingOrders ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "customer.orders.loading_state",
        className: "space-y-3",
        children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i))
      }
    ) : orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "customer.orders.empty_state",
        className: "text-center py-16 text-muted-foreground",
        children: "No orders yet"
      }
    ) : orders.map((o, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        "data-ocid": `customer.orders.item.${idx + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
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
            " items • ",
            formatPrice(o.totalAmount)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: o.deliveryAddress }),
          o.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              size: "sm",
              className: "mt-2",
              "data-ocid": `customer.cancel_order.button.${idx + 1}`,
              onClick: () => actor == null ? void 0 : actor.cancelOrder(o.id).then(loadOrders),
              children: "Cancel"
            }
          )
        ] })
      },
      String(o.id)
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-0 left-0 right-0 bg-card border-t flex", children: [
      ["home", "orders"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `customer.nav.${t}.tab`,
          onClick: () => setTab(t),
          className: `flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${tab === t ? "text-primary" : "text-muted-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t === "home" ? "🏠" : "📦" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t === "home" ? "Home" : "Orders" })
          ]
        },
        t
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "customer.nav.cart.tab",
          onClick: () => setTab("cart"),
          className: `flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors relative ${tab === "cart" ? "text-primary" : "text-muted-foreground"}`,
          children: [
            cartCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-6 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center", children: cartCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🛒" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cart" })
          ]
        }
      )
    ] })
  ] });
}
export {
  CustomerPage as default
};
