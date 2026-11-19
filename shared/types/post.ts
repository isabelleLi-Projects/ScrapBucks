
export interface Post {
  post_id: number;
  price: number;
  description: string;  // ex. number of cans/bags, weight of recyclables, type of recyclables (glass, aluminum cans, etc)
  pickup_location: PickupLocation; // should this be a string????
  pickup_notes: string;
  time_slots: TimeSlot[];
  photos: string[];
  delivery_instruction: "outside pickup" | "knock please";
  status: PickupStatus;
}

export type PickupStatus =
  | "findingDriver"
  | "driverFound"
  | "pickedUp";

type TimeSlot = {
  day_of_week: number;
  start_time: string;
  end_time: string;
};

type PickupLocation = {
  address_line: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
};


export const examplePosts: Post[] = [
  {
    post_id: 1,
    price: 5,
    description: "5 bags of aluminum cans",
    pickup_location: {
      address_line: "123 Main Street",
      city: "San Jose",
      state: "CA",
      zip_code: "95112",
      latitude: 37.3382,
      longitude: -121.8863,
    },
    pickup_notes: "Leave them near the front door",
    time_slots: [
      {
        day_of_week: 1,
        start_time: "10:00",
        end_time: "12:00",
      },
    ],
    photos: [
      "https://react.dev/images/docs/scientists/MK3eW3As.jpg",
    ],
    delivery_instruction: "outside pickup",
    status: "findingDriver",
  },
];