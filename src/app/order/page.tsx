"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import doordashLogo from "@/public/images/doordash-logo.png";
import "./page.css";

export default function OrderPage() {
  const [status, setStatus] = useState<"loading" | "success">("loading");
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemName = searchParams.get("name") || "your item";
  const imageUrl = searchParams.get("image") || "/images/Default.png";

  // Set up the progress bar and success state transition
  useEffect(() => {
    if (status === "loading") {
      // Set first progress update - 25%
      const timer1 = setTimeout(() => {
        setProgress(25);
      }, 1000);

      // Set second progress update - 65%
      const timer2 = setTimeout(() => {
        setProgress(65);
      }, 2500);

      // Set third progress update - 100%
      const timer3 = setTimeout(() => {
        setProgress(100);
      }, 4000);

      // Set success state
      const timer4 = setTimeout(() => {
        setStatus("success");
      }, 5000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [status]);

  // Return to previous page
  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="order-page">
      <div className="order-container">
        <div className="order-header">
          <button className="back-button" onClick={handleBackClick}>
            <FaArrowLeft /> Back
          </button>
          <h1>Your Order</h1>
        </div>

        <div className="order-content">
          <div className="order-image-container">
            <Image
              src={imageUrl}
              alt={itemName}
              width={200}
              height={200}
              className="order-item-image"
            />
          </div>

          {status === "loading" ? (
            <div className="order-loading">
              <div className="order-doordash">
                <Image
                  src={doordashLogo}
                  alt="DoorDash"
                  width={150}
                  height={45}
                />
                <h2>Ordering from DoorDash...</h2>

                {/* Progress bar instead of spinner */}
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="progress-text">{progress}% complete</p>
              </div>
            </div>
          ) : (
            <div className="order-success">
              <FaCheckCircle size={80} color="#00C851" />
              <h2>Order Successful!</h2>
              <p className="order-message">
                Your order for <strong>{itemName}</strong> has been placed.
              </p>
              <p>Thank you for your purchase!</p>
              <button className="return-button" onClick={handleBackClick}>
                Return to Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
