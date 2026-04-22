import React from "react";
import * as Location from "expo-location";
import { useJobStore } from "./stores/useJobStore";

interface useLiveGeolocationOptions {
  enabled?: boolean; // reserved for future use
}

const getLocationName = async (latitude: number, longitude: number) => {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    );

    const data = await res.json();

    if (data.results.length > 0) {
      return data.results[0].formatted_address;
    }

    return "Unknown location";
  } catch (err) {
    console.warn("Geocoding error:", err);
    return "Unknown location";
  }
};

export function useLiveGeolocation(
  { enabled }: useLiveGeolocationOptions = {
    enabled: true,
  },
) {
  const jobStore = useJobStore();

  const initializeSocket = React.useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("❌ Location permission denied");
      return;
    }

    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      async (l) => {
        const { latitude, longitude } = l.coords;

        let location: string | null = null;

        try {
          location = await getLocationName(latitude, longitude);
        } catch {
          const fallback = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          if (fallback.length > 0) {
            location = fallback[0].region || fallback[0].country;
          }
        }

        jobStore.setNested("location.latitude", latitude);
        jobStore.setNested("location.longitude", longitude);
        jobStore.setNested("createDto.location", location);
      },
    );

    return () => {
      locationSubscription.remove();
    };
  }, []);

  React.useEffect(() => {
    if (!enabled) return;

    let cleanup: (() => void) | undefined;

    initializeSocket().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cleanup?.();
    };
  }, [enabled, initializeSocket]);

  return {};
}
