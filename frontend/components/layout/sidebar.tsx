"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Menu } from "lucide-react";

import { ledgers } from "@/lib/mock-data/ledgers";
import { getIcon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

/**
 * The navigation links shown in the sidebar.
 */
function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-full flex-col">
      {/* Logo / product name */}
      <div className="border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>

          <span className="text-sm font-semibold">AI Knowledge Ledger</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
            isActive("/")
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        {/* Knowledge Categories */}
        <div className="mt-6 px-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Knowledge Categories
        </div>

        <div className="mt-1 space-y-0.5">
          {ledgers.map((ledger) => {
            const Icon = getIcon(ledger.icon);
            const href = `/ledger/${ledger.id}`;

            return (
              <Link
                key={ledger.id}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                  isActive(href)
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {ledger.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className="border-t px-3 py-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
            isActive("/settings")
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}

/**
 * Renders both the desktop persistent sidebar
 * and the mobile slide-in drawer.
 */
export function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background md:block">
        <SidebarNav />
      </aside>

      {/* Mobile top bar */}
      <div className="flex h-14 items-center border-b px-4 md:hidden">
        <Sheet>
          <SheetTrigger
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0">
            <SidebarNav />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
