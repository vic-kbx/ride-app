export type Bike = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export type Destination = {
  id: string;
  name: string;
  street: string;
  city: string;
  latitude: number;
  longitude: number;
};

export const MOCK_USER_LOCATION = {
  latitude: -1.9441,
  longitude: 30.0619,
};

export const NEARBY_BIKES: Bike[] = [
  {
    id: "bike-kig-101",
    name: "KN 5 Rd - Kigali City Tower",
    latitude: -1.9493,
    longitude: 30.0588,
  },
  {
    id: "bike-kig-102",
    name: "KG 11 Ave - Kigali Heights",
    latitude: -1.9557,
    longitude: 30.1039,
  },
  {
    id: "bike-kig-103",
    name: "KN 3 Rd - Kiyovu",
    latitude: -1.9448,
    longitude: 30.0677,
  },
  {
    id: "bike-kig-104",
    name: "KK 31 Ave - Kicukiro",
    latitude: -1.9706,
    longitude: 30.1044,
  },
];

export const BUILT_IN_DESTINATIONS: Destination[] = [
  {
    id: "dest-1",
    name: "Kigali City Tower",
    street: "KN 5 Rd",
    city: "Nyarugenge",
    latitude: -1.9493,
    longitude: 30.0588,
  },
  {
    id: "dest-2",
    name: "Kigali Heights",
    street: "KG 7 Ave",
    city: "Gasabo",
    latitude: -1.9557,
    longitude: 30.1039,
  },
  {
    id: "dest-3",
    name: "Kimironko Market",
    street: "KG 11 Ave",
    city: "Gasabo",
    latitude: -1.9499,
    longitude: 30.1127,
  },
  {
    id: "dest-4",
    name: "Kigali Convention Centre",
    street: "KG 2 Roundabout",
    city: "Gasabo",
    latitude: -1.9546,
    longitude: 30.0949,
  },
  {
    id: "dest-5",
    name: "Nyamirambo Stadium",
    street: "KN 40 St",
    city: "Nyarugenge",
    latitude: -1.9819,
    longitude: 30.0392,
  },
];

export const BIKE_MOVEMENT_PATHS: Record<string, [number, number][]> = {
  "bike-kig-101": [
    [30.0588, -1.9493],
    [30.0619, -1.9441],
    [30.0677, -1.9448],
    [30.0588, -1.9493],
  ],
  "bike-kig-102": [
    [30.1039, -1.9557],
    [30.1001, -1.9511],
    [30.0949, -1.9546],
    [30.1039, -1.9557],
  ],
  "bike-kig-103": [
    [30.0677, -1.9448],
    [30.0704, -1.9399],
    [30.0619, -1.9441],
    [30.0677, -1.9448],
  ],
  "bike-kig-104": [
    [30.1044, -1.9706],
    [30.1127, -1.9499],
    [30.0949, -1.9546],
    [30.1044, -1.9706],
  ],
};
