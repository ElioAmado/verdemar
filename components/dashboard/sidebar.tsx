"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  Brain,
  FileBarChart,
  Settings,
  ChevronLeft,
  Hotel,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Reservas",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    label: "Apartamentos",
    href: "/apartments",
    icon: Building2,
  },
  {
    label: "Predicciones",
    href: "/predictions",
    icon: Brain,
  },
  {
    label: "Reportes",
    href: "/reports",
    icon: FileBarChart,
  },
];

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div
          className={cn(
            "flex items-center gap-3 overflow-hidden transition-all",
            collapsed && "w-0"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Hotel className="h-4 w-4" />
          </div>
          <span className="whitespace-nowrap font-semibold text-foreground">
            Booking Engine
          </span>
        </div>
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Hotel className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-all",
                  collapsed && "hidden"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Configuración" : undefined}
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap transition-all",
              collapsed && "hidden"
            )}
          >
            Configuración
          </span>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "mt-2 w-full justify-center text-muted-foreground hover:bg-accent hover:text-foreground",
            collapsed ? "px-0" : "justify-start px-3"
          )}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
          <span className={cn("ml-2", collapsed && "hidden")}>Colapsar</span>
        </Button>
      </div>
    </aside>
  );
}
