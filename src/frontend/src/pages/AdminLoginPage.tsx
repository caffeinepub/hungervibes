import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Props {
  onSuccess: () => void;
  onBack: () => void;
}

export default function AdminLoginPage({ onSuccess, onBack }: Props) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
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
        // Admin already set -- check if this user is the admin
        const isAdmin = await actor.isCallerAdmin();
        if (isAdmin) {
          setSuccess(true);
          setTimeout(() => onSuccess(), 1200);
        } else {
          setError(
            "An admin is already registered. Only that admin can log in here.",
          );
        }
      } else if (
        msg.includes("invalid") ||
        msg.includes("token") ||
        msg.includes("secret")
      ) {
        setError("Invalid admin secret. Please check the token and try again.");
      } else {
        setError("Access denied. The secret token is incorrect.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.04 260), oklch(0.22 0.06 240))",
      }}
    >
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="text-primary" size={36} />
          <h1 className="text-3xl font-bold text-white">HungerVibes</h1>
        </div>
        <p className="text-white/60 text-sm">Admin Portal</p>
      </div>

      <Card className="w-full max-w-sm shadow-2xl border-white/10 bg-white/5 backdrop-blur text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <KeyRound size={20} /> Admin Login
          </CardTitle>
          <CardDescription className="text-white/50">
            Sign in with Internet Identity, then enter your admin secret token
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Internet Identity */}
          {!identity ? (
            <Button
              data-ocid="admin_login.ii.primary_button"
              className="w-full h-11"
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
            >
              {loginStatus === "logging-in" ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} /> Signing
                  in...
                </>
              ) : (
                "Sign in with Internet Identity"
              )}
            </Button>
          ) : (
            <div
              data-ocid="admin_login.ii.success_state"
              className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 rounded-lg px-3 py-2"
            >
              <ShieldCheck size={16} />
              Identity verified. Enter your admin token below.
            </div>
          )}

          {/* Step 2: Admin token (only shown after II login) */}
          {identity && !success && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-white/70">Admin Secret Token</Label>
                <Input
                  data-ocid="admin_login.token.input"
                  type="password"
                  placeholder="Enter admin secret token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
                  required
                />
              </div>
              {error && (
                <p
                  data-ocid="admin_login.error_state"
                  className="text-sm text-red-400 bg-red-400/10 rounded px-3 py-2"
                >
                  {error}
                </p>
              )}
              <Button
                data-ocid="admin_login.submit_button"
                type="submit"
                className="w-full h-11"
                disabled={loading || !token.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />{" "}
                    Verifying...
                  </>
                ) : (
                  "Access Admin Panel"
                )}
              </Button>
            </form>
          )}

          {success && (
            <div
              data-ocid="admin_login.success_state"
              className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 rounded-lg px-3 py-2"
            >
              <ShieldCheck size={16} />
              Access granted! Redirecting to Admin Panel...
            </div>
          )}
        </CardContent>
      </Card>

      <button
        type="button"
        data-ocid="admin_login.back.button"
        onClick={onBack}
        className="mt-6 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        Back to main login
      </button>
    </div>
  );
}
