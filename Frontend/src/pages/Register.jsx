import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Mail, User2, ShieldPlus } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (password.length < 8) {
      setErr("Master password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      nav("/");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/15 flex items-center justify-center">
              <ShieldPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Create account</CardTitle>
              <CardDescription>Start your secure vault</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {err && (
            <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <div>{err}</div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <div className="relative">
                <User2 className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  className="pl-9 rounded-2xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Manohar Kumar"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  className="pl-9 rounded-2xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Master Password (8+ chars)</Label>
              <div className="relative">
                <Input
                  className="pr-10 rounded-2xl"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong master password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-muted"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Don’t reuse this password anywhere else.
              </p>
            </div>

            <Button disabled={loading} className="w-full rounded-2xl">
              {loading ? "Creating..." : "Create account"}
            </Button>

            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link to="/" className="text-primary font-medium hover:underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
