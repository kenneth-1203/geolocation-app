"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

type Position = {
  lat: number;
  lng: number;
};

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  const [position, setPosition] = useState<Position | null>(null);
  const [address, setAddress] = useState("");
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login");
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        getNearestAddress(coords);
        setPosition(coords);
      });
    }
  }, []);

  const getNearestAddress = async (position: Position) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      setAddress(data.results[0].formatted_address);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    router.push("/login");
  };

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      if (position) {
        const bounds = new window.google.maps.LatLngBounds(position);
        map.fitBounds(bounds);
        map.setCenter(position);
      }
    },
    [position]
  );

  return (
    <div>
      <div className="h-16 flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold">Your current location is</h1>
        <p className="text-sm">{address}</p>
      </div>
      <div className="flex justify-center w-full h-[calc(100vh-8rem)]">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            zoom={16}
            onLoad={onLoad}
          />
        )}
      </div>
      <div className="h-16 flex items-center justify-center">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
}
