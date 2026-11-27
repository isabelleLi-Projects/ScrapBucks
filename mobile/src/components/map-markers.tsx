import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { RecyclingLocations, RadiusOption} from "../../../shared/types/recyclingLocations";
import { View, Text } from "react-native";
import { collectorStyles } from "@/app/(main_page)/collector_view";
import { useEffect, useRef } from "react";
import type { ComponentRef } from "react";

// export function MapMarkers({locations, selectedLocation, onSelectLocation, showSelectedCallout}: {
//     locations: RecyclingLocations[]; 
//     selectedLocation: RecyclingLocations | null;
//     onSelectLocation: (location: RecyclingLocations) => void;
//     showSelectedCallout: boolean
// })
// {
//     return (
//       <>
//         {locations.map((location) => {
//             const isSelected = selectedLocation?.recycling_location_id === location.recycling_location_id 
//             && selectedLocation?.calrecycle_id === location.calrecycle_id;
//             return (
//                 <Marker
//                     key={location.recycling_location_id ?? location.calrecycle_id}
//                     coordinate={{
//                         latitude: Number(location.latitude),
//                         longitude: Number(location.longitude),
//                     }}
//                     onPress={() => {
//                         console.log("Marker pressed:", location.facility_name);
//                         onSelectLocation(location);
//                     }}
//                     title={location.facility_name}
//                     description={`${location.recycle_address}, ${location.city}, ${location.zip_code}`}
//                 // pinColor={isSelected ? "#147A8A" : "#D9534F"}       
//                 >  
//                     <View style={collectorStyles.markerWrapper}>
//                         <Text style={collectorStyles.markerIcon}>♻</Text>
//                     </View>
//                 </Marker>
//             );
//         })}
//       </>
//     );
// }

export function MapMarkers({locations, selectedLocation, onSelectLocation, showSelectedCallout}: {
    locations: RecyclingLocations[]; 
    selectedLocation: RecyclingLocations | null;
    onSelectLocation: (location: RecyclingLocations) => void;
    showSelectedCallout: boolean
})
{
    return (
    <>
      {locations.map((location) => (
        <LocationMarker
          key={
            location.recycling_location_id ??
            location.calrecycle_id
          }
          location={location}
          selectedLocation={selectedLocation}
          onSelectLocation={onSelectLocation}
          showSelectedCallout={showSelectedCallout}
        />
      ))}
    </>
  );
}
function LocationMarker({
    location,
    selectedLocation,
    onSelectLocation,
    showSelectedCallout,
  }: {
    location: RecyclingLocations;
    selectedLocation: RecyclingLocations | null;
    onSelectLocation: (location: RecyclingLocations) => void;
    showSelectedCallout: boolean;
  }) {
    const markerRef = useRef<ComponentRef<typeof Marker> | null>(null);
  
    const isSelected =
      selectedLocation?.recycling_location_id ===
      location.recycling_location_id;
  
    useEffect(() => {
      if (!showSelectedCallout || !isSelected) {
        return;
      }
      const timer = setTimeout(() => {
        markerRef.current?.showCallout();
      }, 300);
  
      return () => clearTimeout(timer);
    }, [showSelectedCallout, isSelected]);
  
    return (
      <Marker
        identifier={String(location.recycling_location_id)}
        ref={markerRef}
        coordinate={{
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
        }}
        // Callout
        title={location.facility_name}
        description={`${location.recycle_address}, ${location.city}, ${location.zip_code}`}
        onPress={() => onSelectLocation(location)}
      >
        <Text style={collectorStyles.markerIcon}>♻</Text>
      </Marker>
    );
  }



      
