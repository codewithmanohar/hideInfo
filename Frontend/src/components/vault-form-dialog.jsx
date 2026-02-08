import React, { useState } from "react";
import { api } from "../api/client";
import { Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VaultFormDialog({ onSaved }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    siteName: "",
    siteUrl: "",
    loginUsername: "",
    loginEmail: "",
    passwordPlain: "",
    masterPassword: ""
  });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  function set(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function save() {
    setErr("");
    setSaving(true);
    try {
      await api.post("/vault", form);
      onSaved?.();
      setOpen(false);
      setForm({
        siteName: "",
        siteUrl: "",
        loginUsername: "",
        loginEmail: "",
        passwordPlain: "",
        masterPassword: ""
      });
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErr(""); }}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl gap-2">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Add new password
          </DialogTitle>
        </DialogHeader>

        {err && <div className="text-sm text-red-500">{err}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Website name *</Label>
            <Input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} placeholder="GitHub" />
          </div>
          <div className="space-y-2">
            <Label>Website URL</Label>
            <Input value={form.siteUrl} onChange={(e) => set("siteUrl", e.target.value)} placeholder="https://github.com" />
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <Input value={form.loginUsername} onChange={(e) => set("loginUsername", e.target.value)} placeholder="codewithmanohar" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={form.loginEmail} onChange={(e) => set("loginEmail", e.target.value)} placeholder="you@email.com" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Password to store *</Label>
          <Input type="password" value={form.passwordPlain} onChange={(e) => set("passwordPlain", e.target.value)} placeholder="••••••••" />
        </div>

        <div className="space-y-2">
          <Label>Master password (to encrypt) *</Label>
          <Input type="password" value={form.masterPassword} onChange={(e) => set("masterPassword", e.target.value)} placeholder="Your login password" />
          <p className="text-xs text-muted-foreground">
            We verify your master password before saving.
          </p>
        </div>

        <Button onClick={save} disabled={saving} className="rounded-2xl">
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
