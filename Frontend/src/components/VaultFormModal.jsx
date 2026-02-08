import React, { useState } from "react";
import { api } from "../api/client";

export default function VaultFormModal({ open, onClose, onSaved }) {
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [passwordPlain, setPasswordPlain] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [err, setErr] = useState("");

  if (!open) return null;

  async function save() {
    setErr("");
    try {
      await api.post("/vault", {
        siteName,
        siteUrl,
        loginUsername,
        loginEmail,
        passwordPlain,
        masterPassword
      });
      onSaved?.();
      onClose?.();
      setSiteName(""); setSiteUrl(""); setLoginUsername(""); setLoginEmail("");
      setPasswordPlain(""); setMasterPassword("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Password</h2>
          <button className="text-sm underline" onClick={onClose}>Close</button>
        </div>

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded-xl p-2" placeholder="Website name *"
            value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          <input className="border rounded-xl p-2" placeholder="Website URL"
            value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} />
          <input className="border rounded-xl p-2" placeholder="Username"
            value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
          <input className="border rounded-xl p-2" placeholder="Email"
            value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
        </div>

        <div className="mt-3">
          <input type="password" className="border rounded-xl p-2 w-full" placeholder="Password to store *"
            value={passwordPlain} onChange={(e) => setPasswordPlain(e.target.value)} />
        </div>

        <div className="mt-3">
          <input type="password" className="border rounded-xl p-2 w-full" placeholder="Enter master password to encrypt *"
            value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} />
          <p className="text-xs text-gray-500 mt-1">We verify your master password before saving.</p>
        </div>

        <button onClick={save} className="mt-5 w-full bg-black text-white rounded-xl py-2">
          Save
        </button>
      </div>
    </div>
  );
}
