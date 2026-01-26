const restaurants = [
  {
    name: "Cold Beverage",
    seats: 50,
    image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Hot Beverages",
    seats: 50,
    image: "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Sushi",
    seats: 75,
    image: "https://images.pexels.com/photos/460537/pexels-photo-460537.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Breakfast",
    seats: 65,
    image: "https://images.pexels.com/photos/687824/pexels-photo-687824.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Lassi",
    seats: 80,
    image: "https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Biryani",
    seats: 70,
    image: "https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Karahi",
    seats: 60,
    image: "https://images.pexels.com/photos/704971/pexels-photo-704971.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Handi",
    seats: 100,
    image: "https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Roll Paratha",
    seats: 90,
    image: "https://images.pexels.com/photos/239975/pexels-photo-239975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "B.B.Q",
    seats: 85,
    image: "https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Chinese",
    seats: 55,
    image: "https://images.pexels.com/photos/1628020/pexels-photo-1628020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Appetizer",
    seats: 110,
    image: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Sides",
    seats: 120,
    image: "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Sandwiches",
    seats: 65,
    image: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Burgers",
    seats: 75,
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Soups",
    seats: 50,
    image: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Salads",
    seats: 60,
    image: "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Tandoor",
    seats: 95,
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
  {
    name: "Dessert",
    seats: 70,
    image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
    address: "Main Service Rd E, F-10 Markaz, Islamabad",
    restaurantTiming: {
      opening: "12:00",
      closing: "00:30",
    }
  },
];

const carouselImages = [
  {
    images: [
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ],
    res_id: "/restaurants/restaurant_1",
  },
  {
    images: [
      "https://images.pexels.com/photos/761854/pexels-photo-761854.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1581554/pexels-photo-1581554.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ],
    res_id: "/restaurants/restaurant_2",
  },
  {
    images: [
      "https://images.pexels.com/photos/914388/pexels-photo-914388.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/15638789/pexels-photo-15638789.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=170.625&fit=crop&h=276.25",
      "https://images.pexels.com/photos/8630151/pexels-photo-8630151.jpeg?auto=compress&cs=tinysrgb&h=138.125&fit=crop&w=154.375&dpr=1",
      "https://images.pexels.com/photos/3656787/pexels-photo-3656787.jpeg?auto=compress&cs=tinysrgb&h=138.125&fit=crop&w=154.375&dpr=1",
      "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ],
    res_id: "/restaurants/restaurant_3",
  },
  {
    images: [
      "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/784633/pexels-photo-784633.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/744780/pexels-photo-744780.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ],
    res_id: "/restaurants/restaurant_4",
  },
  {
    images: [
      "https://images.pexels.com/photos/735869/pexels-photo-735869.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1819669/pexels-photo-1819669.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ],
    res_id: "/restaurants/restaurant_5",
  },
  {
    images: [
      "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/761854/pexels-photo-761854.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ],
    res_id: "/restaurants/restaurant_6",
  },
  {
    images: [
      "https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1581554/pexels-photo-1581554.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/914388/pexels-photo-914388.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/15638789/pexels-photo-15638789.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=236.25&fit=crop&h=382.5",
    ],
    res_id: "/restaurants/restaurant_7",
  },
  {
    images: [
      "https://images.pexels.com/photos/8630151/pexels-photo-8630151.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/3656787/pexels-photo-3656787.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ],
    res_id: "/restaurants/restaurant_8",
  },
  {
    images: [
      "https://images.pexels.com/photos/784633/pexels-photo-784633.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/744780/pexels-photo-744780.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/735869/pexels-photo-735869.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1819669/pexels-photo-1819669.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ],
    res_id: "/restaurants/restaurant_9",
  },
  {
    images: [
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ],
    res_id: "/restaurants/restaurant_10",
  },
  {
    images: [
      "https://images.pexels.com/photos/761854/pexels-photo-761854.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/1581554/pexels-photo-1581554.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ],
    res_id: "/restaurants/restaurant_11",
  },
  {
    images: [
      "https://images.pexels.com/photos/914388/pexels-photo-914388.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/15638789/pexels-photo-15638789.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/8630151/pexels-photo-8630151.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/3656787/pexels-photo-3656787.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ],
    res_id: "/restaurants/restaurant_12",
  },
];

const slots = [
  {
    ref_id: "/restaurants/restaurant_1",
    slot: ["11:30", "13:30", "15:30", "17:30", "19:30", "21:30"],
  },
  {
    ref_id: "/restaurants/restaurant_2",
    slot: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
  },
  {
    ref_id: "/restaurants/restaurant_3",
    slot: ["11:00", "13:00", "15:00", "17:00", "19:00", "21:00", "23:00"],
  },
  {
    ref_id: "/restaurants/restaurant_4",
    slot: [
      "09:00",
      "11:00",
      "13:00",
      "15:00",
      "17:00",
      "19:00",
      "21:00",
      "23:00",
    ],
  },
  {
    ref_id: "/restaurants/restaurant_5",
    slot: ["10:30", "12:30", "14:30", "16:30", "18:30", "20:30"],
  },
  {
    ref_id: "/restaurants/restaurant_6",
    slot: ["11:00", "13:00", "15:00", "17:00", "19:00", "21:00"],
  },
  {
    ref_id: "/restaurants/restaurant_7",
    slot: ["08:30", "10:30", "12:30", "14:30", "16:30", "18:30", "20:30"],
  },
  {
    ref_id: "/restaurants/restaurant_8",
    slot: ["12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
  },
  {
    ref_id: "/restaurants/restaurant_9",
    slot: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
  },
  {
    ref_id: "/restaurants/restaurant_10",
    slot: ["11:30", "13:30", "15:30", "17:30", "19:30", "21:30"],
  },
  {
    ref_id: "/restaurants/restaurant_11",
    slot: ["09:30", "11:30", "13:30", "15:30", "17:30", "19:30"],
  },
  {
    ref_id: "/restaurants/restaurant_12",
    slot: ["11:00", "13:00", "15:00", "17:00", "19:00", "21:00", "23:00"],
  },
  {
    ref_id: "/restaurants/restaurant_13",
    slot: ["12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
  },
];

export { restaurants, carouselImages, slots };