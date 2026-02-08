import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { Pencil, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function EditVaultDialog({ open, onOpenChange, item, onSaved }) {
  const initial = useMemo(() => {
    if (!item) return null;
    return {
      siteName: item.siteName || "",
      siteUrl: item.siteUrl || "",
      loginUsername: item.loginUsername || "",
      loginEmail: item.loginEmail || "",

      // Optional: enable if you want editing password too
      passwordPlain: "",
      masterPassword: "",
    };
  }, [item]);

  const [form, setForm] = useState(initial);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial);
    setErr("");
    setSaving(false);
  }, [initial]);

  function set(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function save() {
    if (!item?._id) return;

    setErr("");
    setSaving(true);

    try {
      // If you don't want password edit, send only metadata:
      const payload = {
        siteName: form.siteName,
        siteUrl: form.siteUrl,
        loginUsername: form.loginUsername,
        loginEmail: form.loginEmail,
      };

      // OPTIONAL: if user typed passwordPlain, require masterPassword
      if (form.passwordPlain?.trim()) {
        if (!form.masterPassword?.trim()) {
          setErr("Master password required to update stored password.");
          setSaving(false);
          return;
        }
        payload.passwordPlain = form.passwordPlain;
        payload.masterPassword = form.masterPassword;
      }

      await api.put(`/vault/${item._id}`, payload);

      onSaved?.();
      onOpenChange(false);
    } catch (e) {
      setErr(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => onOpenChange(v)}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-primary" /> Edit entry
          </DialogTitle>
        </DialogHeader>

        {err && (
          <div className="text-sm text-red-500 rounded-2xl border border-red-500/30 bg-red-500/10 p-3">
            {err}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Site name</Label>
            <Input className="rounded-2xl" value={form?.siteName || ""} onChange={(e) => set("siteName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Site URL</Label>
            <Input className="rounded-2xl" value={form?.siteUrl || ""} onChange={(e) => set("siteUrl", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <Input className="rounded-2xl" value={form?.loginUsername || ""} onChange={(e) => set("loginUsername", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input className="rounded-2xl" value={form?.loginEmail || ""} onChange={(e) => set("loginEmail", e.target.value)} />
          </div>
        </div>

        <Separator />

        {/* OPTIONAL PASSWORD EDIT SECTION */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Update stored password (optional)</div>

          <div className="space-y-2">
            <Label>New password</Label>
            <Input className="rounded-2xl" type="password" value={form?.passwordPlain || ""} onChange={(e) => set("passwordPlain", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Master password (required if changing password)</Label>
            <Input className="rounded-2xl" type="password" value={form?.masterPassword || ""} onChange={(e) => set("masterPassword", e.target.value)} />
          </div>
        </div>

        <Button onClick={save} disabled={saving} className="rounded-2xl gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
