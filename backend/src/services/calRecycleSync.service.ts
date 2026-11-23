import dotenv from "dotenv";
dotenv.config({ override: true });
import { upsertRecyclingLocation, deactivateMissingLocations } from "../data-access/recyclingLocation.data";
import { RecyclingLocation } from "../models/recyclingLocation.model";
import { CalRecycleFeature, CalRecycleResponse } from "../models/calRecycle.model";
// import { startCalRecycleSyncJob } from "../jobs/calRecycleSync.job";

// updates the database
export async function synchronizeCalRecycleCRVLocations(): Promise<void> {
    const syncStartedAt = new Date();
    const baseUrl = process.env.CALRECYCLE_DATA_URL;
    if (!baseUrl) {
        throw new Error("CALRECYCLE_DATA_URL is missing from .env");
    }
    const url = new URL(baseUrl);

    // bounds are fixed w/ small buffer from the site bounds
    // hard code values to try and cover all of California so that locations are updated in the database
    url.searchParams.set("north", "42.1");
    url.searchParams.set("south", "32.4");
    url.searchParams.set("east", "-114.0");
    url.searchParams.set("west", "-124.7");

    // only need CRV locations
    url.searchParams.set("_CRVRecyclingCenters", "true");
    url.searchParams.set("_ElectronicFacilities", "false");
    url.searchParams.set("_WasteTireCenters", "false");
    url.searchParams.set("_UsedOilCenters", "false");

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`CalRecycle request failed: ${response.status}`);
    }
    const rawData = await response.json(); // link should return GeoJSON array of California CRV
    console.log("CalRecycle response:", rawData);

    // Extract the raw data 
    const crvFeatures = Array.isArray(rawData) ? rawData : rawData.features ?? []; // returns [] if raw data is not an array or if cannot find key features
    console.log("Number of map features:", crvFeatures.length);
    console.log("First feature:", crvFeatures[0]);
    if (crvFeatures.length === 0) {
        throw new Error("No CRV locations were found.");
    }

    // feature is from the calRecycle.model interface
    const locations = crvFeatures.map((feature: CalRecycleFeature) => {    
        const properties = feature.properties;
        const [source_longitude, source_latitude] = feature.geometry.coordinates;
        const latitude = Number(source_latitude.toFixed(8)); //always 8 decimal places
        const longitude = Number(source_longitude.toFixed(8));
        // format into database attributes
        return {
            calrecycle_id: [properties.Name.trim(), properties.Address.trim(), properties.City.trim(), properties.PostalCode,].join('|').toUpperCase(),
            facility_name: properties.Name.trim(),
            zip_code: String(properties.PostalCode).trim(),
            latitude: latitude,
            longitude: longitude,
            city: properties.City.trim(),
            recycle_address: properties.Address.trim(),
            phone: properties.Phone?.trim() ?? null, // value ?? fallbackValue
            source_updated_at: null, // calRecycle does not provide us with this data
        };
    });

    // upsert in parallel rather than one at a time
    // wait for all inserts and updates: returns "fullfilled" or "rejected"
    const results = await Promise.allSettled(locations.map((location : RecyclingLocation) => upsertRecyclingLocation(location)))
    
    const failed = results.filter((r) => r.status === 'rejected')
    failed.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error("Upsert failed:", result.reason);
        }
      });
    const successful = results.length - failed.length;
    console.log(`Successful upserts: ${successful}`);
    console.log(`Failed upserts: ${failed.length}`);
    results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error("Failed location:", locations[index]);
          console.error("Reason:",result.reason);
        }
      });
    if (failed.length === 0) {
        await deactivateMissingLocations(syncStartedAt);
    }else {
        console.error(`${failed.length} upserts failed. Skipping deactivation to prevent data loss.`); // use backticks becasue we have an expression failed.length
    }   
}



