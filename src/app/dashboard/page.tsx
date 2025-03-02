"use client";

import React, { useState } from "react";
import { Input } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Card from "../../components/card"; // adjust path if necessary
import "./page.css";

// Import local images from /src/app/images
import mcdBanner from "@/public/images/mcdonalds-banner.jpeg";
import mcdLogo from "@/public/images/mcdonalds-logo.png";

export default function SimpleSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  return (
    <div className="page-container">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <Input
            variant="unstyled"
            placeholder="Enter a restaurant..."
            value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Toggle Container */}
      <div className="toggle-container">
        <button
          className="toggle-button active"
          onClick={() => router.push("/dashboard")}
          style={{ color: "white" }}
        >
          List View
        </button>
        <button
          className="toggle-button"
          onClick={() => router.push("/map")}
          style={{ color: "black" }}
        >
          Map View
        </button>
      </div>

      {/* Scrollable Card Container */}
      <div className="cards-container">
        <Card
          backgroundImage={mcdBanner}
          logoImage={mcdLogo}
          text="McDonalds - College Park"
        />
        <Card
          backgroundImage="https://placehold.co/600x150"
          logoImage="https://placehold.co/64"
          text="Restaurant Card 2"
        />
        <Card
          backgroundImage="https://placehold.co/600x150"
          logoImage="https://placehold.co/64"
          text="Restaurant Card 3"
        />
        <Card
          backgroundImage="https://placehold.co/600x150"
          logoImage="https://placehold.co/64"
          text="Restaurant Card 4"
        />
        <Card
          backgroundImage="https://placehold.co/600x150"
          logoImage="https://placehold.co/64"
          text="Restaurant Card 5"
        />
        <Card
          backgroundImage="https://placehold.co/600x150"
          logoImage="https://placehold.co/64"
          text="Restaurant Card 6"
        />
      </div>
    </div>
  );
}
