"use client";

import { TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { MotorbikeIcon } from "@/components/icons/motorbike-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MotoriderShell } from "@/components/motorider-shell";

export default function MotoriderDashboardPage() {
  const { user } = useAuth();

  const fallbackLocation = useMemo(
    () => ({
      label: "FAWE Girls' School",
      description: "Kacyiru, Kigali",
      lat: -1.9449,
      lng: 30.0813,
      source: "Saved location",
    }),
    [],
  );

  const [location, setLocation] = useState(() => {
    if (typeof window === "undefined") {
      return {
        label: "Locating...",
        description: "Requesting GPS permissions",
        lat: fallbackLocation.lat,
        lng: fallbackLocation.lng,
        source: "Pending",
      };
    }

    const stored = window.localStorage.getItem("motorider-location");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as typeof fallbackLocation & {
          description: string;
          source: string;
        };
        if (parsed?.lat && parsed?.lng) {
          return parsed;
        }
      } catch {
        window.localStorage.removeItem("motorider-location");
      }
    }

    return {
      label: "Locating...",
      description: "Requesting GPS permissions",
      lat: fallbackLocation.lat,
      lng: fallbackLocation.lng,
      source: "Pending",
    };
  });

  const mapLink = useMemo(
    () =>
      `https://www.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`,
    [location.lat, location.lng],
  );

  useEffect(() => {
    if (!navigator?.geolocation) {
      const next = {
        ...fallbackLocation,
        description: "Browser does not support geolocation",
        source: "Saved location",
      };
      setLocation(next);
      window.localStorage.setItem("motorider-location", JSON.stringify(next));
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const next = {
        ...fallbackLocation,
        description: "Timed out, showing last saved location",
        source: "Saved location",
      };
      setLocation(next);
      window.localStorage.setItem("motorider-location", JSON.stringify(next));
    }, 9000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;
        const next = {
          label: "Live GPS fix",
          description: "On-device GNSS position",
          lat: Number(latitude.toFixed(5)),
          lng: Number(longitude.toFixed(5)),
          source: "GPS",
        };
        setLocation(next);
        window.localStorage.setItem("motorider-location", JSON.stringify(next));
      },
      (error) => {
        window.clearTimeout(timeoutId);
        const reason =
          error.code === error.PERMISSION_DENIED
            ? "Permission denied; showing last saved position"
            : "GPS unavailable; showing last saved position";
        const next = {
          ...fallbackLocation,
          description: reason,
          source: "Saved location",
        };
        setLocation(next);
        window.localStorage.setItem("motorider-location", JSON.stringify(next));
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 },
    );

    return () => window.clearTimeout(timeoutId);
  }, [fallbackLocation]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const toastKey = "motorider-booked-toast";
    const alreadySeen = window.sessionStorage.getItem(toastKey);
    if (alreadySeen) return;

    toast.success("Ride booked", {
      description: `${user?.account ?? "Your"} passenger is ready near FAWE Girls' School. Start navigation to pick up.`,
      duration: 6000,
      position: "top-center",
    });
    window.sessionStorage.setItem(toastKey, new Date().toISOString());
  }, [user?.account]);

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

  const notifications = [
    {
      title: "Booked ride assigned",
      body: "Rider booking confirmed. Proceed to pickup once online.",
      meta: "Confirmed just now",
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      "motorider-notifications",
      JSON.stringify(notifications),
    );
  }, [notifications]);

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

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Location</CardTitle>
            <CardDescription>
              Uses GPS when available; otherwise shows last saved position.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-base font-semibold leading-tight">
              FAWE Girls' School
            </p>
            <p className="text-muted-foreground">{location.description}</p>
            <p>
              Lat / Lng: <span className="font-medium">{location.lat}</span>,{" "}
              <span className="font-medium">{location.lng}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Source: {location.source}
            </p>
            <div className="overflow-hidden rounded-lg border bg-muted">
              <iframe
                title="Live map"
                src={mapLink}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-56 w-full"
                allowFullScreen
              />
            </div>
            <a
              href={mapLink.replace("&output=embed", "")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-1 text-sm text-primary underline"
            >
              Open in Google Maps
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>Latest ride events after login.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((note) => (
              <div
                key={note.title}
                className="rounded-md border bg-background/60 p-3 text-sm"
              >
                <p className="font-medium">{note.title}</p>
                <p className="text-muted-foreground">{note.body}</p>
                <p className="text-xs text-muted-foreground">{note.meta}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpi.map((item) => (
          <Card key={item.label}>
            <CardHeader className="gap-1">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl">{item.value}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                {item.delta}
              </p>
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
              <MotorbikeIcon className="size-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity}
                className="rounded-md border bg-background/60 p-3 text-sm"
              >
                {activity}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ride Volume (Last 7 Days)</CardTitle>
          <CardDescription>
            Analytics trend for dashboard preview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-background/60 p-4">
            <svg
              viewBox="0 0 640 220"
              className="h-48 w-full"
              role="img"
              aria-label="Ride volume chart"
            >
              <line
                x1="40"
                y1="180"
                x2="610"
                y2="180"
                stroke="var(--border)"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="30"
                x2="40"
                y2="180"
                stroke="var(--border)"
                strokeWidth="2"
              />

              <polyline
                fill="none"
                stroke="var(--primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="60,160 140,138 220,148 300,112 380,126 460,88 540,96"
              />

              <circle cx="60" cy="160" r="5" fill="var(--primary)" />
              <circle cx="140" cy="138" r="5" fill="var(--primary)" />
              <circle cx="220" cy="148" r="5" fill="var(--primary)" />
              <circle cx="300" cy="112" r="5" fill="var(--primary)" />
              <circle cx="380" cy="126" r="5" fill="var(--primary)" />
              <circle cx="460" cy="88" r="5" fill="var(--primary)" />
              <circle cx="540" cy="96" r="5" fill="var(--primary)" />

              <text x="52" y="200" fontSize="12" fill="var(--muted-foreground)">
                Mon
              </text>
              <text
                x="132"
                y="200"
                fontSize="12"
                fill="var(--muted-foreground)"
              >
                Tue
              </text>
              <text
                x="212"
                y="200"
                fontSize="12"
                fill="var(--muted-foreground)"
              >
                Wed
              </text>
              <text
                x="292"
                y="200"
                fontSize="12"
                fill="var(--muted-foreground)"
              >
                Thu
              </text>
              <text
                x="372"
                y="200"
                fontSize="12"
                fill="var(--muted-foreground)"
              >
                Fri
              </text>
              <text
                x="452"
                y="200"
                fontSize="12"
                fill="var(--muted-foreground)"
              >
                Sat
              </text>
              <text
                x="532"
                y="200"
                fontSize="12"
                fill="var(--muted-foreground)"
              >
                Sun
              </text>
            </svg>
          </div>
        </CardContent>
      </Card>
    </MotoriderShell>
  );
}
