import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { Eye, Copy, Check, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function RevealDialog({ open, onOpenChange, itemId }) {
  const [masterPassword, setMasterPassword] = useState("");
  const [passwordPlain, setPasswordPlain] = useState("");
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setMasterPassword("");
      setPasswordPlain("");
      setErr("");
      setCopied(false);
      setLoading(false);
    }
  }, [open]);

  async function reveal() {
    setErr("");
    setPasswordPlain("");
    setLoading(true);
    try {
      const res = await api.post(`/vault/${itemId}/reveal`, { masterPassword });
      setPasswordPlain(res.data.passwordPlain);

      // auto hide
      setTimeout(() => setPasswordPlain(""), 15000);
    } catch (e) {
      setErr(e?.response?.data?.message || "Reveal failed");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!passwordPlain) return;
    await navigator.clipboard.writeText(passwordPlain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" /> Reveal password
          </DialogTitle>
        </DialogHeader>

        {err && <div className="text-sm text-red-500">{err}</div>}

        <div className="space-y-2">
          <Label>Master password</Label>
          <Input
            type="password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            placeholder="Enter master password"
          />
        </div>

        <Button onClick={reveal} disabled={loading} className="rounded-2xl gap-2">
          {loading ? "Checking..." : "Reveal"}
          <Badge variant="secondary" className="rounded-xl gap-1">
            <TimerReset className="h-3 w-3" /> 15s
          </Badge>
        </Button>

        {passwordPlain && (
          <div className="border rounded-2xl p-3 space-y-2">
            <div className="text-xs text-muted-foreground">Password</div>
            <div className="font-mono break-all">{passwordPlain}</div>

            <Button variant="secondary" onClick={copy} className="rounded-2xl gap-2">
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
