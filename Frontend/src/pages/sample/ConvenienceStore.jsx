import React, { useState } from "react";
import {
  Search,
  User,
  ShoppingCart,
  MapPin,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import styles from "./ConvenienceStore.module.scss";

const CATEGORIES = [
  { name: "Ready to Eat", icon: "🍱" },
  { name: "Drinks", icon: "🥤" },
  { name: "Snacks", icon: "🥨" },
  { name: "Personal Care", icon: "🧴" },
  { name: "Household", icon: "🧻" },
];

const READY_TO_EAT = [
  { id: 1, name: "Spicy Basil Chicken with Rice", price: 65, tag: "Best Seller", image: "https://placehold.co/150x150/f8f9fa/008061?text=Chicken+Rice" },
  { id: 2, name: "Ham Cheese Sandwich", price: 45, image: "https://placehold.co/150x150/f8f9fa/008061?text=Sandwich" },
  { id: 3, name: "Tuna Mayo Onigiri", price: 35, image: "https://placehold.co/150x150/f8f9fa/008061?text=Onigiri" },
  { id: 4, name: "Minced Pork Cup Noodles", price: 25, image: "https://placehold.co/150x150/f8f9fa/008061?text=Noodles" },
];

const BEST_SELLERS = [
  { id: 5, name: "All Cafe Iced Latte 22oz", price: 55, image: "https://placehold.co/150x150/f8f9fa/008061?text=Iced+Latte" },
  { id: 6, name: "Classic Potato Chips", price: 30, image: "https://placehold.co/150x150/f8f9fa/008061?text=Chips" },
  { id: 7, name: "Honey Green Tea 500ml", price: 35, image: "https://placehold.co/150x150/f8f9fa/008061?text=Green+Tea" },
  { id: 8, name: "Spicy Cheese Curls", price: 28, image: "https://placehold.co/150x150/f8f9fa/008061?text=Cheese+Curls" },
];

export default function ConvenienceStore() {
  const [cartItems, setCartItems] = useState([
    { ...READY_TO_EAT[0], quantity: 1 },
    { ...READY_TO_EAT[1], quantity: 2 },
    { ...READY_TO_EAT[2], quantity: 2 },
    { ...BEST_SELLERS[0], quantity: 1 },
    { ...BEST_SELLERS[2], quantity: 2 },
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 35;
  const total = subtotal + deliveryFee;

  return (
    <div className={styles.odaplaceStore}>

      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <div className={styles.logo}>
            <span className={styles.logoAccent}>Oda</span>Mart
          </div>

          <div className={styles.location}>
            <MapPin size={18} className={styles.iconGreen} />
            <div className={styles.locText}>
              <span className={styles.label}>Deliver to</span>
              <span className={styles.value}>
                Current Location <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </div>

        <div className={styles.searchBar}>
          <input type="text" placeholder="Search for products..." />
          <Search size={20} className={styles.searchIcon} />
        </div>

        <div className={styles.navRight}>
          <button className={styles.navBtn}>
            <User size={20} />
            Sign in
          </button>

          <button className={styles.navBtn}>
            <ShoppingCart size={20} />
            Cart ({cartItems.length})
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div className={styles.mainContainer}>
        <div className={styles.contentLeft}>

          {/* HERO */}
          <div className={styles.heroBanner}>
            <div className={styles.heroContent}>
              <h1>Craving something?<br />We deliver fast!</h1>
              <button className={styles.btnPrimary}>Order Now</button>
            </div>
            <div className={styles.heroGraphics}>
              🍱🍔🥤 🛵
            </div>
          </div>

          {/* VALUE PROPS */}
          <div className={styles.valueProps}>
            <div className={styles.propItem}>🚚 Fast Delivery</div>
            <div className={styles.propItem}>📦 Wide Selection</div>
            <div className={styles.propItem}>💳 Secure Payment</div>
          </div>

          {/* CATEGORIES */}
          <section className={styles.sectionCategories}>
            <h2>Shop by Category</h2>
            <div className={styles.categoryList}>
              {CATEGORIES.map((cat, i) => (
                <div key={i} className={styles.categoryCard}>
                  <div className={styles.iconCircle}>{cat.icon}</div>
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* READY TO EAT */}
          <section className={styles.productSection}>
            <h2>Ready to Eat</h2>
            <div className={styles.productGrid}>
              {READY_TO_EAT.map((p) => (
                <div key={p.id} className={styles.productCard}>
                  {p.tag && <span className={styles.tag}>{p.tag}</span>}
                  <img src={p.image} className={styles.productImg} />
                  <h3 className={styles.productTitle}>{p.name}</h3>
                  <div className={styles.productBottom}>
                    <span>₱{p.price}</span>
                    <button className={styles.btnAdd}>
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* CART */}
        <aside className={styles.cartSidebar}>
          <h2>Cart ({cartItems.length})</h2>

          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.image} />
                <div>
                  <h4>{item.name}</h4>
                  <span>₱{item.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <p>Subtotal: ₱{subtotal}</p>
            <p>Delivery: ₱{deliveryFee}</p>
            <h3>Total: ₱{total}</h3>
            <button className={styles.btnCheckout}>Checkout</button>
          </div>
        </aside>
      </div>
    </div>
  );
}