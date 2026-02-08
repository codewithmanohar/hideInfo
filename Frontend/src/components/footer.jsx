import React from "react";
import { LockKeyhole, ShieldCheck, Github, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t bg-background">
        <div className="flex flex-col items-center justify-center py-5 gap-2 text-xs text-muted-foreground">
          <div>© {year} All rights reserved.</div>
          <div className="flex gap-4">
            <span className="hover:text-primary cursor-default">Privacy</span>
            <span className="hover:text-primary cursor-default">Security</span>
            <span className="hover:text-primary cursor-default">Support</span>
          </div>
        </div>
      {/* </div> */}
    </footer>
  );
}
