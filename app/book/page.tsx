"use client";

import { Bike } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Map,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map";
import {
  BIKE_MOVEMENT_PATHS,
  BUILT_IN_DESTINATIONS,
  MOCK_USER_LOCATION,
  NEARBY_BIKES,
} from "@/lib/mock-data";

type BookingData = {
  pickup: string;
  rideTime: string;
};

const initialBookingData: BookingData = {
  pickup: "Detecting current location...",
  rideTime: "",
};

type BikeState = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  segmentIndex: number;
  progress: number;
  speed: number;
  heading: number;
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}

function calculateHeading(from: [number, number], to: [number, number]) {
  const [fromLng, fromLat] = from;
  const [toLng, toLat] = to;
  const y = Math.sin(toRadians(toLng - fromLng)) * Math.cos(toRadians(toLat));
  const x =
    Math.cos(toRadians(fromLat)) * Math.sin(toRadians(toLat)) -
    Math.sin(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.cos(toRadians(toLng - fromLng));
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

function interpolatePathPoint(
  from: [number, number],
  to: [number, number],
  progress: number
): [number, number] {
  const [fromLng, fromLat] = from;
  const [toLng, toLat] = to;
  return [
    fromLng + (toLng - fromLng) * progress,
    fromLat + (toLat - fromLat) * progress,
  ];
}

export default function BookPage() {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
  const [destinationQuery, setDestinationQuery] = useState("");
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showBookedPopup, setShowBookedPopup] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(MOCK_USER_LOCATION);
  const [bikeStates, setBikeStates] = useState<BikeState[]>(
    NEARBY_BIKES.map((bike, index) => ({
      id: bike.id,
      name: bike.name,
      latitude: bike.latitude,
      longitude: bike.longitude,
      segmentIndex: 0,
      progress: 0,
      speed: 0.08 + (index % 3) * 0.015,
      heading: 0,
    }))
  );

  const selectedDestination = useMemo(
    () =>
      BUILT_IN_DESTINATIONS.find((destination) => destination.id === selectedDestinationId) ??
      null,
    [selectedDestinationId]
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setBookingData((prev) => ({
        ...prev,
        pickup: `Current Location: ${MOCK_USER_LOCATION.latitude.toFixed(4)}, ${MOCK_USER_LOCATION.longitude.toFixed(4)}`,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCurrentLocation({ latitude, longitude });
        setBookingData((prev) => ({
          ...prev,
          pickup: `Current Location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        }));
      },
      () => {
        setBookingData((prev) => ({
          ...prev,
          pickup: `Current Location: ${MOCK_USER_LOCATION.latitude.toFixed(4)}, ${MOCK_USER_LOCATION.longitude.toFixed(4)}`,
        }));
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBikeStates((prevStates) =>
        prevStates.map((bike) => {
          const path = BIKE_MOVEMENT_PATHS[bike.id];
          if (!path || path.length < 2) {
            return bike;
          }

          let segmentIndex = bike.segmentIndex;
          let progress = bike.progress + bike.speed;
          while (progress >= 1) {
            progress -= 1;
            segmentIndex = (segmentIndex + 1) % path.length;
          }

          const from = path[segmentIndex];
          const to = path[(segmentIndex + 1) % path.length];
          const [longitude, latitude] = interpolatePathPoint(from, to, progress);

          return {
            ...bike,
            segmentIndex,
            progress,
            longitude,
            latitude,
            heading: calculateHeading(from, to),
          };
        })
      );
    }, 1200);

    return () => window.clearInterval(timer);
  }, []);

  const routeCoordinates = useMemo<[number, number][]>(() => {
    if (!selectedDestination) {
      return [
        [currentLocation.longitude, currentLocation.latitude],
        [currentLocation.longitude, currentLocation.latitude],
      ];
    }

    const midpoint: [number, number] = [
      (currentLocation.longitude + selectedDestination.longitude) / 2 + 0.004,
      (currentLocation.latitude + selectedDestination.latitude) / 2 + 0.0015,
    ];

    return [
      [currentLocation.longitude, currentLocation.latitude],
      midpoint,
      [selectedDestination.longitude, selectedDestination.latitude],
    ];
  }, [currentLocation, selectedDestination]);

  const mapCenter = useMemo<[number, number]>(() => {
    if (!selectedDestination) {
      return [currentLocation.longitude, currentLocation.latitude];
    }
    return [
      (currentLocation.longitude + selectedDestination.longitude) / 2,
      (currentLocation.latitude + selectedDestination.latitude) / 2,
    ];
  }, [currentLocation, selectedDestination]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      if (!bookingData.pickup || !destinationQuery || !bookingData.rideTime) {
        setMessage("Please fill pickup, destination, and time.");
        return;
      }

      if (!selectedDestination) {
        setMessage("Select a destination from built-in destinations.");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      setMessage("Ride request submitted successfully.");
      setShowBookedPopup(true);
      setBookingData((prev) => ({ ...prev, rideTime: "" }));
      setDestinationQuery("");
      setSelectedDestinationId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/40 px-4 py-8 sm:py-12">
      <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[420px_1fr]">
        <Card className="py-0">
          <CardHeader className="gap-1 border-b py-6">
            <CardTitle className="text-2xl">Book A Ride</CardTitle>
            <CardDescription>Choose your route and confirm pickup details.</CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="pickup" className="text-sm font-medium">
                  Pickup Location
                </label>
                <Input
                  id="pickup"
                  readOnly
                  value={bookingData.pickup}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="destination" className="text-sm font-medium">
                  Destination
                </label>
                <Input
                  id="destination"
                  list="rwanda-destinations"
                  placeholder="Search built-in destinations"
                  value={destinationQuery}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDestinationQuery(value);
                    const match = BUILT_IN_DESTINATIONS.find(
                      (destination) =>
                        `${destination.name} - ${destination.street}, ${destination.city}` ===
                        value
                    );
                    setSelectedDestinationId(match?.id ?? null);
                  }}
                />
                <datalist id="rwanda-destinations">
                  {BUILT_IN_DESTINATIONS.map((destination) => (
                    <option
                      key={destination.id}
                      value={`${destination.name} - ${destination.street}, ${destination.city}`}
                    />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <label htmlFor="ride-time" className="text-sm font-medium">
                  Ride Time
                </label>
                <Input
                  id="ride-time"
                  type="datetime-local"
                  value={bookingData.rideTime}
                  onChange={(event) =>
                    setBookingData((prev) => ({ ...prev, rideTime: event.target.value }))
                  }
                />
              </div>

              {message ? (
                <p className="text-sm text-muted-foreground" role="status">
                  {message}
                </p>
              ) : null}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Confirm Booking"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t py-4 text-xs text-muted-foreground">
            Available bikes are shown on the map with details.
          </CardFooter>
        </Card>

        <div className="h-[420px] w-full overflow-hidden rounded-xl border bg-background shadow-sm lg:h-full lg:min-h-[540px]">
          <Map center={mapCenter} zoom={13}>
            <MapRoute coordinates={routeCoordinates} color="#16a34a" width={4} opacity={0.85} />

            <MapMarker longitude={currentLocation.longitude} latitude={currentLocation.latitude}>
              <MarkerContent>
                <div className="size-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
              </MarkerContent>
              <MarkerTooltip>Pickup (Current Location)</MarkerTooltip>
              <MarkerPopup>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Your current pickup point</p>
                  <p className="text-xs text-muted-foreground">
                    {currentLocation.latitude.toFixed(4)},{" "}
                    {currentLocation.longitude.toFixed(4)}
                  </p>
                </div>
              </MarkerPopup>
            </MapMarker>

            {selectedDestination ? (
              <MapMarker
                longitude={selectedDestination.longitude}
                latitude={selectedDestination.latitude}
              >
                <MarkerContent>
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-primary-foreground shadow-lg">
                    <Bike className="size-3.5" />
                  </div>
                </MarkerContent>
                <MarkerTooltip>Destination</MarkerTooltip>
                <MarkerPopup>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{selectedDestination.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedDestination.street}, {selectedDestination.city}
                    </p>
                  </div>
                </MarkerPopup>
              </MapMarker>
            ) : null}

            {bikeStates.map((bike) => (
              <MapMarker
                key={bike.id}
                longitude={bike.longitude}
                latitude={bike.latitude}
                rotation={bike.heading}
              >
                <MarkerContent>
                  <div className="rounded-full border-2 border-white bg-primary p-1 text-primary-foreground shadow-lg">
                    <Bike className="size-4" />
                  </div>
                </MarkerContent>
                <MarkerTooltip>{bike.name}</MarkerTooltip>
                <MarkerPopup>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{bike.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Moving on Kigali streets
                    </p>
                  </div>
                </MarkerPopup>
              </MapMarker>
            ))}
          </Map>
        </div>
      </section>

      {showBookedPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-lg">
            <p className="text-sm font-medium">
              Ride is booked, wait for the bike.
            </p>
            <Button className="mt-4 w-full" onClick={() => setShowBookedPopup(false)}>
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
