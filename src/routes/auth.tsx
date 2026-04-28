import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in · Your Choice" },
      { name: "description", content: "Save your career quiz progress and resume anytime." },
    ],
  }),
});

const signupSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  displayName: z.string().trim().min(1, "Name required").max(80),
});

const signinSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(1, "Password required").max(72),
});

function AuthPage() {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/quiz" });
  }, [user, loading, navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
      displayName: form.get("displayName"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await signUp(parsed.data.email, parsed.data.password, parsed.data.displayName);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created — taking you to your quiz");
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = signinSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await signIn(parsed.data.email, parsed.data.password);
    setSubmitting(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome back");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-md px-6 py-16">
        <Link to="/" className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
        <div className="mt-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight">Save your progress</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to save your quiz answers and revisit your career map anytime.
          </p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")} className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input id="signin-password" name="password" type="password" required autoComplete="current-password" />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                {submitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Your name</Label>
                <Input id="signup-name" name="displayName" required maxLength={80} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" name="password" type="password" required minLength={8} autoComplete="new-password" />
                <p className="text-xs text-muted-foreground">At least 8 characters.</p>
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                {submitting ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
