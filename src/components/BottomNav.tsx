import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaUtensils, FaList, FaShoppingCart } from "react-icons/fa";
import "./BottomNav.css";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (
      path === "/dashboard" &&
      (pathname === "/dashboard" || pathname === "/")
    ) {
      return true;
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="bottom-nav">
      <button
        className={`bottom-nav-item ${isActive("/dashboard") ? "active" : ""}`}
        onClick={() => router.push("/dashboard")}
        aria-label="Restaurants"
      >
        <FaUtensils className="bottom-nav-icon" />
      </button>

      <button
        className={`bottom-nav-item ${isActive("/menu") ? "active" : ""}`}
        onClick={() => router.push("/menu")}
        aria-label="Menu"
      >
        <FaList className="bottom-nav-icon" />
      </button>

      <button
        className={`bottom-nav-item ${isActive("/order") ? "active" : ""}`}
        onClick={() => router.push("/order")}
        aria-label="Order"
      >
        <FaShoppingCart className="bottom-nav-icon" />
      </button>
    </div>
  );
}
