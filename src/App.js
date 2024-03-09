import React, { useState, useEffect } from 'react';
import axios from 'axios';
import gsap from 'gsap';

const App = () => {
  const [shopItems, setShopItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    axios
      .get("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/shoes.json")
      .then((res) => {
        setShopItems(res.data.shoes);
      });
  }, []);

  const addToCart = (item) => {
    if (!item.inCart) {
      item.inCart = true;
      const newItem = { ...item, count: 1 };
      setCartItems([...cartItems, newItem]);

      const animationTarget = document.getElementById(`addButton${item.id}`);
      gsap.to(animationTarget, {
        width: 46,
        duration: 0.8,
        ease: "power4"
      });
    }
    setTimeout(() => {
      document.getElementById('cartItems').scrollTop = document.getElementById('cartItems').scrollHeight;
    });
  };

  const decrement = (item) => {
    item.count--;
    const targetShopItem = shopItems.find(shopItem => shopItem.id === item.id);
    if (item.count === 0) {
      const animationTarget = document.getElementById(`addButton${targetShopItem.id}`);
      gsap.to(animationTarget, {
        width: 136,
        duration: 0.8,
        ease: "power4"
      });
      targetShopItem.inCart = false;
      const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
      setCartItems(updatedCartItems);
    }
  };

  const increment = (item) => {
    item.count++;
  };

  return (
    <div className="wrapper">
      <div className="screen -left">
        <div className="app-bar">
          <img className="logo" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/pngwave.png" alt="logo" />
        </div>
        <div className="title">Picked items</div>
        <div className="shop-items">
          {shopItems.map(item => (
            <div key={item.id} className="item-block">
              <div className="image-area" style={{ backgroundColor: item.color }}>
                <img className="image" src={item.image} alt={item.name} />
              </div>
              <div className="name">{item.name}</div>
              <div className="description">{item.description}</div>
              <div className="bottom-area">
                <div className="price">${item.price}</div>
                <div className={`button ${item.inCart ? '-active' : ''}`} onClick={() => addToCart(item)} ref={`addButton${item.id}`}>
                  {!item.inCart ? 'ADD TO CART' : <div className="cover"><div className="check"></div></div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="screen -right" id="cartItems">
        <div className="app-bar">
          <img className="logo" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/pngwave.png" alt="logo" />
        </div>
        <div className="title">Your cart</div>
        {cartItems.length === 0 &&
          <div className="no-content">
            <p className="text">Your cart is empty.</p>
          </div>
        }
        <div className="cart-items">
          {cartItems.map(item => (
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
                  <div className="button" onClick={() => decrement(item)}>&lt;</div>
                  <div className="number">{item.count}</div>
                  <div className="button" onClick={() => increment(item)}>&gt;</div>
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
