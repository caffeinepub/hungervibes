import { u as useInternetIdentity, a as useActor, r as reactExports, R as Role, j as jsxRuntimeExports, B as Button } from "./index-BegdjZEk.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, L as LoaderCircle } from "./index-DqKgLoaQ.js";
import { I as Input } from "./input-UUBXsDbE.js";
import { L as Label } from "./label-BgFUJyJR.js";
import { c as createLucideIcon } from "./createLucideIcon-B-ETM2ot.js";
import { S as ShieldCheck } from "./shield-check-CqzgKPeW.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode);
function AuthPage({
  onRegistered,
  onAdminLogin,
  onBack,
  defaultRole,
  addingRole = false,
  existingName = "",
  existingPhone = ""
}) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();
  const [name, setName] = reactExports.useState(existingName);
  const [phone, setPhone] = reactExports.useState(existingPhone);
  const [role, setRole] = reactExports.useState(defaultRole ?? Role.customer);
  const [registering, setRegistering] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [submittedRole, setSubmittedRole] = reactExports.useState(null);
  const isLoggedIn = !!identity;
  async function handleRegister(e) {
    e.preventDefault();
    if (!actor || !name.trim() || !phone.trim()) return;
    setRegistering(true);
    setError("");
    try {
      await actor.registerUser(name.trim(), phone.trim(), role);
      if (role === Role.customer) {
        onRegistered == null ? void 0 : onRegistered();
      } else {
        setSubmittedRole(role);
        setSubmitted(true);
      }
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
      icon: "🛒",
      desc: "Order food from restaurants"
    },
    {
      value: Role.restaurant_owner,
      label: "Restaurant Partner",
      icon: "🏪",
      desc: "Manage your restaurant & menu"
    },
    {
      value: Role.delivery_agent,
      label: "Delivery Agent",
      icon: "🛵",
      desc: "Deliver orders & earn"
    }
  ];
  const roleLabels = {
    [Role.customer]: "Customer",
    [Role.restaurant_owner]: "Restaurant Partner",
    [Role.delivery_agent]: "Delivery Agent"
  };
  if (submitted && submittedRole) {
    const isPending = submittedRole !== Role.customer;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen flex flex-col items-center justify-center px-4 py-8",
        style: {
          background: "linear-gradient(135deg, oklch(0.95 0.05 60), oklch(0.98 0.03 30))"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl", children: isPending ? "⏳" : "✅" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "text-green-500", size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground", children: isPending ? "Application Submitted!" : "Welcome aboard!" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Your ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: roleLabels[submittedRole] }),
            " application has been submitted successfully. Our admin team will review and approve it shortly. You'll be able to access the panel once approved."
          ] }) : "Your account has been created successfully!" }),
          isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-orange-800 mb-1", children: "What happens next?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-orange-700", children: "The admin will review your profile and approve it. Check back in a few hours." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3 pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "auth.submitted.home.button",
              variant: "outline",
              className: "w-full",
              onClick: onBack,
              children: "Back to Home"
            }
          ) })
        ] })
      }
    );
  }
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Welcome Back" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Sign in or create an account" })
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
                ] }) : "Login or Sign Up"
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: addingRole ? "Add a New Role" : "Complete your profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: addingRole ? "Register an additional role for your account" : "Tell us how you'll use HungerVibes" })
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
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: addingRole ? "Select role to add..." : "I want to join as..." }),
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
                  addingRole ? "Submitting..." : "Creating account..."
                ] }) : addingRole ? "Submit Application" : "Create Account"
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
