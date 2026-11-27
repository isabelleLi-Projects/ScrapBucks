
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

export function DistanceFilter({pendingRadius, radiusOptions, modalVisible, onOpen, onClose, onPendingRadiusChange, onApply,}: {
    pendingRadius: number;
    radiusOptions: RadiusOption[];
    modalVisible: boolean;
    onOpen: () => void;
    onClose: () => void;
    onPendingRadiusChange: (value: number) => void;
    onApply: () => void;
  }) 
  {
    return (
      <>
        <View style={collectorStyles.radiusContainer}>
          <Pressable
            style={collectorStyles.radiusTab}
            onPress={onOpen}
          >
            <Text style={collectorStyles.radiusText}>
              Recycling Locations Distance
            </Text>
  
            <Text style={collectorStyles.chevron}>
              ⌄
            </Text>
          </Pressable>
        </View>
        
      </>
    );
  }

  export function DistanceFilterPopup({modalVisible, radiusOptions, onOpen, onClose, pendingRadius, onPendingRadiusChange, onApply,}: {
    modalVisible: boolean;
    radiusOptions: RadiusOption[];
    onOpen: () => void;
    onClose: () => void;
    pendingRadius: number;
    onPendingRadiusChange: (value: number) => void;
    onApply: () => void;})
    {
      return (
        <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={onClose}
      >
        <View style={collectorStyles.modalContainer}>
          <BlurView
            intensity={25}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
  
          <Pressable
            style={collectorStyles.darkOverlay}
            onPress={onClose}
          />
  
          <View style={collectorStyles.bottomSheet}>
            <View style={collectorStyles.sheetHandle} />
  
            <View style={collectorStyles.sheetHeader}>
              <Text style={collectorStyles.sheetTitle}>
                Recycling Locations Distance
              </Text>
  
              <Pressable onPress={onClose}>
                <Text style={collectorStyles.closeButton}>
                  ×
                </Text>
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
                  onPress={() =>
                    onPendingRadiusChange(option.miles)
                  }
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
                onValueChange={onPendingRadiusChange}
              />
  
              <View style={collectorStyles.sliderLabels}>
                <Text>0 mi</Text>
                <Text>50 mi</Text>
              </View>
            </View>
  
            <Pressable
              style={collectorStyles.applyButton}
              onPress={onApply}
            >
              <Text style={collectorStyles.applyText}>
                Apply
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      )
    }