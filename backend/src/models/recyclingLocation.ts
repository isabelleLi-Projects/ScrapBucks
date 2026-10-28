
export interface RecyclingLocation {
    recycling_location_id?: number;
    calrecycle_id: string;
    facility_name: string;
    zip_code: string;
    latitude: number;
    longitude: number;
    city: string;
    recycle_address: string;
    phone?: string | null;
    is_active?: boolean;
    source_updated_at?: Date | null;
    last_synced_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}