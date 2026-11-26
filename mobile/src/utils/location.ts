import { Alert } from "react-native";
import * as Location from "expo-location";

export async function getCoordinates(address: string) {
  try {
    const results = await Location.geocodeAsync(address);

    if (results.length === 0) {
      Alert.alert("Address not found", "Please check the address.");
      return null;
    }

    const { latitude, longitude } = results[0];

    return {
      latitude,
      longitude,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    Alert.alert("Error", "Could not find that address.");
    return null;
  }
}