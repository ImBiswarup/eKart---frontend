import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
// import Cookies from "js-cookie";
// import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const ProfilePage = () => {
  const [addedItems, setAddedItems] = useState([])
  const [cartItemName, setCartItemName] = useState([])
  const [cartItemQuantity, setCartItemQuantity] = useState([])
  const [cartItemPrice, setCartItemPrice] = useState([])
  const [cartAmount, setCartAmount] = useState([])

  const navigate = useNavigate()
  const { userId } = useParams();
  const { userData, handleLogout, allItems, cartItems, setCartItems,
    wishlistItems, setWishlistItems, fetchUserCart, loading, setLoading, RemoveFromCart, selectedItem, sellerProducts, setsellerProducts, getUserDetails, getActualUser } = useAppContext();

  useEffect(() => {
    if (cartItems.length > 0) {
      setCartItemQuantity(cartItems.map(item => item.item.quantity));
      setCartItemName(cartItems.map(item => item.item.name));
      setCartItemPrice(cartItems.map(item => item.item.price));
      setCartAmount(cartItems?.reduce((total, item) => total + item.item.price * item.quantity, 0).toFixed(2))
    }
  }, [cartItems]);


  // console.log("Item name:", cartItems.map(item => item.item.name));
  // console.log("Item quantity:", cartItemQuantity);
  // console.log("Item price:", cartItemPrice);
  // console.log('Final amount to be paid : ', cartAmount);
  // console.log('cart item name : ', cartItemName);
  // console.log('cart items : ', cartItems.map(item => item.item));
  useEffect(() => {
    if (userId) {
      getActualUser(userId);
      fetchUserCart();
    }
  }, [cartItems]);

  const userAddedItems = allItems?.filter((item) =>
    userData?.addedItems?.includes(item?._id)
  );
  if (!userData || loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="lg:w-1/4 bg-gray-800 text-white p-6 lg:block hidden">
        <div className="text-center mb-8">
          <img
            src={userData.image || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full mx-auto"
          />
          <h2 className="mt-4 text-xl font-semibold">{userData.username}</h2>
        </div>
        <ul className="space-y-4">
          <li>
            <button className="w-full text-left py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md">
              Update Info
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 px-4 bg-gray-700 hover:bg-red-600 rounded-md"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="lg:w-3/4 p-8 space-y-8">
        {/* Profile Information */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Profile Information</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <p className="font-medium text-gray-700">Username:</p>
              <p>{userData.username}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-medium text-gray-700">Email:</p>
              <p>{userData.email}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-medium text-gray-700">Account Created:</p>
              <p>{new Date(userData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {
          userData?.role === "Customer" ? (
            <>
              {/* Shopping Cart */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Shopping Cart</h3>
                <div className="space-y-4">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex flex-col md:flex-row justify-between items-center border-b pb-4"
                      >
                        <Link to={`/${item.item.id}`} className="flex items-center space-x-4">
                          <img
                            src={item.item?.imageUrl || "https://via.placeholder.com/50"}
                            alt={item.item?.name || "Product Image"}
                            className="w-16 h-16 object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-700">{item.item?.name || "Unknown Item"}</p>
                            <p className="text-sm text-gray-500">
                              ${item.item?.price?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Quantity</p>
                            <p className="text-lg font-bold text-gray-500">
                              {item.quantity}
                            </p>
                          </div>
                        </Link>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                          <button
                            className="text-sm text-red-500 hover:text-red-700"
                            onClick={() => RemoveFromCart(item.item._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Your cart is empty.</p>
                  )}
                  <div className="container flex items-center justify-center">
                    <button>
                      <Link to="/item/checkout" className={`text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md ${cartItems.length >= 1 ? "" : "hidden"}`}>
                        Buy Now
                      </Link>
                    </button>
                  </div>
                </div>
              </div>

              {/* Wishlist */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Wishlist</h3>
                <div className="space-y-4">
                  {wishlistItems.length > 0 ? (
                    wishlistItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex flex-col md:flex-row justify-between items-center border-b pb-4"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item?.imageUrl || "https://via.placeholder.com/50"}
                            alt={item?.name || "Wishlist Item"}
                            className="w-16 h-16 object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-700">{item?.name || "Unknown Item"}</p>
                            <p className="text-sm text-gray-500">
                              ${item?.price?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>
                        <button
                          className="text-sm text-red-500 hover:text-red-700 mt-4 md:mt-0"
                          onClick={() => RemoveFromWishlist(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Your wishlist is empty.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Seller Dashboard</h3>
              <div>
                <p className="mb-4">Welcome to your seller dashboard. Here you can manage your products and track sales.</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={() => navigate('/item/add')}
                >
                  Add New Product
                </button>
                <div className="mt-6">
                  <h4 className="text-xl font-semibold mb-2">Your Products</h4>
                  {userAddedItems?.length > 0 ? (
                    userAddedItems?.map((product) => (
                      <div
                        key={product._id}
                        className="flex justify-between items-center border-b py-2"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.imageUrl || "https://via.placeholder.com/50"}
                            alt={product.name || "Product Image"}
                            className="w-16 h-16 object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-700">{product.name || "Unknown Product"}</p>
                            <p className="text-sm text-gray-500">
                              ${product.price?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Quantity</p>
                            <p className="text-sm text-center text-gray-500">
                              {product?.quantity || "NIL"}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <button
                            className="text-sm text-red-500 hover:text-red-700"
                            onClick={() => removeProduct(product._id)}
                          >
                            Remove
                          </button>
                          <button className="text-sm text-blue-500 hover:text-blue-700">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>You have no products listed.</p>
                  )}
                </div>
              </div>
            </div>
          )
        }

      </div>
    </div >
  );
};

export default ProfilePage;
