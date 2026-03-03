"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { MotorbikeIcon } from "@/components/icons/motorbike-icon";
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
  DUMMY_DRIVER_USERNAMES,
  type Destination,
  MOCK_USER_LOCATION,
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
  pathId: string;
  latitude: number;
  longitude: number;
  segmentIndex: number;
  progress: number;
  speed: number; // segment progress per second
  heading: number;
};

const RIDER_COUNT = 20;
const MOVEMENT_PATHS = Object.entries(BIKE_MOVEMENT_PATHS);
const MAX_COMBO_RESULTS = 8;

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

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 9999.17) * 10000.93;
  return x - Math.floor(x);
}

function createInitialRiderStates(): BikeState[] {
  return Array.from({ length: RIDER_COUNT }, (_, index) => {
    const [pathId, path] = MOVEMENT_PATHS[index % MOVEMENT_PATHS.length];
    const randA = pseudoRandom(index + 1);
    const randB = pseudoRandom(index + 101);

    const segmentIndex = Math.floor(randA * path.length) % path.length;
    const progress = randB;
    const from = path[segmentIndex];
    const to = path[(segmentIndex + 1) % path.length];
    const [longitude, latitude] = interpolatePathPoint(from, to, progress);

    return {
      id: `rider-${index + 1}`,
      name: DUMMY_DRIVER_USERNAMES[index % DUMMY_DRIVER_USERNAMES.length],
      pathId,
      latitude,
      longitude,
      segmentIndex,
      progress,
      speed: 0.07 + randA * 0.08,
      heading: calculateHeading(from, to),
    };
  });
}

function destinationLabel(destination: Destination) {
  return `${destination.name} - ${destination.street}, ${destination.city}`;
}

export default function BookPage() {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
  const [destinationQuery, setDestinationQuery] = useState("");
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showBookedPopup, setShowBookedPopup] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(MOCK_USER_LOCATION);
  const [bikeStates, setBikeStates] = useState<BikeState[]>(() =>
    createInitialRiderStates()
  );

  const selectedDestination = useMemo(
    () =>
      BUILT_IN_DESTINATIONS.find((destination) => destination.id === selectedDestinationId) ??
      null,
    [selectedDestinationId]
  );

  const filteredDestinations = useMemo(() => {
    const query = destinationQuery.trim().toLowerCase();
    if (!query) {
      return BUILT_IN_DESTINATIONS.slice(0, MAX_COMBO_RESULTS);
    }

    return BUILT_IN_DESTINATIONS.filter((destination) =>
      destinationLabel(destination).toLowerCase().includes(query)
    ).slice(0, MAX_COMBO_RESULTS);
  }, [destinationQuery]);

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
    let lastTime = performance.now();
    let frameId = 0;

    const animate = (time: number) => {
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      setBikeStates((prevStates) =>
        prevStates.map((bike) => {
          const path = BIKE_MOVEMENT_PATHS[bike.pathId];
          if (!path || path.length < 2) {
            return bike;
          }

          let segmentIndex = bike.segmentIndex;
          let progress = bike.progress + bike.speed * deltaSeconds;
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

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
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
                <div className="relative">
                  <Input
                    id="destination"
                    role="combobox"
                    aria-expanded={isDestinationOpen}
                    aria-controls="destination-combobox-list"
                    placeholder="Search built-in destinations"
                    value={destinationQuery}
                    onFocus={() => setIsDestinationOpen(true)}
                    onBlur={() => {
                      window.setTimeout(() => setIsDestinationOpen(false), 120);
                    }}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDestinationQuery(value);
                      setIsDestinationOpen(true);

                      const exactMatch = BUILT_IN_DESTINATIONS.find(
                        (destination) => destinationLabel(destination) === value
                      );
                      setSelectedDestinationId(exactMatch?.id ?? null);
                    }}
                  />
                  {isDestinationOpen ? (
                    <div
                      id="destination-combobox-list"
                      className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-md"
                    >
                      {filteredDestinations.length > 0 ? (
                        filteredDestinations.map((destination) => (
                          <button
                            key={destination.id}
                            type="button"
                            className="w-full rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => {
                              setDestinationQuery(destinationLabel(destination));
                              setSelectedDestinationId(destination.id);
                              setIsDestinationOpen(false);
                            }}
                          >
                            {destinationLabel(destination)}
                          </button>
                        ))
                      ) : (
                        <p className="px-2 py-2 text-sm text-muted-foreground">
                          No matching destinations.
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
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
            {Object.entries(BIKE_MOVEMENT_PATHS).map(([roadId, coordinates]) => (
              <MapRoute
                key={roadId}
                id={`road-${roadId}`}
                coordinates={coordinates}
                color="rgba(34, 197, 94, 0.28)"
                width={2}
                opacity={0.7}
              />
            ))}
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
                    <MotorbikeIcon className="size-3.5" />
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
                    <MotorbikeIcon className="size-4" />
                  </div>
                </MarkerContent>
                <MarkerTooltip>{bike.name}</MarkerTooltip>
                <MarkerPopup>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{bike.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Moving on Kigali streets (live)
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
