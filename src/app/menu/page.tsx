import Image from "next/image";
import type { CSSProperties } from "react";
import burgerImage from "../images/burger.png";


const styles: { [key: string]: CSSProperties } = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "430px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  recommendedSection: {
    marginBottom: "30px",
  },
  recommendedTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  menuItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#00000",
  },
  itemInfo: {
    flex: "1",
  },
  itemName: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "0px",
  },
  itemCalories: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "10px",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "24px",
  },
  buyButton: {
    backgroundColor: "#6B8F80",
    border: "none",
    borderRadius: "20px",
    padding: "0px 16px",
    fontSize: "14px",
    color: "white",
    cursor: "pointer",
  },
  likeButton: {
    backgroundColor: "#ddd",
    border: "none",
    borderRadius: "20px",
    padding: "8px 16px",
    fontSize: "14px",
    cursor: "pointer",
  },
  itemImage: {
    borderRadius: "10px",
    overflow: "hidden",
  },
  sortBy: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: "20px",
    fontSize: "16px",
    color: "#333",
  },
  arrow: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  bottomNav: {
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e0e0e0",
    padding: "10px 0",
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "14px",
    color: "#666",
    textDecoration: "none",
    cursor: "pointer",
  },
  activeNavItem: {
    color: "#000",
    fontWeight: "bold",
  },
};

export default function ShakeShackMenu() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>Shake Shack</header>

      <section style={styles.recommendedSection}>
        <h2 style={styles.recommendedTitle}>Recommended for you</h2>

        {/* Menu Items */}
        <div style={styles.menuItem}>
          <div style={styles.itemInfo}>
            <h3 style={styles.itemName}>Double SmokeShack</h3>
            <p style={styles.itemCalories}>1,080 cal</p>
            <div style={styles.buttonRow}>
              <button style={styles.buyButton}>Buy</button>
              <button style={styles.likeButton}>I like this</button>
            </div>
          </div>
          <div style={styles.itemImage}>
            <Image src={burgerImage} alt="Double SmokeShack" width={100} height={100} />
          </div>
        </div>

        <div style={styles.menuItem}>
          <div style={styles.itemInfo}>
            <h3 style={styles.itemName}>Chicken Bites</h3>
            <p style={styles.itemCalories}>320 cal</p>
            <div style={styles.buttonRow}>
              <button style={styles.buyButton}>Buy</button>
              <button style={styles.likeButton}>I like this</button>
            </div>
          </div>
          <div style={styles.itemImage}>
            <Image src="/images/chicken.png" alt="Chicken Bites" width={100} height={100} />
          </div>
        </div>

        <div style={styles.menuItem}>
          <div style={styles.itemInfo}>
            <h3 style={styles.itemName}>Cheese Fries</h3>
            <p style={styles.itemCalories}>840 cal</p>
            <div style={styles.buttonRow}>
              <button style={styles.buyButton}>Buy</button>
              <button style={styles.likeButton}>I like this</button>
            </div>
          </div>
          <div style={styles.itemImage}>
            <Image src="/images/fries.png" alt="Cheese Fries" width={100} height={100} />
          </div>
        </div>
      </section>

      {/* Sort By */}
      <div style={styles.sortBy}>
        <span>Sort by</span>
        <span style={styles.arrow}>→</span>
      </div>

      {/* Bottom Navigation */}
      <nav style={styles.bottomNav}>
        <a href="#" style={styles.navItem}>
          Explore
        </a>
        <a href="#" style={{ ...styles.navItem, ...styles.activeNavItem }}>
          Favorites
        </a>
        <a href="#" style={styles.navItem}>
          Account
        </a>
      </nav>
    </div>
  );
}
