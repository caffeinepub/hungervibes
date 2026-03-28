import { CheckCircle, Loader2, ShieldCheck } from "lucide-react";
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
  /** When true, user is already logged in and wants to add a new role */
  addingRole?: boolean;
  /** Pre-filled name from existing profile */
  existingName?: string;
  /** Pre-filled phone from existing profile */
  existingPhone?: string;
}

export default function AuthPage({
  onRegistered,
  onAdminLogin,
  onBack,
  defaultRole,
  addingRole = false,
  existingName = "",
  existingPhone = "",
}: Props) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();
  const [name, setName] = useState(existingName);
  const [phone, setPhone] = useState(existingPhone);
  const [role, setRole] = useState<Role>(defaultRole ?? Role.customer);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedRole, setSubmittedRole] = useState<Role | null>(null);

  const isLoggedIn = !!identity;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !name.trim() || !phone.trim()) return;
    setRegistering(true);
    setError("");
    try {
      await actor.registerUser(name.trim(), phone.trim(), role);
      if (role === Role.customer) {
        // Customer is auto-approved — go straight to panel
        onRegistered?.();
      } else {
        // Restaurant/delivery — pending admin approval
        setSubmittedRole(role);
        setSubmitted(true);
      }
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
      icon: "🛒",
      desc: "Order food from restaurants",
    },
    {
      value: Role.restaurant_owner,
      label: "Restaurant Partner",
      icon: "🏪",
      desc: "Manage your restaurant & menu",
    },
    {
      value: Role.delivery_agent,
      label: "Delivery Agent",
      icon: "🛵",
      desc: "Deliver orders & earn",
    },
  ];

  const roleLabels: Record<Role, string> = {
    [Role.customer]: "Customer",
    [Role.restaurant_owner]: "Restaurant Partner",
    [Role.delivery_agent]: "Delivery Agent",
  };

  // Show success/pending screen after registration
  if (submitted && submittedRole) {
    const isPending = submittedRole !== Role.customer;
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.95 0.05 60), oklch(0.98 0.03 30))",
        }}
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center space-y-5">
          <div className="text-5xl">{isPending ? "⏳" : "✅"}</div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            <h2 className="text-xl font-bold text-foreground">
              {isPending ? "Application Submitted!" : "Welcome aboard!"}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isPending ? (
              <>
                Your <strong>{roleLabels[submittedRole]}</strong> application
                has been submitted successfully. Our admin team will review and
                approve it shortly. You'll be able to access the panel once
                approved.
              </>
            ) : (
              "Your account has been created successfully!"
            )}
          </p>
          {isPending && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-left">
              <p className="text-xs font-semibold text-orange-800 mb-1">
                What happens next?
              </p>
              <p className="text-xs text-orange-700">
                The admin will review your profile and approve it. Check back in
                a few hours.
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              data-ocid="auth.submitted.home.button"
              variant="outline"
              className="w-full"
              onClick={onBack}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in or create an account</CardDescription>
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
                "Login or Sign Up"
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
            <CardTitle>
              {addingRole ? "Add a New Role" : "Complete your profile"}
            </CardTitle>
            <CardDescription>
              {addingRole
                ? "Register an additional role for your account"
                : "Tell us how you'll use HungerVibes"}
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
                <Label>
                  {addingRole
                    ? "Select role to add..."
                    : "I want to join as..."}
                </Label>
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
                    <Loader2 className="animate-spin mr-2" size={18} />
                    {addingRole ? "Submitting..." : "Creating account..."}
                  </>
                ) : addingRole ? (
                  "Submit Application"
                ) : (
                  "Create Account"
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
