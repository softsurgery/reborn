import React from "react";
import * as Location from "expo-location";

interface useLiveGeolocationOptions {
  enabled?: boolean; // reserved for future use
}
const getLocationName = async (latitude: number, longitude: number) => {
  try {
    const [place] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (!place) return "Unknown location";

    const city = place.city || place.region;
    const country = place.country;

    if (city && country) {
      return `${city}, ${country}`;
    }

    return country || city || "Unknown location";
  } catch (err) {
    console.warn("Reverse geocode error:", err);
    return "Unknown location";
  }
};

export function useLiveGeolocation(
  { enabled }: useLiveGeolocationOptions = {
    enabled: true,
  },
) {
  const [locationName, setLocationName] = React.useState<string>("");
  const [latitude, setLatitude] = React.useState<number>(0);
  const [longitude, setLongitude] = React.useState<number>(0);
  const [isPending, setIsPending] = React.useState<boolean>(true);

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

        setLatitude(latitude);
        setLongitude(longitude);
        setLocationName(location || "Unknown location");
        setIsPending(false);
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

  return { locationName, latitude, longitude, isPending };
}
