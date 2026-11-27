import { useCallback, useRef } from "react";
import { RecyclingLocations } from "../../../shared/types/recyclingLocations";
export function useMapPressHandlers(
  onSelectLocation: (location: RecyclingLocations) => void,
  onClearSelection: () => void
) {
  const markerWasPressed = useRef(false);

  const handleMarkerPress = useCallback(
    (location: RecyclingLocations) => {
      markerWasPressed.current = true;
      onSelectLocation(location);
    },
    [onSelectLocation]
  );

  const handleMapPress = useCallback(() => {
    if (markerWasPressed.current) {
      markerWasPressed.current = false;
      return;
    }

    onClearSelection();
  }, [onClearSelection]);

  return {
    handleMarkerPress,
    handleMapPress,
  };
}