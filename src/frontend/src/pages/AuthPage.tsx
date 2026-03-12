import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Role } from "../backend";
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
  onBack?: () => void;
  onRegistered?: () => void;
  onAdminLogin?: () => void;
  defaultRole?: Role;
}

export default function AuthPage({
  onRegistered,
  onAdminLogin,
  onBack,
  defaultRole,
}: Props) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>(defaultRole ?? Role.customer);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = !!identity;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !name.trim() || !phone.trim()) return;
    setRegistering(true);
    setError("");
    try {
      await actor.registerUser(name.trim(), phone.trim(), role);
      onRegistered?.();
    } catch (_err) {
      setError("Registration failed. Please try again.");
    } finally {
      setRegistering(false);
    }
  }

  const roles: { value: Role; label: string; icon: string; desc: string }[] = [
    {
      value: Role.customer,
      label: "Customer",
      icon: "🍽️",
      desc: "Order food from restaurants",
    },
    {
      value: Role.restaurant_owner,
      label: "Restaurant Owner",
      icon: "🏪",
      desc: "Manage your restaurant",
    },
    {
      value: Role.delivery_agent,
      label: "Delivery Agent",
      icon: "🛵",
      desc: "Deliver orders & earn",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.95 0.05 60), oklch(0.98 0.03 30))",
      }}
    >
      <div className="mb-8 text-center">
        {onBack && (
          <button
            type="button"
            data-ocid="auth.home.button"
            onClick={onBack}
            className="mb-4 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto"
          >
            ← Back to Home
          </button>
        )}
        <h1 className="text-4xl font-bold text-primary mb-1">🔥 HungerVibes</h1>
        <p className="text-muted-foreground">Delicious food, delivered fast</p>
      </div>

      {!isLoggedIn ? (
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              data-ocid="auth.primary_button"
              className="w-full h-12 text-base"
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
            >
              {loginStatus === "logging-in" ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} /> Signing
                  in...
                </>
              ) : (
                "Sign in with Internet Identity"
              )}
            </Button>
            {onAdminLogin && (
              <button
                type="button"
                data-ocid="auth.admin_portal.button"
                onClick={onAdminLogin}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                <ShieldCheck size={15} />
                Admin Portal
              </button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle>Complete your profile</CardTitle>
            <CardDescription>
              Tell us about yourself to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  data-ocid="auth.name.input"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  data-ocid="auth.phone.input"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>I am a...</Label>
                <div className="grid grid-cols-1 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      data-ocid={`auth.role.${r.value}.toggle`}
                      onClick={() => setRole(r.value)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                        role === r.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="text-2xl">{r.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{r.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {error && (
                <p
                  className="text-sm text-destructive"
                  data-ocid="auth.error_state"
                >
                  {error}
                </p>
              )}
              <Button
                data-ocid="auth.submit_button"
                type="submit"
                className="w-full h-12 text-base"
                disabled={registering || !name.trim() || !phone.trim()}
              >
                {registering ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} /> Creating
                    account...
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
              {onAdminLogin && (
                <button
                  type="button"
                  data-ocid="auth.admin_portal.button"
                  onClick={onAdminLogin}
                  className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  <ShieldCheck size={15} />
                  Admin Portal
                </button>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
