"use client";

import { Bike, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MotoriderShell } from "@/components/motorider-shell";

export default function MotoriderDashboardPage() {
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
    <MotoriderShell>
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
    </MotoriderShell>
  );
}
