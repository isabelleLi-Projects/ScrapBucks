import dotenv from "dotenv";

dotenv.config({ override: true });

import { db } from "./config/database";
import {
  synchronizeCalRecycleCRVLocations,
} from "./services/calRecycleSync.service";

async function testSync() {
  try {
    console.log("Starting one-time synchronization...");

    await synchronizeCalRecycleCRVLocations();

    console.log("Synchronization finished.");
  } catch (error) {
    console.error("Synchronization failed:", error);
  } finally {
    // Close the database pool after the test finishes
    await db.end();
  }
}

testSync();