"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Clock3, Compass, LayoutDashboard, MapPinned } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const navItems = [
  { href: "/motorider/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/motorider/zones", label: "Zones", icon: MapPinned },
  { href: "/motorider/shift-log", label: "Shift Log", icon: Clock3 },
  { href: "/motorider/navigation", label: "Navigation", icon: Compass },
];

function MotoriderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "motorider") {
      router.replace("/book");
    }
  }, [isAuthenticated, router, user]);

  if (!isAuthenticated || user?.role !== "motorider") {
    return null;
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/40 px-4 py-8 sm:py-12">
      <Toaster position="top-right" richColors closeButton />
      <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-4">
            <p className="text-sm font-semibold">Motorider Panel</p>
            <p className="text-xs text-muted-foreground">{user.account}</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm",
                    isActive
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6">{children}</div>
      </section>
    </main>
  );
}

export { MotoriderShell };
