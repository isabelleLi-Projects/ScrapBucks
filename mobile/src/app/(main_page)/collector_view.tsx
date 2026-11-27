import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import {Button, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import { useState, useEffect, useRef } from "react";
import { styles } from "../../hooks/styles";
import { Profile } from "../../components/profile";
import { distanceInMiles } from "../../utils/radiusCalc"  
import { RecyclingLocations, RadiusOption } from "../../../../shared/types/recyclingLocations";
import * as Location from "expo-location";
import { BlurView } from "expo-blur";
import Slider from "@react-native-community/slider";
import { DEFAULT_REGION, DEFAULT_RADIUS_MILES, radiusOptions } from "../../../constants";
import { MapMarkers } from "../../components/map-markers";
import { DistanceFilter, DistanceFilterPopup } from "../../components/distance-filter";
import {FullMap} from "../../components/full-map";
import { useMapPressHandlers } from "@/hooks/use-map-press-handlers";





export default function CollectorView() {
  const [locations, setLocations] = useState<RecyclingLocations[]>([])
  const mapRef = useRef<MapView | null>(null);
  const [visibleLocations, setVisibleLocations] = useState<RecyclingLocations[]>([])
  const [userRegion, setUserRegion] = useState<Region | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  
  const [selectedRadius, setSelectedRadius] = useState(DEFAULT_RADIUS_MILES); 
  const [distanceModalVisible, setDistanceModalVisible] = useState(false);
  const [pendingRadius, setPendingRadius] = useState(selectedRadius);
  const locationLabel = hasLocationPermission === true ? "your location" : "bakersfield default area";

  const [isMapFullScreen, setMapFullScreen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<RecyclingLocations | null>(null);
  const routeStart = userRegion ?? DEFAULT_REGION;

  const [currentMapRegion, setCurrentMapRegion] = useState<Region>(DEFAULT_REGION);
 
  
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

  useEffect(() => {
    console.log("Selected location:", selectedLocation);
  }, [selectedLocation]);

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
  
  return (
    <View style={styles.container}>
      <Profile />

      <Text style={collectorStyles.title}>
        Collector
      </Text>

      <DistanceFilter
        pendingRadius={pendingRadius}
        radiusOptions={radiusOptions}
        modalVisible={distanceModalVisible}
        onOpen={() => {
          setPendingRadius(selectedRadius);
          setDistanceModalVisible(true);
        }}
        onClose={() => setDistanceModalVisible(false)}
        onPendingRadiusChange={setPendingRadius}
        onApply={() => {
          setSelectedRadius(pendingRadius);
          setDistanceModalVisible(false);
          showNearbyLocations(pendingRadius);
        }}
      />
      <DistanceFilterPopup
        modalVisible={distanceModalVisible}
        radiusOptions={radiusOptions}
        onOpen={() => setDistanceModalVisible(true)}
        onClose={() => setDistanceModalVisible(false)}
        pendingRadius={pendingRadius}
        onPendingRadiusChange={setPendingRadius}
        onApply={() => {
          setSelectedRadius(pendingRadius);
          setDistanceModalVisible(false);
          showNearbyLocations(pendingRadius);
        }}
      />

      <SmallViewMap
        mapRef={mapRef}
        locations={visibleLocations}
        selectedLocation = {selectedLocation}
        mapRegion={userRegion ?? DEFAULT_REGION}
        onSelectLocation={setSelectedLocation}
        onRegionChangeComplete={setCurrentMapRegion}
        onClearSelection={() => setSelectedLocation(null)}
        onOpenFullScreen={() => setMapFullScreen(true)}
      />

      <FullMap
        isVisible={isMapFullScreen}
        mapRegion={currentMapRegion}
        locations={visibleLocations}
        selectedLocation={selectedLocation}
        selectedRadius={selectedRadius}
        pendingRadius={pendingRadius}
        radiusOptions={radiusOptions}
        modalVisible={distanceModalVisible}
        onSelectLocation={setSelectedLocation}
        onClearSelection={() => setSelectedLocation(null)} 
        onClose={() => setMapFullScreen(false)}
        onOpenDistanceFilter={() => {
          setPendingRadius(selectedRadius);
          setDistanceModalVisible(true);
        }}
        onCloseDistanceFilter={() =>
          setDistanceModalVisible(false)
        }
        onRadiusChange={setPendingRadius}
        onApplyDistanceFilter={() => {
          setSelectedRadius(pendingRadius);
          setDistanceModalVisible(false);
          showNearbyLocations(pendingRadius);
        }}
        
      />
       
       

      <Text style={collectorStyles.title}>
        Accepted Pickups
      </Text>
      <PickupList />
    </View>
  );
}






function SmallViewMap({
  mapRef,
  locations,
  selectedLocation,
  mapRegion,
  onSelectLocation,
  onRegionChangeComplete,
  onClearSelection,
  onOpenFullScreen,
}: {
  mapRef: React.RefObject<MapView | null>;
  locations: RecyclingLocations[];
  selectedLocation: RecyclingLocations | null;
  mapRegion: Region;
  onSelectLocation: (
    location: RecyclingLocations
  ) => void;
  onClearSelection: () => void;
  onRegionChangeComplete: (region: Region) => void;
  onOpenFullScreen: () => void;
}) {
  const {
    handleMarkerPress,
    handleMapPress,
  } = useMapPressHandlers(
    onSelectLocation,
    onClearSelection
  );
  return (
    <View style={collectorStyles.mapFrame}>
      <MapView
        onMarkerPress={(event) => {
          const markerId = event.nativeEvent.id;
      
          const location = locations.find(
            (item) =>
              String(item.recycling_location_id) === markerId
          );
      
          if (location) {
            handleMarkerPress(location);
          }
        }}
        onPress={handleMapPress}
        ref={mapRef}
        style={collectorStyles.map}
        // onPress={handleMapPress}
        initialRegion={mapRegion}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
      >
        <MapMarkers
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={handleMarkerPress}
          showSelectedCallout={false}
        />
      </MapView>
      <Pressable
        style={collectorStyles.fullScreenButton}
        onPress={onOpenFullScreen}
      >
        <Text style={collectorStyles.fullScreenButtonText}>
          ⛶
        </Text>
      </Pressable>

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
function PickupList() {
  return (
    <View style={collectorStyles.pickupFrame}>
      <ScrollView>
        <Pickup />
        <Pickup />
      </ScrollView>
    </View>
  );
}




export const collectorStyles = StyleSheet.create({
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
  markerWrapper: {
    alignItems: "center",
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
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  
  backButtonText: {
    marginTop: -5,
    fontSize: 42,
    color: "#222222",
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  locationCard: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 35,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  
  locationTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222222",
  },
  
  locationAddress: {
    marginTop: 6,
    fontSize: 15,
    color: "#555555",
  },
  
  directionsButton: {
    height: 54,
    marginTop: 20,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ABEEBD",
  },
  
  directionsText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222222",
  },
  fullScreenButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'transparent',
    elevation: 5,
  },
  
  fullScreenButtonText: {
    fontSize: 25,
    color: "#222222",
  },

  fullScreenRadiusButton: {
    position: "absolute",
    top: 60,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    elevation: 5,
  },
  
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222222",
  },
  disabledDirectionsButton: {
    opacity: 0.,
  },
  callout: {
    minWidth: 240,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  
  calloutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111111",
  },
  
  calloutAddress: {
    marginTop: 6,
    fontSize: 14,
    color: "#333333",
  },
  
  markerIcon: {
    fontSize: 28,
  },
  markerTouchArea: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  
  
  
});