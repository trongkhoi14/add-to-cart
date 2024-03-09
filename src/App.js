import React, { useState, useEffect } from "react";
// import axios from "axios";
import gsap from "gsap";
import "./App.css";

const App = () => {
  const [shopItems, setShopItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Retrieve cart items from localStorage when the component mounts

    // axios
    //   .get("/api/v1/products")
    //   .then((res) => {
    //     setShopItems(res.data.shoes);
    //   });
    fetch("/data/shoes.json")
      .then((response) => response.json())
      .then((data) => {
        const updatedShopItems = data.shoes.map((item) => {
          const inCart = storedCartItems ? storedCartItems.some((cartItem) => cartItem.id === item.id) : false;
          return { ...item, inCart };
        });
        setShopItems(updatedShopItems); 

        updatedShopItems.forEach((item) => {
          if (item.inCart) {
            const animationTarget = document.getElementById(`addButton${item.id}`);
            gsap.to(animationTarget, {
              width: 46,
              duration: 0.2,
              ease: "power4",
            });
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, []);

  const addToCart = (item) => {
    if (!item.inCart) {
      item.inCart = true;
      const newItem = { ...item, count: 1 };
      setCartItems([...cartItems, newItem]);

      // Save updated cart items to localStorage
      localStorage.setItem(
        "cartItems",
        JSON.stringify([...cartItems, newItem])
      );

      const animationTarget = document.getElementById(`addButton${item.id}`);
      gsap.to(animationTarget, {
        width: 46,
        duration: 1,
        ease: "power4",
      });
    }
    setTimeout(() => {
      document.getElementById("cartItems").scrollTop =
        document.getElementById("cartItems").scrollHeight;
    });
  };

  const decrement = (item) => {
    const updatedCartItems = cartItems
      .map((cartItem) => {
        if (cartItem.id === item.id) {
          const newCount = cartItem.count - 1;
          if (newCount === 0) {
            const animationTarget = document.getElementById(
              `addButton${item.id}`
            );
            gsap.to(animationTarget, {
              width: 131,
              duration: 1,
              ease: "power4",
            });
            const updatedShopItems = shopItems.map((shopItem) => {
              if (shopItem.id === item.id) {
                return { ...shopItem, inCart: false };
              }
              return shopItem;
            });
            setShopItems(updatedShopItems);
            return null;
          }
          return { ...cartItem, count: newCount };
        }
        return cartItem;
      })
      .filter(Boolean);
    setCartItems(updatedCartItems);
    // Update cart items in localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const increment = (item) => {
    const updatedCartItems = cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, count: cartItem.count + 1 };
      }
      return cartItem;
    });
    setCartItems(updatedCartItems);
    // Update cart items in localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const removeFromCart = (item) => {
    const animationTarget = document.getElementById(`addButton${item.id}`);
    gsap.to(animationTarget, {
      width: 131,
      duration: 1,
      ease: "power4",
    });
    const updatedShopItems = shopItems.map((shopItem) => {
      if (shopItem.id === item.id) {
        return { ...shopItem, inCart: false };
      }
      return shopItem;
    });
    setShopItems(updatedShopItems);

    const updatedCartItems = cartItems.filter(
      (cartItem) => cartItem.id !== item.id
    );
    setCartItems(updatedCartItems);
    // Update cart items in localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.count;
  }, 0);

  return (
    <div className="wrapper">
      <div className="screen">
        <div className="app-bar">
          <img className="logo" src="/img/nike.png" alt="logo" />
        </div>
        <div className="title">Our Products</div>
        <div className="shop-items">
          {shopItems.map((item) => (
            <div key={item.id} className="item">
              <div className="item-block">
                <div
                  className="image-area"
                  style={{ backgroundColor: item.color }}
                >
                  <img className="image" src={item.image} alt={item.name} />
                </div>
                <div className="name">{item.name}</div>
                <div className="description">{item.description}</div>
                <div className="bottom-area">
                  <div className="price">${item.price}</div>
                  <div
                    className={`button ${item.inCart ? "-active" : ""}`}
                    onClick={() => addToCart(item)}
                    id={`addButton${item.id}`}
                  >
                    {!item.inCart ? (
                      "ADD TO CART"
                    ) : (
                      <div className="cover">
                        <div className="check"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="screen" id="cartItems">
        <div className="app-bar">
          <img
            className="logo"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/pngwave.png"
            alt="logo"
          />
        </div>
        <div className="title-container">
          <div className="cart-title">Your cart</div>
          <div className="total-price">${totalPrice.toFixed(2)}</div>
        </div>
        {cartItems.length === 0 && (
          <div className="no-content">
            <p className="text">Your cart is empty.</p>
          </div>
        )}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="left">
                <div className="cart-image">
                  <div className="image-wrapper">
                    <img className="image" src={item.image} alt={item.name} />
                  </div>
                </div>
              </div>
              <div className="right">
                <div className="name">{item.name}</div>
                <div className="price">${item.price}</div>
                <div className="count">
                  <div className="button" onClick={() => decrement(item)}>
                    -
                  </div>
                  <div className="number">{item.count}</div>
                  <div className="button" onClick={() => increment(item)}>
                    +
                  </div>
                  <div
                    className="button yellow-button"
                    onClick={() => removeFromCart(item)}
                  >
                    <img src="/img/trash.png" className="trash" alt="Remove" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
