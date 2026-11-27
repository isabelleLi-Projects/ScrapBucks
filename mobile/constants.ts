import { Region } from "react-native-maps";


export const DEFAULT_REGION: Region = {
    // 93307 area code (has most recycling locations)
    latitude: 35.294058225349104,
    longitude: -118.9755342951712,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  export const DEFAULT_RADIUS_MILES = 10;
  
  export const radiusOptions = [
    { label: "2 blocks", miles: 0.1 },
    { label: "6 blocks", miles: 0.3 },
    { label: "1 mile", miles: 1 },
    { label: "3 miles", miles: 3 },
  ];