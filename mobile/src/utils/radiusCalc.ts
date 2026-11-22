// Haversine formula: ignores roads, terrain, and turns (only provides straight-line distance)
export function distanceInMiles(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
): number {
  const earthRadiusMiles = 3958.8;

  const toRadians = (degrees: number) =>
    degrees * (Math.PI / 180);

  const latitudeDifference = toRadians(latitude2 - latitude1);
  const longitudeDifference = toRadians(longitude2 - longitude1);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(latitude1)) *
    Math.cos(toRadians(latitude2)) *
    Math.sin(longitudeDifference / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMiles * c;
}
// // create bounds for which locations customers can see
// // used when the user zooms in and out of the map
// export function getMapBounds(region: {
//     latitude: number;
//     longitude: number;
//     latitudeDelta: number;
//     longitudeDelta: number;
//   }) {
//     return {
//       north: region.latitude + region.latitudeDelta / 2,
//       south: region.latitude - region.latitudeDelta / 2,
//       east: region.longitude + region.longitudeDelta / 2,
//       west: region.longitude - region.longitudeDelta / 2,
//     };
//   }