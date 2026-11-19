// backend/src/testDatabase.ts

import { db } from "./config/database";
import { getActiveRecyclingLocations, upsertRecyclingLocation } from "./data-access/recyclingLocation.data";

// test that connection is working
async function testDatabase() {
  try {
    const [result] = await db.query("SELECT 1");
    console.log("Database connection works:", result);
  } catch (error) {
    console.error("Database connection failed:", error);
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

  
  async function testUpsert() {
    try {
      await upsertRecyclingLocation({
        calrecycle_id: "TEST-001",
        facility_name: "Test CRV Recycling Center",
        zip_code: "95112",
        latitude: 37.3382,
        longitude: -121.8863,
        city: "San Jose",
        recycle_address: "100 Test Street",
        phone: "408-555-1234",
        source_updated_at: null,
      });
  
      const locations = await getActiveRecyclingLocations();
  
      console.log("Locations after insert:", locations);
    } catch (error) {
      console.error("Upsert test failed:", error);
    }
  }
  
  testUpsert();