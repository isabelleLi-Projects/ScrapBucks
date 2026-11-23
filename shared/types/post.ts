
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