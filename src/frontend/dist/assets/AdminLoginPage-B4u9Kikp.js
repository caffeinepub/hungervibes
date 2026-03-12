import { c as createLucideIcon, u as useInternetIdentity, a as useActor, r as reactExports, j as jsxRuntimeExports, L as LoaderCircle } from "./index-BtK-op7o.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, B as Button } from "./card-BkwWiKJ7.js";
import { I as Input } from "./input-BVmkI-cr.js";
import { L as Label } from "./label-sgM_1b6w.js";
import { S as ShieldCheck } from "./shield-check-BCzafOOf.js";
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
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
];
const KeyRound = createLucideIcon("key-round", __iconNode);
function AdminLoginPage({ onSuccess, onBack }) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();
  const [token, setToken] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!actor || !token.trim()) return;
    setLoading(true);
    setError("");
    try {
      await actor._initializeAccessControlWithSecret(token.trim());
      setSuccess(true);
      setTimeout(() => onSuccess(), 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already assigned") || msg.includes("adminAssigned")) {
        const isAdmin = await actor.isCallerAdmin();
        if (isAdmin) {
          setSuccess(true);
          setTimeout(() => onSuccess(), 1200);
        } else {
          setError(
            "An admin is already registered. Only that admin can log in here."
          );
        }
      } else if (msg.includes("invalid") || msg.includes("token") || msg.includes("secret")) {
        setError("Invalid admin secret. Please check the token and try again.");
      } else {
        setError("Access denied. The secret token is incorrect.");
      }
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex flex-col items-center justify-center px-4 py-8",
      style: {
        background: "linear-gradient(135deg, oklch(0.18 0.04 260), oklch(0.22 0.06 240))"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "text-primary", size: 36 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-white", children: "HungerVibes" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-sm", children: "Admin Portal" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-sm shadow-2xl border-white/10 bg-white/5 backdrop-blur text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-white flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 20 }),
              " Admin Login"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/50", children: "Sign in with Internet Identity, then enter your admin secret token" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            !identity ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "admin_login.ii.primary_button",
                className: "w-full h-11",
                onClick: () => login(),
                disabled: loginStatus === "logging-in",
                children: loginStatus === "logging-in" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin mr-2", size: 16 }),
                  " Signing in..."
                ] }) : "Sign in with Internet Identity"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "admin_login.ii.success_state",
                className: "flex items-center gap-2 text-sm text-green-400 bg-green-400/10 rounded-lg px-3 py-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 16 }),
                  "Identity verified. Enter your admin token below."
                ]
              }
            ),
            identity && !success && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70", children: "Admin Secret Token" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "admin_login.token.input",
                    type: "password",
                    placeholder: "Enter admin secret token",
                    value: token,
                    onChange: (e) => setToken(e.target.value),
                    className: "bg-white/10 border-white/20 text-white placeholder:text-white/30",
                    required: true
                  }
                )
              ] }),
              error && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": "admin_login.error_state",
                  className: "text-sm text-red-400 bg-red-400/10 rounded px-3 py-2",
                  children: error
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "admin_login.submit_button",
                  type: "submit",
                  className: "w-full h-11",
                  disabled: loading || !token.trim(),
                  children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin mr-2", size: 16 }),
                    " ",
                    "Verifying..."
                  ] }) : "Access Admin Panel"
                }
              )
            ] }),
            success && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "admin_login.success_state",
                className: "flex items-center gap-2 text-sm text-green-400 bg-green-400/10 rounded-lg px-3 py-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 16 }),
                  "Access granted! Redirecting to Admin Panel..."
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "admin_login.back.button",
            onClick: onBack,
            className: "mt-6 text-sm text-white/40 hover:text-white/70 transition-colors",
            children: "Back to main login"
          }
        )
      ]
    }
  );
}
export {
  AdminLoginPage as default
};
