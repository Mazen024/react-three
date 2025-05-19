import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/Cart.module.css";
import { FaArrowLeft } from "react-icons/fa";

const initialCartItems = [
  {
    id: 1,
    title: "Samsung Galaxy A16 LTE",
    description: "6GB RAM, 128GB Storage, Black",
    image: "./Samsung Galaxy A16 LTE.jpg",
    price: 7399,
    originalPrice: 8070,
    discount: 8,
  },
  {
    id: 2,
    title: "Samsung Galaxy A55 5G",
    description: "8GB RAM, 128GB Storage, Iceblue",
    image: "./Samsung Galaxy A16 LTE.jpg",
    price: 20199,
    originalPrice: 23999,
    discount: 16,
  },
];

export default function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(
    initialCartItems.map((item) => ({ ...item, quantity: 1, selected: true }))
  );

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleSelect = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const total = cartItems.reduce(
    (acc, item) => (item.selected ? acc + item.price * item.quantity : acc),
    0
  );

  return (
    <div className={styles.cartContainer}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/home")}
      >
        <FaArrowLeft />
      </button>
      <h1 className={styles.heading}>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => {
          const discountedPrice = Math.round(item.price * item.quantity);
          const totalOriginal = item.originalPrice * item.quantity;

          return (
            <div key={item.id} className={styles.item}>
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelect(item.id)}
                className={styles.checkbox}
              />
              <img src={item.image} alt={item.title} className={styles.image} />
              <div className={styles.details}>
                <h2 className={styles.title}>{item.title}</h2>
                <p className={styles.desc}>{item.description}</p>
                <p className={styles.inStock}>In Stock - Free Delivery</p>
                <div className={styles.actions}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => decreaseQty(item.id)}
                  >
                    −
                  </button>
                  <span className={styles.qty}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => increaseQty(item.id)}
                  >
                    +
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className={styles.priceBox}>
                <p className={styles.discount}>-{item.discount}%</p>
                <p className={styles.price}>
                  EGP {discountedPrice.toLocaleString()}
                </p>
                <p className={styles.oldPrice}>
                  <s>EGP {totalOriginal.toLocaleString()}</s>
                </p>
              </div>
            </div>
          );
        })
      )}
      {cartItems.length > 0 && (
        <div className={styles.totalContainer}>
          <h2 className={styles.totalText}>
            Total: EGP {total.toLocaleString()}
          </h2>
          <button className={styles.checkoutBtn}>Checkout</button>
        </div>
      )}
    </div>
  );
}
