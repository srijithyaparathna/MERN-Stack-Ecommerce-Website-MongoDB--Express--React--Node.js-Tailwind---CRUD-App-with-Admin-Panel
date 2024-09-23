import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import initialProducts from "../assets/all_products"; // Assuming you have some initial local data

// Function to initialize the cart with all products having 0 quantity
const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300; index++) {
    cart[index] = 0;
  }
  return cart;
};

// Create the ShopContext
export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [allProducts, setAllProducts] = useState(initialProducts);

  // Fetch products and cart on mount
  useEffect(() => {
    let isMounted = true; // Flag to handle component unmount during async operations

    // Fetch all products
    fetch("http://localhost:5000/allproducts")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) setAllProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));

    // Check for auth token and fetch cart items if token exists
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch("http://localhost:5000/getcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Sending an empty body
      })
        .then((response) => response.json())
        .then((data) => {
          if (isMounted) setCartItems(data);
        })
        .catch((error) => console.error("Error fetching cart:", error));
    }

    // Cleanup function to avoid setting state on unmounted component
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures it runs only once on component mount

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:5000/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max(prev[itemId] - 1, 0),
    }));

    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:5000/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    }
  };

  // Function to calculate total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = allProducts.find(
          (product) => product.id === Number(item)
        );
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // Function to calculate total cart items
  const getTotalCartItems = () => {
    let totalItems = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItems += cartItems[item];
      }
    }
    return totalItems;
  };

  // Provide all context values to child components
  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

// Define prop types for ShopContextProvider
ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
