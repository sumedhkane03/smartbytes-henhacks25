"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Card from "../../components/card";
import { searchNearbyRestaurants } from "@/src/functions/menu_items";
import "./page.css";
import defaultImage from "@/public/images/Default.png";

// Default location (fallback)
const defaultLat = 38.984783;
const defaultLng = -77.113892;

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState({
    lat: defaultLat,
    lng: defaultLng,
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchNearbyRestaurants() {
      try {
        setLoading(true);
        const searchRadius = 16093; // 10 miles in meters
        const resultLimit = 15;
        let restaurantsData;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ lat: latitude, lng: longitude });
              restaurantsData = await searchNearbyRestaurants(
                latitude,
                longitude,
                searchRadius,
                resultLimit
              );
              setRestaurants(restaurantsData);
              setLoading(false);
            },
            async (error) => {
              console.error("Geolocation error:", error);
              setUserLocation({ lat: defaultLat, lng: defaultLng });
              restaurantsData = await searchNearbyRestaurants(
                defaultLat,
                defaultLng,
                searchRadius,
                resultLimit
              );
              setRestaurants(restaurantsData);
              setLoading(false);
            }
          );
        } else {
          restaurantsData = await searchNearbyRestaurants(
            defaultLat,
            defaultLng,
            searchRadius,
            resultLimit
          );
          setRestaurants(restaurantsData);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setError("Failed to load restaurants. Please try again later.");
        setLoading(false);
      }
    }
    fetchNearbyRestaurants();
  }, []);

  // New useEffect: compute, print, and pass the coordinates array when restaurants change
  useEffect(() => {
    if (restaurants.length > 0) {
      const coordinates = restaurants.map((r) => [
        r.lat || (r.location && r.location.lat),
        r.lng || (r.location && r.location.lng),
      ]);
      // console.log("Coordinates 2D array:", coordinates);
      // Pass the 2D array to the map page by storing it in localStorage
      localStorage.setItem("coordinatesArray", JSON.stringify(coordinates));
    }
  }, [restaurants]);

  interface Restaurant {
    place_id: string;
    name: string;
    address?: string;
    logo?: string;
    photo?: string;
    lat?: number;
    lng?: number;
    location?: { lat: number; lng: number };
  }

  const handleCardClick = (restaurant: Restaurant) => {
    const encodedName = encodeURIComponent(restaurant.name);
    const encodedId = encodeURIComponent(restaurant.place_id);
    router.push(`/menu?name=${encodedName}&id=${encodedId}`);
  };

  // Filter restaurants by search query
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (restaurant.address &&
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        }}
      >
        <button
          style={{
            width: "150px",
            padding: "12px",
            textAlign: "center",
            fontWeight: activeTab === "list" ? "bold" : "normal",
            borderBottom: activeTab === "list" ? "3px solid black" : "none",
            background: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("list")}
        >
          List
        </button>
        <button
          style={{
            width: "150px",
            padding: "12px",
            textAlign: "center",
            fontWeight: activeTab === "map" ? "bold" : "normal",
            borderBottom: activeTab === "map" ? "3px solid black" : "none",
            background: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => {
            setActiveTab("map");
            router.push(`/map?lat=${userLocation.lat}&lng=${userLocation.lng}`);
          }}
        >
          Map
        </button>
      </div>

      {/* Scrollable Card Container */}
      <div className="cards-container">
        {loading ? (
          <div className="loading-container">Loading nearby restaurants...</div>
        ) : error ? (
          <div className="error-container">{error}</div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="no-results">
            No restaurants found. Try a different search.
          </div>
        ) : (

          filteredRestaurants.map((restaurant) => {
            const formattedName = restaurant.name
            .replace(/\./g, ""); 
            const logoPath = `/images/logos/${formattedName}.png`;
            const fallbackLogo = "/images/logos/Default.png"; 

            return (
              <div
                key={restaurant.place_id}
                onClick={() => handleCardClick(restaurant)}
                className="card-link"
              >
                <Card
                  backgroundImage={
                    restaurant.photo
                      ? restaurant.photo
                      : defaultImage
                  }
                  logoImage={logoPath} // ✅ Dynamically set the logo
                  text={restaurant.name}
                />
              </div>
            );
          })

        )}
      </div>
    </div>
  );
}
