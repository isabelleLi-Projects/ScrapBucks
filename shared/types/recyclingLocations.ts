
// for collector view
export interface RecyclingLocations {
  recycling_location_id: number;
  latitude: number;
  longitude: number;
  calrecycle_id: string;
  facility_name: string;
  zip_code: string;
  city: string;
  recycle_address: string;
  phone?: string;
}