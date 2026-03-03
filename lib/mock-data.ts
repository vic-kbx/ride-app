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

export const DUMMY_DRIVER_USERNAMES = [
  "kigali_rider01",
  "moto_jean",
  "aimable_ride",
  "gasabo_fast",
  "kacyiru_wheels",
  "nyaru_rider",
  "remy_moto",
  "moto_claude",
  "ride_by_eric",
  "kcc_rider",
  "kicukiro_go",
  "moto_teta",
  "citywheel_keza",
  "rider_kamanzi",
  "moto_nadine",
  "quickmoto_rw",
  "nyabugogo_line",
  "kg11_runner",
  "moto_habineza",
  "rider_umutoni",
];

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
  {
    id: "dest-6",
    name: "Nyabugogo Bus Terminal",
    street: "KN 1 Ave",
    city: "Nyarugenge",
    latitude: -1.9338,
    longitude: 30.0439,
  },
  {
    id: "dest-7",
    name: "Amahoro Stadium",
    street: "KG 17 Ave",
    city: "Gasabo",
    latitude: -1.944,
    longitude: 30.1131,
  },
  {
    id: "dest-8",
    name: "Rwanda Development Board",
    street: "KG 9 Ave",
    city: "Gasabo",
    latitude: -1.9512,
    longitude: 30.1015,
  },
  {
    id: "dest-9",
    name: "Kigali Independent University",
    street: "KN 15 Rd",
    city: "Nyarugenge",
    latitude: -1.9526,
    longitude: 30.0612,
  },
  {
    id: "dest-10",
    name: "Kacyiru Police HQ",
    street: "KG 9 Ave",
    city: "Gasabo",
    latitude: -1.9387,
    longitude: 30.0929,
  },
  {
    id: "dest-11",
    name: "Kimironko Taxi Park",
    street: "KG 11 Ave",
    city: "Gasabo",
    latitude: -1.9489,
    longitude: 30.1111,
  },
  {
    id: "dest-12",
    name: "Kicukiro Centre",
    street: "KK 15 Rd",
    city: "Kicukiro",
    latitude: -1.9708,
    longitude: 30.0957,
  },
  {
    id: "dest-13",
    name: "Rugando Market",
    street: "KG 28 Ave",
    city: "Gasabo",
    latitude: -1.9435,
    longitude: 30.0896,
  },
  {
    id: "dest-14",
    name: "Nyarutarama Sports Center",
    street: "KG 13 Ave",
    city: "Gasabo",
    latitude: -1.9362,
    longitude: 30.1033,
  },
  {
    id: "dest-15",
    name: "Kanombe Airport Gate",
    street: "KN 5 Rd",
    city: "Kicukiro",
    latitude: -1.9682,
    longitude: 30.1395,
  },
];

export const BIKE_MOVEMENT_PATHS: Record<string, [number, number][]> = {
  "road-kn5": [
    [30.0528, -1.9585],
    [30.0566, -1.9548],
    [30.0588, -1.9493],
    [30.0619, -1.9441],
    [30.0652, -1.9408],
    [30.0691, -1.9382],
  ],
  "road-kn3-kiyovu": [
    [30.0589, -1.9502],
    [30.0611, -1.9473],
    [30.0638, -1.9458],
    [30.0677, -1.9448],
    [30.0702, -1.9439],
    [30.0731, -1.942],
  ],
  "road-kg7-heights": [
    [30.0864, -1.9654],
    [30.0901, -1.9624],
    [30.0949, -1.9546],
    [30.0983, -1.9531],
    [30.1039, -1.9557],
  ],
  "road-kg11-kimironko": [
    [30.0949, -1.9546],
    [30.1006, -1.9532],
    [30.1068, -1.9512],
    [30.1127, -1.9499],
    [30.1184, -1.9487],
  ],
  "road-remera-rdb": [
    [30.0888, -1.9521],
    [30.0921, -1.9512],
    [30.0968, -1.9498],
    [30.1015, -1.9486],
    [30.1064, -1.9468],
  ],
  "road-kcc-loop": [
    [30.0927, -1.9589],
    [30.0949, -1.9546],
    [30.0973, -1.9529],
    [30.1001, -1.9511],
    [30.0981, -1.9562],
    [30.0942, -1.9598],
    [30.0927, -1.9589],
  ],
  "road-kicukiro-kk31": [
    [30.0985, -1.9828],
    [30.1017, -1.9775],
    [30.1044, -1.9706],
    [30.1068, -1.9649],
    [30.1098, -1.9593],
  ],
  "road-nyabugogo-cbd": [
    [30.0315, -1.9298],
    [30.0366, -1.9341],
    [30.0439, -1.9392],
    [30.0502, -1.9447],
    [30.0568, -1.9487],
  ],
  "road-nyamirambo": [
    [30.0337, -1.9842],
    [30.0375, -1.9804],
    [30.0418, -1.9756],
    [30.0462, -1.9699],
    [30.0508, -1.9638],
  ],
  "road-gisozi-kacyiru": [
    [30.0714, -1.9156],
    [30.0752, -1.921],
    [30.0796, -1.9268],
    [30.0837, -1.9331],
    [30.0883, -1.9394],
  ],
};
