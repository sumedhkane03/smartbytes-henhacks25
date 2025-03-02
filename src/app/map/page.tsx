"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import "./page.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import BottomNav from "@/src/components/BottomNav";

// Marker interface for better type safety
interface MarkerLocation {
  lat: number;
  lng: number;
  name?: string;
  isUser?: boolean;
}

export default function SimpleSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("map");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse latitude and longitude from query params
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const centerLat = latParam ? parseFloat(latParam) : 39.680621;
  const centerLng = lngParam ? parseFloat(lngParam) : -75.753038;

  // Store map instance in a ref for persistence across renders
  const mapRef = useRef<mapboxgl.Map | null>(null);
  // Store markers for cleanup
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZGthY2h1cjA2IiwiYSI6ImNscjR4dGM5NjF1NjQya3BlNjI0OGhxMXQifQ.b5ceoAJwCyF0Staf4xqP-Q";

    // Only initialize the map once
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/standard", // Updated style URL
        center: [centerLng, centerLat],
        zoom: 14,
      });

      // Wait for the map to load before adding controls and markers
      mapRef.current.on("load", () => {
        // Add the geolocate control (location puck)
        const geolocate = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          // When active the map will receive updates to the device's location as it changes
          trackUserLocation: true,
          // Draw an arrow next to the location dot to indicate which direction the device is heading
          showUserHeading: true,
          // Show accuracy circle around the location puck
          showAccuracyCircle: true,
        });

        mapRef.current!.addControl(geolocate, "bottom-right");

        // Trigger the geolocate control automatically when map loads
        setTimeout(() => {
          geolocate.trigger(); // Show user location immediately
        }, 1000);

        // Process coordinates array from localStorage
        const storedCoordinates = localStorage.getItem("coordinatesArray");
        if (storedCoordinates) {
          try {
            const coordinatesArray: number[][] = JSON.parse(storedCoordinates);
            coordinatesArray.forEach((pair, index) => {
              const lat = pair[0];
              const lng = pair[1];

              // Skip invalid or undefined coordinates
              if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
                console.log(
                  `Skipping invalid coordinate at index ${index}:`,
                  pair
                );
                return;
              }

              const marker = new mapboxgl.Marker({
                color: "#e74c3c",
                anchor: "bottom",
              })
                .setLngLat([lng, lat])
                .setPopup(
                  new mapboxgl.Popup({ offset: 25 }).setText(
                    `Restaurant ${index + 1}: (${lat.toFixed(4)}, ${lng.toFixed(4)})`
                  )
                )
                .addTo(mapRef.current!);
              markersRef.current.push(marker);
            });
          } catch (error) {
            console.error("Error parsing coordinates array:", error);
          }
        } else {
          console.warn("No coordinates array found in localStorage");
        }
      });
    } else {
      // Update map center if it already exists
      mapRef.current.setCenter([centerLng, centerLat]);
    }

    // Cleanup markers on dependency change (but keep the map instance)
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [centerLat, centerLng]);

  return (
    <div className="page-container">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <Input
            variant="unstyled"
            placeholder="Enter a restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          borderBottom: "1px solid #ddd",
          width: "100%",
          maxWidth: "calc(100% - 32px)",
        }}
      >
        <button
          style={{
            flex: 1,
            padding: "12px",
            textAlign: "center",
            fontWeight: activeTab === "list" ? "bold" : "normal",
            borderBottom: activeTab === "list" ? "3px solid black" : "none",
            background: "none",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => {
            setActiveTab("list");
            // Force a full page reload by using window.location instead of router
            window.location.href = `/dashboard?t=${Date.now()}`;
          }}
        >
          List
        </button>
        <button
          style={{
            flex: 1,
            padding: "12px",
            textAlign: "center",
            fontWeight: activeTab === "map" ? "bold" : "normal",
            borderBottom: activeTab === "map" ? "3px solid black" : "none",
            background: "none",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => {
            setActiveTab("map");
            router.push("/map");
          }}
        >
          Map
        </button>
      </div>

      {/* Map Container */}
      <div id="map" className="map-container"></div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
