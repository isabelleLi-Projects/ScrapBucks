// create bounds for which locations customers can see
// used when the user zooms in and out of the map
function getMapBounds(region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) {
    return {
      north: region.latitude + region.latitudeDelta / 2,
      south: region.latitude - region.latitudeDelta / 2,
      east: region.longitude + region.longitudeDelta / 2,
      west: region.longitude - region.longitudeDelta / 2,
    };
  }