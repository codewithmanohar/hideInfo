import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

import Topbar from "../components/topbar";
import VaultFormDialog from "../components/vault-form-dialog";
import RevealDialog from "../components/reveal-dialog";
import EditVaultDialog from "../components/edit-vault-dialog";

import {
    Search,
    ShieldCheck,
    Eye,
    Trash2,
    Globe,
    User2,
    Mail,
    LockKeyhole,
    Copy,
    Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast, Toaster } from "sonner";
import Footer from "@/components/footer";

export default function Dashboard() {
    const { user, loading, logout } = useAuth();
    const nav = useNavigate();

    const [items, setItems] = useState([]);
    const [q, setQ] = useState("");
    const [revealId, setRevealId] = useState(null);

    const [editOpen, setEditOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const [loadingList, setLoadingList] = useState(false);

    async function load() {
        setLoadingList(true);
        try {
            const res = await api.get("/vault");
            setItems(res.data.items || []);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Failed to load vault items");
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        if (!loading && !user) nav("/");
    }, [loading, user, nav]);

    useEffect(() => {
        if (user) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return items;

        return items.filter((it) =>
            [it.siteName, it.siteUrl, it.loginUsername, it.loginEmail]
                .filter(Boolean)
                .some((v) => v.toLowerCase().includes(query))
        );
    }, [items, q]);

    async function remove(id) {
        try {
            await api.delete(`/vault/${id}`);
            toast.success("Deleted");
            setItems((prev) => prev.filter((x) => x._id !== id));
        } catch (e) {
            toast.error(e?.response?.data?.message || "Delete failed");
        }
    }

    async function copyText(label, value) {
        if (!value) return toast.error(`No ${label} to copy`);
        await navigator.clipboard.writeText(value);
        toast.success(`${label} copied`);
    }

    function openEdit(item) {
        setEditItem(item);
        setEditOpen(true);
    }

    if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;

    return (
        <TooltipProvider>
            <Toaster richColors position="top-right" />
            <div className="min-h-screen bg-background">
                <Topbar
                    email={user?.email}
                    onLogout={async () => {
                        await logout();
                        nav("/");
                    }}
                />

                <main className="max-w-6xl mx-auto p-4 space-y-4">
                    {/* Header row */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold leading-tight">Your Vault</h1>
                                    <p className="text-sm text-muted-foreground leading-tight">
                                        Encrypted storage • Re-auth to reveal
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <VaultFormDialog onSaved={load} />
                            <Button
                                variant="outline"
                                className="rounded-2xl"
                                onClick={load}
                                disabled={loadingList}
                            >
                                {loadingList ? "Refreshing..." : "Refresh"}
                            </Button>
                        </div>
                    </div>

                    {/* Search + stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Card className="rounded-2xl lg:col-span-2">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Search</CardTitle>
                                <CardDescription>Find by site, URL, username, or email</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                    <Input
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        placeholder="Search..."
                                        className="pl-9 rounded-2xl"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* CONTENT */}
                        <Card className="rounded-2xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Saved Passwords</CardTitle>
                                <CardDescription>
                                    Password hidden by default • Reveal shows it for 15 seconds
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {/* MOBILE: cards */}
                                <div className="md:hidden space-y-3">
                                    {filtered.length === 0 ? (
                                        <div className="text-sm text-muted-foreground text-center py-10">
                                            No entries found.
                                        </div>
                                    ) : (
                                        filtered.map((it) => (
                                            <div key={it._id} className="rounded-2xl border p-4 space-y-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="font-semibold flex items-center gap-2">
                                                            <Globe className="h-4 w-4 text-primary" />
                                                            <span className="truncate">{it.siteName}</span>
                                                        </div>
                                                        {it.siteUrl && (
                                                            <div className="text-xs text-muted-foreground truncate">
                                                                {it.siteUrl}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Badge variant="secondary" className="rounded-xl shrink-0">
                                                        <LockKeyhole className="h-3 w-3 mr-1" />
                                                        Encrypted
                                                    </Badge>
                                                </div>

                                                <div className="space-y-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <User2 className="h-4 w-4" />
                                                        <span className="truncate">{it.loginUsername || "—"}</span>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="rounded-2xl ml-auto"
                                                            onClick={() => copyText("Username", it.loginUsername)}
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        <span className="truncate">{it.loginEmail || "—"}</span>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="rounded-2xl ml-auto"
                                                            onClick={() => copyText("Email", it.loginEmail)}
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        className="rounded-2xl gap-2"
                                                        onClick={() => setRevealId(it._id)}
                                                    >
                                                        <Eye className="h-4 w-4" /> Reveal
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        className="rounded-2xl gap-2"
                                                        onClick={() => openEdit(it)}
                                                    >
                                                        <Pencil className="h-4 w-4" /> Edit
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        className="rounded-2xl gap-2 text-red-500 hover:text-red-500"
                                                        onClick={() => remove(it._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* DESKTOP: table */}
                                <div className="hidden md:block">
                                    <ScrollArea className="rounded-2xl border">
                                        <div className="min-w-[980px]">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Site</TableHead>
                                                        <TableHead>Username</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody>
                                                    {filtered.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                                                                No entries found.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        filtered.map((it) => (
                                                            <TableRow key={it._id}>
                                                                <TableCell>
                                                                    <div className="font-medium flex items-center gap-2">
                                                                        <Globe className="h-4 w-4 text-primary" />
                                                                        {it.siteName}
                                                                    </div>
                                                                    {it.siteUrl && (
                                                                        <div className="text-xs text-muted-foreground truncate max-w-[360px]">
                                                                            {it.siteUrl}
                                                                        </div>
                                                                    )}
                                                                </TableCell>

                                                                <TableCell className="text-muted-foreground">
                                                                    <div className="flex items-center gap-2">
                                                                        <span>{it.loginUsername || "—"}</span>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="ghost"
                                                                                    className="rounded-2xl"
                                                                                    onClick={() => copyText("Username", it.loginUsername)}
                                                                                >
                                                                                    <Copy className="h-4 w-4" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>Copy username</TooltipContent>
                                                                        </Tooltip>
                                                                    </div>
                                                                </TableCell>

                                                                <TableCell className="text-muted-foreground">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="truncate max-w-[260px]">{it.loginEmail || "—"}</span>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="ghost"
                                                                                    className="rounded-2xl"
                                                                                    onClick={() => copyText("Email", it.loginEmail)}
                                                                                >
                                                                                    <Copy className="h-4 w-4" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>Copy email</TooltipContent>
                                                                        </Tooltip>
                                                                    </div>
                                                                </TableCell>

                                                                <TableCell>
                                                                    <Badge variant="secondary" className="rounded-xl">
                                                                        <LockKeyhole className="h-3 w-3 mr-1" />
                                                                        Encrypted
                                                                    </Badge>
                                                                </TableCell>

                                                                <TableCell className="text-right">
                                                                    <div className="flex justify-end gap-2">
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="secondary"
                                                                                    className="rounded-2xl"
                                                                                    onClick={() => setRevealId(it._id)}
                                                                                >
                                                                                    <Eye className="h-4 w-4" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>Reveal</TooltipContent>
                                                                        </Tooltip>

                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="outline"
                                                                                    className="rounded-2xl"
                                                                                    onClick={() => openEdit(it)}
                                                                                >
                                                                                    <Pencil className="h-4 w-4" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>Edit</TooltipContent>
                                                                        </Tooltip>

                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="outline"
                                                                                    className="rounded-2xl text-red-500 hover:text-red-500"
                                                                                    onClick={() => remove(it._id)}
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>Delete</TooltipContent>
                                                                        </Tooltip>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </ScrollArea>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Overview</CardTitle>
                                <CardDescription>Quick vault info</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Total entries</span>
                                    <span className="font-semibold">{items.length}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Showing</span>
                                    <span className="font-semibold">{filtered.length}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Storage</span>
                                    <Badge className="rounded-xl" variant="secondary">
                                        Encrypted
                                    </Badge>
                                </div>

                                <div className="mt-2 rounded-2xl bg-primary/10 p-3 text-foreground">
                                    Tip: Use a strong master password.
                                </div>
                            </CardContent>
                        </Card>
                    </div>


                </main>

                <Footer />

                {/* Reveal dialog */}
                <RevealDialog
                    open={Boolean(revealId)}
                    onOpenChange={(v) => {
                        if (!v) setRevealId(null);
                    }}
                    itemId={revealId}
                />

                {/* Edit dialog */}
                <EditVaultDialog
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    item={editItem}
                    onSaved={load}
                />
            </div>
        </TooltipProvider>
    );
}
