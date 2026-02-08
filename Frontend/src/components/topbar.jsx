import React from "react";
import { useTheme } from "next-themes";
import { Vault, Moon, Sun, Menu, LogOut, User2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function Topbar({ email, onLogout }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-10 w-10 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
            <Lock className="h-5 w-5 text-green-500" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold leading-tight truncate">KeyNest</div>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-2xl"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Separator orientation="vertical" className="h-8" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="rounded-2xl gap-2">
                <Badge className="rounded-xl" variant="secondary">
                  <span className="text-primary font-semibold">●</span> Online
                </Badge>
                <span className="truncate max-w-[260px]">{email}</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="rounded-2xl">
              <DropdownMenuLabel className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-primary" />
                <span className="truncate max-w-[260px]">{email}</span>
              </DropdownMenuLabel>

              <DropdownMenuItem onClick={onLogout} className="gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-2xl">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="rounded-2xl w-64">
              <DropdownMenuLabel className="space-y-1">
                <div className="text-xs text-muted-foreground">Logged in</div>
                <div className="truncate">{email}</div>
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="gap-2"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                Toggle theme
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onLogout} className="gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
