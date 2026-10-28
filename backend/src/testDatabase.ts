// backend/src/testDatabase.ts

import { db } from "./config/database";
import { getActiveRecyclingLocations } from "./data-access/recyclingLocation.data";

// test that connection is working
async function testDatabase() {
  try {
    const [result] = await db.query("SELECT 1");
    console.log("Database connection works:", result);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await db.end();
  }
}
testDatabase();

// test that RecyclingLocations table can be read
async function testRecyclingLocations() {
    try {
      const locations = await getActiveRecyclingLocations();
  
      console.log("Recycling locations:", locations);
    } catch (error) {
      console.error("Could not retrieve recycling locations:", error);
    }
  }
  testRecyclingLocations();