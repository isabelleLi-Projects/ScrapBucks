import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {ScrollView, StyleSheet, Text, View,} from "react-native";
import { useState, useEffect } from "react";
import { styles } from "../../hooks/styles";
import { Profile } from "../../components/profile";
import { getMapBounds } from "../../utils/mapBounds"  
import { RecyclingLocations } from "../../../../shared/types/recyclingLocations";


const API_URL = "http://10.0.0.11:3000";

export default function CollectorView() {
  const [locations, setLocations] = useState<RecyclingLocations[]>([])
  useEffect(() =>{
    async function fetchLocations() {
      try {
        const url = `${API_URL}/recycling-locations`;
        console.log("Fetching:", url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const recycleLocationsData: RecyclingLocations[] = await response.json();
        console.log("Locations received:", recycleLocationsData);
        console.log("Location count:", recycleLocationsData.length);

        recycleLocationsData.forEach((location) => {
          console.log(
            location.facility_name,
            Number(location.latitude),
            Number(location.longitude),
          );
        });
        
        setLocations(recycleLocationsData);
      }catch(error) {
        console.error("Failed to fetch recycling locations: ", error);
      }
    }
    fetchLocations();
  }, []);

  return (
    <View style={styles.container}>
      <Profile />
      <Text style={collectorStyles.title}>Collector</Text>

      <View style={collectorStyles.mapFrame}>
        <MapView
          //provider={PROVIDER_GOOGLE}
          style={collectorStyles.map}
          initialRegion={{
            latitude: 37.3352,
            longitude: -121.8811,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {locations.map((location) => (
            <Marker
              key={location.recycling_location_id ?? location.calrecycle_id}
              coordinate={{
                latitude: Number(location.latitude),
                longitude: Number(location.longitude),
              }}
              title={location.facility_name}
              description={`${location.recycle_address}, ${location.city}, ${location.zip_code}`}
            />
          ))}
        </MapView>
      </View>

      <Text style={collectorStyles.title}>Accepted Pickups</Text>

      <View style={collectorStyles.pickupFrame}>
      <ScrollView>
        <Pickup/>
        <Pickup/>
      </ScrollView>
    </View>

    </View>
  );
}

function Pickup() {
  return (
    <View style={collectorStyles.pickup}> 
        <Text>Pickup information</Text>
    </View>
  );
}

const collectorStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  mapFrame: {
    height: 200,
    width: "100%",
    borderRadius: 20,
    marginBottom: 40,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  pickupFrame: {
    height: 350,
    width: "100%",
    borderRadius: 20,
    marginBottom: 40,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: 10,
    gap: 10,
  },
  pickup: {
    height: 100,
    width: "90%",
    borderRadius: 20,
    marginBottom: 5,
    margin: "5%",
    overflow: "hidden",
    backgroundColor: "#abeebd",
  }
});