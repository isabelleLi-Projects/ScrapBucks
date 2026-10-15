import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {ScrollView, StyleSheet, Text, View,} from "react-native";
import { styles } from "./shared/styles";
import { Profile } from "./shared/components";

export default function CollectorView() {
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
          <Marker
            coordinate={{
              latitude: 37.3352,
              longitude: -121.8811,
            }}
            title="Pickup location"
          />
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