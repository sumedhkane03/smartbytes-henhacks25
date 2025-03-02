"use client";

import React, { useState } from "react";
import { Input } from "@chakra-ui/input";
import { useRouter } from "next/navigation";
import Card from "../../components/card"; // adjust path if necessary
import "./page.css";

// Import local images from /src/app/images
import mcdBanner from "../images/mcdonalds-banner.jpeg";
import mcdLogo from "../images/mcdonalds-logo.png";

export default function SimpleSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
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
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => {
            setActiveTab("list");
            router.push("/dashboard");
          }}
        >
          List View
        </button>
        <button
          style={{
            flex: 1,
            padding: "12px",
            textAlign: "center",
            fontWeight: activeTab === "map" ? "bold" : "normal",
            borderBottom: activeTab === "map" ? "3px solid black" : "none",
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => {
            setActiveTab("map");
            router.push("/map");
          }}
        >
          Map View
        </button>
      </div>
    </div>
  );
}
