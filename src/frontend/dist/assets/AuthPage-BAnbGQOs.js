import { u as useInternetIdentity, a as useActor, r as reactExports, R as Role, j as jsxRuntimeExports, L as LoaderCircle } from "./index-CpqKU1zb.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, B as Button } from "./card-BCEnsvtS.js";
import { I as Input } from "./input-BaVH8GNb.js";
import { L as Label } from "./label-B2stBytr.js";
import { S as ShieldCheck } from "./shield-check-Dcl1SVFk.js";
function AuthPage({
  onRegistered,
  onAdminLogin,
  onBack,
  defaultRole
}) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [role, setRole] = reactExports.useState(defaultRole ?? Role.customer);
  const [registering, setRegistering] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const isLoggedIn = !!identity;
  async function handleRegister(e) {
    e.preventDefault();
    if (!actor || !name.trim() || !phone.trim()) return;
    setRegistering(true);
    setError("");
    try {
      await actor.registerUser(name.trim(), phone.trim(), role);
      onRegistered == null ? void 0 : onRegistered();
    } catch (_err) {
      setError("Registration failed. Please try again.");
    } finally {
      setRegistering(false);
    }
  }
  const roles = [
    {
      value: Role.customer,
      label: "Customer",
      icon: "🍽️",
      desc: "Order food from restaurants"
    },
    {
      value: Role.restaurant_owner,
      label: "Restaurant Owner",
      icon: "🏪",
      desc: "Manage your restaurant"
    },
    {
      value: Role.delivery_agent,
      label: "Delivery Agent",
      icon: "🛵",
      desc: "Deliver orders & earn"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex flex-col items-center justify-center px-4 py-8",
      style: {
        background: "linear-gradient(135deg, oklch(0.95 0.05 60), oklch(0.98 0.03 30))"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
          onBack && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "auth.home.button",
              onClick: onBack,
              className: "mb-4 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto",
              children: "← Back to Home"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold text-primary mb-1", children: "🔥 HungerVibes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Delicious food, delivered fast" })
        ] }),
        !isLoggedIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-sm shadow-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Welcome" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Sign in to continue" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "auth.primary_button",
                className: "w-full h-12 text-base",
                onClick: () => login(),
                disabled: loginStatus === "logging-in",
                children: loginStatus === "logging-in" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin mr-2", size: 18 }),
                  " Signing in..."
                ] }) : "Sign in with Internet Identity"
              }
            ),
            onAdminLogin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "auth.admin_portal.button",
                onClick: onAdminLogin,
                className: "w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 15 }),
                  "Admin Portal"
                ]
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md shadow-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Complete your profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Tell us about yourself to get started" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRegister, className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Full Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "name",
                  "data-ocid": "auth.name.input",
                  placeholder: "Your full name",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "phone",
                  "data-ocid": "auth.phone.input",
                  placeholder: "+91 9876543210",
                  value: phone,
                  onChange: (e) => setPhone(e.target.value),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "I am a..." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2", children: roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `auth.role.${r.value}.toggle`,
                  onClick: () => setRole(r.value),
                  className: `flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${role === r.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: r.icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: r.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: r.desc })
                    ] })
                  ]
                },
                r.value
              )) })
            ] }),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-sm text-destructive",
                "data-ocid": "auth.error_state",
                children: error
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "auth.submit_button",
                type: "submit",
                className: "w-full h-12 text-base",
                disabled: registering || !name.trim() || !phone.trim(),
                children: registering ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin mr-2", size: 18 }),
                  " Creating account..."
                ] }) : "Get Started"
              }
            ),
            onAdminLogin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "auth.admin_portal.button",
                onClick: onAdminLogin,
                className: "w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 15 }),
                  "Admin Portal"
                ]
              }
            )
          ] }) })
        ] })
      ]
    }
  );
}
export {
  AuthPage as default
};
