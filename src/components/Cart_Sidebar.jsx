import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import UserAuthModal from "./UserAuthModal";
import { useAppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";



const Cart_Sidebar = ({ isOpen, closeSidebar }) => {
  // const { userId } = useParams();
  const { userData, fetchUserCart, cartItems, RemoveFromCart, getActualUser } = useAppContext();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserCart()
  }, [userData, cartItems])

  const userId = userData._id;
  useEffect(() => {
    if (userId) {
      getActualUser(userId);
      fetchUserCart();
    }
  }, [userId]);

  if (!userData) {
    return (
      <>
        {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 z-50 w-full sm:w-96 bg-gray-800 text-white h-full transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Please Sign In</h2>
            <button onClick={closeSidebar} className="text-2xl text-gray-400 hover:text-white">
              <FaTimes />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <p className="text-gray-400">You need to sign in to access your cart.</p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-indigo-600 px-6 py-2 rounded-md text-white hover:bg-indigo-700 transition"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Auth Modal */}
        {isAuthModalOpen && <UserAuthModal setIsModalOpen={setIsAuthModalOpen} />}
      </>
    );
  }

  return (
    <div
      className={`fixed top-0 right-0 z-50 w-full sm:w-96 bg-gray-900 text-white h-full transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <button onClick={closeSidebar} className="text-2xl text-gray-400 hover:text-white">
          <FaTimes />
        </button>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-2 overflow-y-auto h-[calc(100%-13rem)]">
        {cartItems?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center text-gray-400">Your cart is empty</p>
            <img
              src="https://via.placeholder.com/150"
              alt="Empty cart"
              className="mt-4 w-36"
            />
          </div>
        ) : (
          cartItems?.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between py-4 border-b border-gray-700"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.item.imageUrl || "https://via.placeholder.com/50"}
                  alt={item.item.name || "Unknown Item"}
                  className="w-16 h-16 object-cover rounded-md border border-gray-700"
                />
                <div>
                  <p onClick={() => { console.log(item.item.name) }} o className="font-medium text-gray-300">{item.item.name || "Unknown Item"}</p>
                  <p className="text-sm text-gray-500">
                    ${item.item.price?.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
              </div>
              <button
                className="text-sm text-red-500 hover:text-red-700"
                onClick={() => RemoveFromCart(item.item._id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-700 overflow-x-auto">
        <div className="flex justify-between items-center">
          <p className="text-lg">Total:</p>
          <p className="text-lg font-semibold">
            ${cartItems?.reduce((total, item) => total + item.item.price * item.quantity, 0).toFixed(2)}
          </p>
        </div>
        <button
          className="w-full py-3 mt-4 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition"
          onClick={() => {
            closeSidebar();
            navigate('/item/checkout');
          }}>
          Checkout
        </button>

      </div>
    </div>
  );
};

export default Cart_Sidebar;
