"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MotoriderShell } from "@/components/motorider-shell";

const shiftItems = [
  { time: "07:30", event: "Shift started", location: "Kigali City Center" },
  { time: "08:10", event: "Pickup completed", location: "KN 5 Rd" },
  { time: "09:25", event: "Drop-off completed", location: "KG 11 Ave" },
  { time: "10:00", event: "Break started", location: "Kiyovu Hub" },
  { time: "10:20", event: "Back online", location: "Kiyovu Hub" },
];

export default function MotoriderShiftLogPage() {
  return (
    <MotoriderShell>
      <Card>
        <CardHeader>
          <CardTitle>Shift Log</CardTitle>
          <CardDescription>
            Timeline of daily operations for this motorider account.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {shiftItems.map((item) => (
              <div
                key={`${item.time}-${item.event}`}
                className="rounded-md border bg-background/60 p-3"
              >
                <p className="text-sm font-medium">{item.event}</p>
                <p className="text-xs text-muted-foreground">
                  {item.time} • {item.location}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </MotoriderShell>
  );
}
