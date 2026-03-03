"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bike, Clock3, Compass, LayoutDashboard, MapPinned, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";

export default function MotoriderDashboardPage() {
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

  const kpi = [
    { label: "Active Requests", value: "12", delta: "+15%" },
    { label: "Completed Today", value: "31", delta: "+8%" },
    { label: "Avg Pickup Time", value: "4m 20s", delta: "-11%" },
    { label: "Acceptance Rate", value: "93%", delta: "+3%" },
  ];

  const demandByZone = [
    { zone: "Nyarugenge", value: 78 },
    { zone: "Gasabo", value: 64 },
    { zone: "Kicukiro", value: 51 },
    { zone: "Kimironko", value: 42 },
  ];

  const recentActivity = [
    "Pickup completed on KN 5 Rd",
    "New request from KG 11 Ave",
    "Drop-off completed at Kigali Heights",
    "Bike battery swapped at Kiyovu station",
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/40 px-4 py-8 sm:py-12">
      <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-4">
            <p className="text-sm font-semibold">Motorider Panel</p>
            <p className="text-xs text-muted-foreground">{user.account}</p>
          </div>
          <nav className="space-y-1">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
            >
              <LayoutDashboard className="size-4" />
              Overview
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <MapPinned className="size-4" />
              Zones
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Clock3 className="size-4" />
              Shift Log
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Compass className="size-4" />
              Navigation
            </button>
          </nav>
        </aside>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Motorider Dashboard</CardTitle>
              <CardDescription>
                Live operations for Kigali streets and pickup corridors.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpi.map((item) => (
              <Card key={item.label}>
                <CardHeader className="gap-1">
                  <CardDescription>{item.label}</CardDescription>
                  <CardTitle className="text-2xl">{item.value}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">{item.delta}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="size-4 text-primary" />
                  Demand By Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {demandByZone.map((zone) => (
                  <div key={zone.zone} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{zone.zone}</span>
                      <span className="text-muted-foreground">{zone.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${zone.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bike className="size-4 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity} className="rounded-md border bg-background/60 p-3 text-sm">
                    {activity}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
