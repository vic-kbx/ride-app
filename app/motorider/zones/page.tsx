"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MotoriderShell } from "@/components/motorider-shell";

const zoneData = [
  { name: "Nyarugenge", demand: "High", eta: "3-5 min", activeRiders: 9 },
  { name: "Gasabo", demand: "Medium", eta: "5-7 min", activeRiders: 7 },
  { name: "Kicukiro", demand: "Medium", eta: "6-8 min", activeRiders: 6 },
  { name: "Remera", demand: "Low", eta: "8-10 min", activeRiders: 4 },
];

export default function MotoriderZonesPage() {
  return (
    <MotoriderShell>
      <Card>
        <CardHeader>
          <CardTitle>Zones</CardTitle>
          <CardDescription>
            Dispatch heat and motorider coverage by district.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {zoneData.map((zone) => (
          <Card key={zone.name}>
            <CardHeader className="gap-1">
              <CardTitle className="text-lg">{zone.name}</CardTitle>
              <CardDescription>Live zone status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                Demand: <span className="font-medium">{zone.demand}</span>
              </p>
              <p>
                Pickup ETA: <span className="font-medium">{zone.eta}</span>
              </p>
              <p>
                Active riders: <span className="font-medium">{zone.activeRiders}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </MotoriderShell>
  );
}
