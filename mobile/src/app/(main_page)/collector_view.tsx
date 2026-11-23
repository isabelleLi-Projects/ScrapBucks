import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import {Button, Modal, Pressable, ScrollView, StyleSheet, Text, View,} from "react-native";
import { useState, useEffect, useRef } from "react";
import { styles } from "../../hooks/styles";
import { Profile } from "../../components/profile";
import { distanceInMiles } from "../../utils/radiusCalc"  
import { RecyclingLocations } from "../../../../shared/types/recyclingLocations";
import * as Location from "expo-location";
import { BlurView } from "expo-blur";
import Slider from "@react-native-community/slider";



export default function CollectorView() {
  const [locations, setLocations] = useState<RecyclingLocations[]>([])
  const mapRef = useRef<MapView | null>(null);
  const [visibleLocations, setVisibleLocations] = useState<RecyclingLocations[]>([])
  const [userRegion, setUserRegion] = useState<Region | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const DEFAULT_REGION: Region = {
    // 93307 area code (has most recycling locations)
    latitude: 35.294058225349104,
    longitude: -118.9755342951712,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  const DEFAULT_RADIUS_MILES = 10;
  const radiusOptions = [
    { label: "2 blocks", miles: 0.1 },
    { label: "6 blocks", miles: 0.3 },
    { label: "1 mile", miles: 1 },
    { label: "3 miles", miles: 3 },
  ];
  const [selectedRadius, setSelectedRadius] = useState(DEFAULT_RADIUS_MILES); 
  const [distanceModalVisible, setDistanceModalVisible] = useState(false);
  const [pendingRadius, setPendingRadius] = useState(selectedRadius);
  const mapRegion = userRegion ?? DEFAULT_REGION;
  const locationLabel = hasLocationPermission === true ? "your location" : "bakersfield default area";

  
  useEffect(() =>{
    async function fetchLocations() {
      const API_URL = "http://10.0.0.11:3000";
      try {
        const url = `${API_URL}/recycling-locations`;
        console.log("Fetching:", url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const recycleLocationsData: RecyclingLocations[] = await response.json();
        
        setLocations(recycleLocationsData);
        setVisibleLocations(recycleLocationsData);
      }catch(error) {
        console.error("Failed to fetch recycling locations: ", error);
      }
    }
    fetchLocations();
  }, []);

  
  useEffect(() => {
    async function getUserLocation() {
      
      const servicesEnabled = await Location.hasServicesEnabledAsync();

      if (!servicesEnabled) {
        console.warn('Location services are disabled on the device.');
        return null;
      }

      const { status } = await Location.requestForegroundPermissionsAsync(); // phone's popup for location
      if (status === "granted"){
        setHasLocationPermission(true); 
      }
      if (status !== "granted"){
        console.log("Location permission denied");
        setUserRegion(DEFAULT_REGION);
        setHasLocationPermission(false);
        return; 
      }
      const userLocation = await Location.getCurrentPositionAsync({accuracy : Location.Accuracy.Low})

      // rerender the userLocation
      setUserRegion({
        latitude: userLocation.coords.latitude, 
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05, // vertical zoom level ~3.5 miles 
        longitudeDelta: 0.05 // horizontal zoom level ~3.5 miles 
      });
    }
    getUserLocation();
  }, []);

  useEffect(() =>  {
    if (!userRegion || locations.length === 0) {
      return;
    }
    showNearbyLocations(DEFAULT_RADIUS_MILES);
  }, [userRegion, locations])
  
    return (
      <View style={styles.container}>
        <Profile />
        <Text style={collectorStyles.title}>Collector</Text>

        <View style={collectorStyles.radiusContainer}>
          <Pressable style={collectorStyles.radiusTab}
            onPress={() => {
              setPendingRadius(selectedRadius);
              setDistanceModalVisible(true);
            }}
          >
            <Text style={collectorStyles.radiusText}>
              Recycling Locations Distance:
              {/* Find recycling locations: {selectedRadius.toFixed(1)} miles of {locationLabel} */}
            </Text>
            <Text style={collectorStyles.chevron}>⌄</Text>
          </Pressable>
        </View>

        <Modal
          visible={distanceModalVisible}
          transparent={true}
          animationType="none"
          onRequestClose={() => setDistanceModalVisible(false)}
        >
          
          <View style={collectorStyles.modalContainer}>
            <BlurView
              intensity={25}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <Pressable
              style={collectorStyles.darkOverlay}
              onPress={() => setDistanceModalVisible(false)}
            />
            <View style={collectorStyles.bottomSheet}>
              <View style={collectorStyles.sheetHandle}/>
              <View style={collectorStyles.sheetHeader}>
                <Text style={collectorStyles.sheetTitle}>
                  Recycling Locations Distance
                </Text>

                <Pressable
                  onPress={() => setDistanceModalVisible(false)}
                >
                  <Text style={collectorStyles.closeButton}>×</Text>
                </Pressable>
              </View>

              <View style={collectorStyles.optionsContainer}>
                {radiusOptions.map((option) => (
                  <Pressable
                    key={option.label}
                    style={[
                      collectorStyles.radiusOption,
                      pendingRadius === option.miles &&
                        collectorStyles.selectedRadiusOption,
                    ]}
                    onPress={() => setPendingRadius(option.miles)}
                  >
                    <Text
                      style={[
                        collectorStyles.radiusOptionText,
                        pendingRadius === option.miles &&
                          collectorStyles.selectedRadiusText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={collectorStyles.sliderSection}>
                {/* <Text style={collectorStyles.sliderTitle}>
                  Distance
                </Text> */}

                <Text style={collectorStyles.sliderValue}>
                  {pendingRadius.toFixed(1)} miles
                </Text>

                <Slider
                  style={collectorStyles.slider}
                  minimumValue={0}
                  maximumValue={50}
                  step={0.1}
                  value={pendingRadius}
                  minimumTrackTintColor="#cef2bb"
                  maximumTrackTintColor="#D9D9D9"
                  thumbTintColor="#8DBF96"
                  onValueChange={(value) => setPendingRadius(value)}
                />

                <View style={collectorStyles.sliderLabels}>
                  <Text>0 mi</Text>
                  <Text>50 mi</Text>
                </View>
              </View>
              <Pressable
                style={collectorStyles.applyButton}
                onPress={() => {
                  setSelectedRadius(pendingRadius);
                  setDistanceModalVisible(false);
                  showNearbyLocations(pendingRadius);
                }}
              >
                <Text style={collectorStyles.applyText}>
                  Apply
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        
        <View style={collectorStyles.mapFrame}>
          <MapView
            ref={mapRef}
            //provider={PROVIDER_GOOGLE}
            style={collectorStyles.map}
            initialRegion={mapRegion}
            showsUserLocation={true}
          >
  
            {visibleLocations.map((location) => (
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
          <Text style={collectorStyles.radiusText}> 
              Recycling Locations {selectedRadius.toFixed(1)} miles of {locationLabel}
          </Text>
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

  function fitByLocations(locationToFit: RecyclingLocations[]) {
    
    const coordinates = locationToFit.map((location) => ({
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
    }))
    .filter((coordinate) => 
      Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude),
    )
    if (coordinates.length === 0) {
      return;
    }
    if (coordinates.length === 1) {
      mapRef.current?.animateToRegion(
        {
          latitude: coordinates[0].latitude,
          longitude: coordinates[0].longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        500, // allows 500ms to zoom
      );
    }else {
      mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: {
            // clips the markers that sit right on the edge of the rectangle
            top: 40,
            bottom: 40,
            right: 40,
            left: 40,
          },
          animated: true,
        }
      )
    }
  }
  function showNearbyLocations(radiusMiles: number) {
    const searchCenter = userRegion ?? DEFAULT_REGION;
    const nearbyLocations = locations.filter((location) => {
      const distance = distanceInMiles(
        searchCenter.latitude,
        searchCenter.longitude,
        Number(location.latitude), //Recycling Locations's latitude
        Number(location.longitude), //Recycling Locations's longitude
      );
      return distance <= radiusMiles;
    });
    setVisibleLocations(nearbyLocations);
    fitByLocations(nearbyLocations);
  }
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
  },
  radiusContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: "2.5%",
    zIndex: 1,
  },
  chevron: {
    fontSize: 20,
    marginLeft: 12,
    color: "#555555",
  },
  radiusTab: {
    minWidth: 100,
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginLeft: 5,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#B7C9D8",
  },
  
  radiusText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D0D0D0",
    alignSelf: "center",
    marginBottom: 20,
  },
  
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  sheetTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222222",
  },
  
  closeButton: {
    fontSize: 38,
    fontWeight: "300",
    color: "#222222",
  },
  
  sliderSection: {
    marginBottom: 32,
  },
  
  sliderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222222",
  },
  
  sliderValue: {
    fontSize: 17,
    fontWeight: "500",
    color: "#333333",
  },
  
  slider: {
    width: "100%",
    height: 40,
    marginTop: 18,
  },
  
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  
  selectedRadiusText: {
    color: "#147A8A",
    fontWeight: "bold",
  },
  
  applyButton: {
    height: 58,
    borderRadius: 30,
    backgroundColor: "#abeebd",
    alignItems: "center",
    justifyContent: "center",
  },
  
  applyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },

  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 36,
  },
  
  radiusOption: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
  },
  
  selectedRadiusOption: {
    borderColor: "#147A8A",
    backgroundColor: "#E5F6F8",
  },
  
  radiusOptionText: {
    fontSize: 16,
    color: "#333333",
  },
  
  
});