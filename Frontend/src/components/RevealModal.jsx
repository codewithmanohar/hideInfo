import React, { useState } from "react";
import { api } from "../api/client";

export default function RevealModal({ open, onClose, itemId }) {
  const [masterPassword, setMasterPassword] = useState("");
  const [passwordPlain, setPasswordPlain] = useState("");
  const [err, setErr] = useState("");

  if (!open) return null;

  async function reveal() {
    setErr("");
    setPasswordPlain("");
    try {
      const res = await api.post(`/vault/${itemId}/reveal`, { masterPassword });
      setPasswordPlain(res.data.passwordPlain);

      // Auto-hide after 15 seconds
      setTimeout(() => setPasswordPlain(""), 15000);
    } catch (e) {
      setErr(e?.response?.data?.message || "Reveal failed");
    }
  }

  async function copy() {
    if (!passwordPlain) return;
    await navigator.clipboard.writeText(passwordPlain);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Reveal Password</h2>
          <button className="text-sm underline" onClick={() => { setErr(""); setPasswordPlain(""); onClose?.(); }}>
            Close
          </button>
        </div>

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

        <div className="mt-4">
          <input type="password" className="border rounded-xl p-2 w-full"
            placeholder="Enter master password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
          />
        </div>

        <button onClick={reveal} className="mt-4 w-full bg-black text-white rounded-xl py-2">
          Reveal
        </button>

        {passwordPlain && (
          <div className="mt-4 border rounded-xl p-3">
            <div className="text-sm text-gray-500">Password (auto-hides in 15s)</div>
            <div className="mt-1 font-mono break-all">{passwordPlain}</div>
            <button onClick={copy} className="mt-3 text-sm underline">Copy</button>
          </div>
        )}
      </div>
    </div>
  );
}
