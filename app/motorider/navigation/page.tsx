"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MotoriderShell } from "@/components/motorider-shell";

const waypoints = [
  { stop: "Current", street: "KN 3 Rd, Kiyovu", action: "Wait for assignment" },
  { stop: "Pickup", street: "KG 7 Ave, Kigali Heights", action: "Rider pickup" },
  { stop: "Drop-off", street: "KG 11 Ave, Kimironko", action: "Complete trip" },
];

export default function MotoriderNavigationPage() {
  return (
    <MotoriderShell>
      <Card>
        <CardHeader>
          <CardTitle>Navigation</CardTitle>
          <CardDescription>
            Suggested route waypoints and upcoming instructions.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Next Route</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {waypoints.map((point, index) => (
              <div key={point.stop} className="rounded-md border bg-background/60 p-3">
                <p className="text-sm font-medium">
                  {index + 1}. {point.stop}
                </p>
                <p className="text-xs text-muted-foreground">{point.street}</p>
                <p className="mt-1 text-xs">{point.action}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Route Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Distance: <span className="font-medium">6.2 km</span>
            </p>
            <p>
              Est. travel: <span className="font-medium">14 min</span>
            </p>
            <p>
              Traffic: <span className="font-medium">Moderate</span>
            </p>
            <p>
              Battery: <span className="font-medium">78%</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </MotoriderShell>
  );
}
