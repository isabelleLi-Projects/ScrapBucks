import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import {Button, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import { useState, useEffect, useRef } from "react";
import { styles } from "../hooks/styles";
import { Profile } from "../components/profile";
import { distanceInMiles } from "../utils/radiusCalc"  
import { RecyclingLocations, RadiusOption} from "../../../shared/types/recyclingLocations";
import * as Location from "expo-location";
import { BlurView } from "expo-blur";
import Slider from "@react-native-community/slider";
import { collectorStyles } from "@/app/(main_page)/collector_view";
import { DEFAULT_REGION, DEFAULT_RADIUS_MILES, radiusOptions } from "../../constants";
import { DistanceFilter, DistanceFilterPopup } from "./distance-filter";
import { MapMarkers } from "../components/map-markers";
import { mark } from "expo-router/build/performance/index.js";
import { useMapPressHandlers } from "@/hooks/use-map-press-handlers";


export function FullMap({
    isVisible,
    mapRegion,
    locations,
    selectedLocation,
    selectedRadius,
    pendingRadius,
    radiusOptions,
    modalVisible,
    onSelectLocation,
    onClearSelection,
    onClose,
    onOpenDistanceFilter,
    onCloseDistanceFilter,
    onRadiusChange,
    onApplyDistanceFilter,
  }: {
    isVisible: boolean;
    mapRegion: Region;
    locations: RecyclingLocations[];
    selectedLocation: RecyclingLocations | null;
    selectedRadius: number;
    pendingRadius: number;
    radiusOptions: RadiusOption[];
    modalVisible: boolean;
    onSelectLocation: (
      location: RecyclingLocations
    ) => void;
    onClearSelection: () => void;
    onClose: () => void;
    onOpenDistanceFilter: () => void;
    onCloseDistanceFilter: () => void;
    onRadiusChange: (value: number) => void;
    onApplyDistanceFilter: () => void;
  }) {
    function handleClose() {
        onClearSelection();
        onClose();
    }
    return (
      <Modal
        visible={isVisible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={collectorStyles.fullScreenContainer}>
          <FullScreenMapView
            isVisible={isVisible}
            mapRegion={mapRegion}
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            onClearSelection={onClearSelection}
          />
          <MapBackButton onPress={handleClose} />
  
          <Pressable
            style={collectorStyles.fullScreenRadiusButton}
            onPress={onOpenDistanceFilter}
          >
            <Text style={collectorStyles.filterButtonText}>
              Recycling distance
            </Text>
          </Pressable>
  
          <DistanceFilterPopup
            modalVisible={modalVisible}
            radiusOptions={radiusOptions}
            pendingRadius={pendingRadius}
            onOpen={onOpenDistanceFilter}
            onClose={onCloseDistanceFilter}
            onPendingRadiusChange={onRadiusChange}
            onApply={onApplyDistanceFilter}
          />
  
          < LocationCard
            location={selectedLocation}
          />
        </View>
      </Modal>
    );
  }
  
  function FullScreenMapView({
    isVisible,
    mapRegion,
    locations,
    selectedLocation,
    onSelectLocation,
    onClearSelection,
  }: {
    isVisible: boolean
    mapRegion: Region;
    locations: RecyclingLocations[];
    selectedLocation: RecyclingLocations | null;
    onSelectLocation: 
    (location: RecyclingLocations) => void;
    onClearSelection: () => void;
  }) {
    const fullMapRef = useRef<MapView | null>(null);
    const markerPressed = useRef(false);
    const {
        handleMarkerPress,
        handleMapPress,
      } = useMapPressHandlers(
        onSelectLocation,
        onClearSelection
      );

    useEffect(() => {
      if (!isVisible || !selectedLocation) {
        return;
      }
      setTimeout(() => {
        fullMapRef.current?.animateToRegion(
          {
            latitude: Number(selectedLocation.latitude),
            longitude: Number(selectedLocation.longitude),
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          500
        );
      }, 100);

  
     
      if (locations.length > 0) {
        const coordinates = locations.map((location) => ({
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
        }));
    
        fullMapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: {
            top: 100,
            right: 50,
            bottom: 300,
            left: 50,
          },
          animated: true,
        });
      }
    }, [isVisible, selectedLocation, locations]);

    // function handleMarkerPress(location: RecyclingLocations) {
    //     markerPressed.current = true;
    //     onSelectLocation(location);
    // }
      
    // function handleMapPress() {
    //     // setTimeout(() => {
    //     //     if (markerPressed.current) {
    //     //         markerPressed.current = false;
    //     //         return;
    //     //     }
        
    //     //     onClearSelection();
    //     // }, 100);
    //     if(markerPressed.current) {
    //         markerPressed.current = false;
    //         return;
    //     }
    //     onClearSelection();
    // }
    
    return (
      <MapView
        // onMarkerPress={handleMarkerPress}
        ref={fullMapRef}
        style={collectorStyles.map}
        initialRegion={mapRegion}
        showsUserLocation={true}
        onPress={handleMapPress}
        // onPress={onClearSelection}
      >
        <MapMarkers
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={handleMarkerPress}
          showSelectedCallout={isVisible}
        />
      </MapView>
    );
  }
  function MapBackButton({
    onPress,
  }: {
    onPress: () => void;
  }) {
    return (
      <Pressable
        style={collectorStyles.backButton}
        onPress={onPress}
      >
        <Text style={collectorStyles.backButtonText}>
          ‹
        </Text>
      </Pressable>
    );
  }
function LocationCard({
    location,
  }: {
    location: RecyclingLocations | null;
  }) {
    return (
      <View style={collectorStyles.locationCard}>
        <Text style={collectorStyles.locationTitle}>
          {location?.facility_name ?? "Select a location"}
        </Text>
  
        {location && (
          <Text style={collectorStyles.locationAddress}>
            {location.recycle_address},{" "}
            {location.city}
          </Text>
        )}
  
        <DirectionsButton location={location} />
      </View>
    );
  }
  
  function DirectionsButton({
    location,
  }: {
    location: RecyclingLocations | null;
  }) {
    if (!location) { return null;}
    function openDirections() {
      if (!location) return;
  
      const destination =`${location.latitude},${location.longitude}`;
  
      const url =
        Platform.OS === "ios"
          ? `http://maps.apple.com/?daddr=${destination}`
          : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  
      Linking.openURL(url);
    }
  
    return (
      <Pressable
        style={collectorStyles.directionsButton}
        disabled={!location}
        onPress={openDirections}
      >
        <Text style={collectorStyles.directionsText}>
          Get directions
        </Text>
      </Pressable>
    );
  }
  