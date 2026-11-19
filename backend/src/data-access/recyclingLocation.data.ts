import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../config/database";
import { RecyclingLocation } from "../models/recyclingLocation";

// imports typescript interface so the returned data has the correct structure
// combines the fields in RecyclingLocation and RowDataPacket
interface RecyclingLocationRow extends RecyclingLocation, RowDataPacket{}


// returns an array of recycling locations
export async function getActiveRecyclingLocations(): Promise<RecyclingLocation[]> {
    // wait for the query to finish based on the Promise
    const [rows] = await db.query<RecyclingLocationRow[]>(`
        SELECT recycling_location_id, calrecycle_id, facility_name, zip_code, latitude, longitude, city, recycle_address, phone, is_active, source_updated_at, last_synced_at, created_at, updated_at
        FROM RecyclingLocations
        WHERE is_active = TRUE`
    );
    return rows; // MYSQL returns the query
}

// marks old locations as inactive based on the current sync
export async function deactivateMissingLocations(syncStartedAt: Date): Promise<void> {
    await db.query<ResultSetHeader> (`
        UPDATE RecyclingLocations
        SET is_active = FALSE
        WHERE last_synced_at < ? 
    `)    // finds locations who last synced at is older than current time
}

//upsert = combines "update" and "insert" for the insert
export async function upsertRecyclingLocation(location: RecyclingLocation): Promise<void> {
    // update only if primary key exists 
    const sql = 
    `INSERT INTO RecyclingLocations(calrecycle_id, facility_name, zip_code, latitude, longitude, city, recycle_address, phone, is_active, source_updated_at, last_synced_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, NOW())
    ON DUPLICATE KEY UPDATE facility_name = VALUES(facility_name), zip_code = VALUES(zip_code), latitude = VALUES(latitude), longitude = VALUES(longitude), city = VALUES(city), recycle_address = VALUES(recycle_address), phone = VALUES(phone)`
    // replace the ? values
    const values = [location.calrecycle_id,  location.facility_name, location.zip_code, location.latitude, location.longitude, location.city, location.recycle_address, location.phone ?? null, location.source_updated_at ?? null, ]
    // waits to finish the insert 
    await db.query<ResultSetHeader>(sql, values)
}
