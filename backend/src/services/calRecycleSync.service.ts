import { upsertRecyclingLocation, deactivateMissingLocations } from "../data-access/recyclingLocation.data";

export async function synchronizeCalRecycleLocations(): Promise<void> {
    const syncStartedAt = new Date();
    const baseUrl = process.env.CALRECYCLE_DATA_URL;
    if (!baseUrl) {
        throw new Error("CALRECYCLE_DATA_URL is missing from .env");
    }
    const url = new URL(baseUrl);

    // use the bounds function (don't hardcode the values)
    
    // only need CRV locations
    url.searchParams.set("_CRVRecyclingCenters", "true");
    url.searchParams.set("_ElectronicFacilities", "false");
    url.searchParams.set("_WasteTireCenters", "false");
    url.searchParams.set("_UsedOilCenters", "false");

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
        `CalRecycle request failed: ${response.status}`
        );
  }
  const rawData = await response.json();
  console.log("CalRecycle response:", rawData);

}

// create bounds for which locations customers can see
function getMapBounds(region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) {
    return {
      north: region.latitude + region.latitudeDelta / 2,
      south: region.latitude - region.latitudeDelta / 2,
      east: region.longitude + region.longitudeDelta / 2,
      west: region.longitude - region.longitudeDelta / 2,
    };
  }