
export interface Post {
  post_id: number;
  price: number;
  description: string;  // ex. number of cans/bags, weight of recyclables, type of recyclables (glass, aluminum cans, etc)
  pickup_location: PickupLocation; 
  pickup_notes: string;
  time_slots: TimeSlot[];
  photos: string[];
  delivery_instruction: "outside pickup" | "knock please";
  pickup_status: PickupStatus;
  post_status: PostStatus;
  expires_at: string;
}

export type PickupStatus =
  | "findingDriver"
  | "driverAccepted"
  | "pickedUp";

export type TimeSlot = {
  day_of_week: number;
  start_time: string;
  end_time: string;
};

export type PostPhoto = {
  url: string;
  publicId: string;
};

type PickupLocation = {
  address_line: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
};

export type PostStatus = "active" | "expired" | "archived";


export const days = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];