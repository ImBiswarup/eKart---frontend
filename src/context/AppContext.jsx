import React, { createContext, useContext, useEffect, useState } from 'react';
export const Appcontext = createContext();
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
const AppContext = ({ children }) => {
  const [user, setUser] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState('')
  const [quantity, setQuantity] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [itemQuantity, setItemQuantity] = useState(1)
  const [selectedItem, setSelectedItem] = useState([])
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [sellerProducts, setsellerProducts] = useState([])
  const [loading, setLoading] = useState(true);
  const [actulaUser, setActulaUser] = useState([])
  const [role, setRole] = useState('Customer');
  const [currentScreen, setCurrentScreen] = useState("signup");
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [description, setdescription] = useState('');

  const apiUrl = process.env.PRODUCTION_API_URL;


  const fetchUserData = async () => {
    const token = Cookies.get('token');
    if (!token) {
      console.log('no token');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUserData(decoded);
    } catch (error) {
      console.error("Error decoding token:", error);
      Cookies.remove('token');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/user/login`, {
        email,
        password,
      });
      Cookies.set('token', response.data.user.token);
      setUser(response.data);
      setIsModalOpen(false);
      alert(`Welcome ${response.data.user.username}`);
      fetchUserData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      alert(errorMessage);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [window.location.pathname]);


  const handleSignup = async (username, email, password, role, imageUrl) => {
    try {
      const response = await axios.post(`${apiUrl}/api/user/signup`, {
        username,
        email,
        password,
        role,
        image: imageUrl,
      });
      console.log("Signup response:", response.data);
      alert("Signup successful!");
      setCurrentScreen("login");
    } catch (error) {
      console.error("Error during signup:", error);
      alert(`Signup failed: ${error.response?.data?.message || error.message}`);
    }
  };


  const handleLogout = async () => {
    const token = Cookies.get('token');
    console.log('Token during logout:', token);

    if (!token) {
      console.warn('No token found during logout.');
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/api/user/logout`,
        {}, // No request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Cookies.remove('token');
      setUser(null);
      setUserData(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const addToCart = async () => {
    try {
      const token = Cookies.get('token');
      // console.log('selectedItem: ', selectedItem);
      const response = await axios.post(
        `${apiUrl}/api/user/add-to-cart`,
        {
          itemQuantity,
          cartItem: selectedItem,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Response:', response.data);
      // alert(`${response.data.message}`);
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      if (error.response) {
        console.error('Server Error:', error.response.data.message);
      }
    }
  };

  const RemoveFromCart = async (cartItemId) => {
    if (!cartItemId) {
      console.error("cartItemId is missing.");
      return alert("Unable to remove item from the cart. Please try again.");
    }

    try {
      const token = Cookies.get("token");

      const response = await axios.post(
        `${apiUrl}/api/user/remove-from-cart`,
        { cartItemId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Cart after removing the item:", response.data.cart);

      // Update the state with the updated cart from the server
      if (response?.data?.cart) {
        setCartItems(response.data.cart); // Update cart state with server response
      } else {
        console.error("No updated cart received from the server.");
        alert("Something went wrong. Please refresh the page and try again.");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error.message);

      // Roll back UI changes
      setCartItems(cartItems);

      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        window.location.href = "/";
      } else {
        alert("Failed to remove the item from the cart. Please try again.");
      }
    }
  };



  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user/allItems`);
        // console.log("All items: ", response.data);
        setAllItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error.message);
      }
    };

    fetchItems();
  }, [userData]);

  const addItems = async (name,
    price,
    imageUrl,
    category,
    quantity,
    description) => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        console.error("No token found. Cannot authorize the request.");
        return;
      }

      const response = await axios.post(
        `${apiUrl}/api/item/add-items`,
        {
          name,
          price,
          imageUrl,
          category,
          quantity,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Item added successfully:", response.data);
    } catch (error) {
      console.error("Error adding item:", error.response?.data || error.message);
    }
  };


  const getActualUser = async (userId) => {
    try {
      const res = await axios.get(`${apiUrl}/api/user/user/${userId}`);
      // console.log("userId: ", userId);
      // console.log("response from the api endpoint: ", res.data);
      setUserData(res.data);
      setsellerProducts(res.data?.addedItems)
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const fetchUserCart = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      const res = await axios.get(`${apiUrl}/api/user/getItem`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Cart Items: ", res.data);

      setCartItems(res.data?.cart);
    } catch (error) {
      console.error("Error fetching cart items:", error?.response?.data || error.message);
    }
  };



  return (
    <Appcontext.Provider value={{
      user, setUser,
      username, setUsername,
      email, setEmail,
      password, setPassword,
      image, setImage,
      handleLogin, handleSignup,
      isModalOpen, setIsModalOpen,
      quantity, setQuantity,
      userData, setUserData,
      currentScreen, setCurrentScreen,
      handleLogout,
      itemQuantity, setItemQuantity,
      addToCart, RemoveFromCart,
      selectedItem, setSelectedItem,
      suggestedItems, setSuggestedItems,
      allItems, setAllItems,
      cartItems, setCartItems,
      sellerProducts, setsellerProducts,
      wishlistItems, setWishlistItems, fetchUserCart,
      role, setRole,
      name, setName,
      price, setPrice,
      imageUrl, setImageUrl,
      category, setCategory,
      description, setdescription,
      addItems, getActualUser
    }}>
      {children}
    </Appcontext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(Appcontext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppContext Provider");
  }

  return context;
};

export default AppContext;
