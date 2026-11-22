import cron from "node-cron";
import { synchronizeCalRecycleCRVLocations } from "../services/calRecycleSync.service";

// automate the recycle location data to sync every sunday at midnight
export function startCalRecycleSyncJob() {
    const syncCalRecycle = async() => {
        console.log("Starting the weekly recycling location data sync process...")
        try {
            await synchronizeCalRecycleCRVLocations();
            console.log("Finished syncing the recycling location data.")
        } catch (error) {
            console.error("Weekly synchronization failed:", error);
        }
    };

    const test_time = "*/1 * * * *" // run every minute for testing purposes
    const actual_time = "0 0 * * 0" // run every Sunday at midnight (0th minute, 0th hour(midnight) any day of the month, any month, 0th day of week (Sunday))
    cron.schedule(actual_time,  syncCalRecycle, { timezone: "America/Los_Angeles" }); 
    console.log("CalRecycle synchronization job scheduled.");
}
