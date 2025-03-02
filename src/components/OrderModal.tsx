import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import doordashLogo from "@/public/images/doordash-logo.png";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemImage: string | StaticImageData;
}

export default function OrderModal({
  isOpen,
  onClose,
  itemName,
  itemImage,
}: OrderModalProps) {
  const [status, setStatus] = useState<"loading" | "success">("loading");

  // Reset status when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus("loading");
      // Set a timeout to change to success after 5 seconds
      const timer = setTimeout(() => {
        setStatus("success");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Your Order</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-image-container">
            <Image
              src={itemImage}
              alt={itemName}
              width={150}
              height={150}
              className="modal-item-image"
            />
          </div>

          {status === "loading" ? (
            <div className="modal-loading">
              <div className="modal-doordash">
                <Image
                  src={doordashLogo}
                  alt="DoorDash"
                  width={100}
                  height={30}
                />
                <p>Ordering from DoorDash...</p>
              </div>
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="modal-success">
              <FaCheckCircle size={60} color="#00C851" />
              <h3>Order Successful!</h3>
              <p>Your order for {itemName} has been placed.</p>
              <p>Thank you for your purchase!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
