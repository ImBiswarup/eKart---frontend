import React, { useState } from "react";
import { FaRegUser, FaBars, FaShoppingCart, FaSearch, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Cart_Sidebar from "./Cart_Sidebar";
import UserAuthModal from "./UserAuthModal";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { userData, isModalOpen, setIsModalOpen, user } = useAppContext();

    const navigate = useNavigate();
    const location = useLocation();
    const isOnProfilePage = location.pathname.includes("/u");

    const handleProfileClick = () => {
        if (userData) {
            navigate(`/u/${userData.id}`);
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link to="/" className="flex items-center text-xl font-semibold">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-8 h-8 text-white p-1 bg-indigo-500 rounded-full"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="ml-3">eKart</span>
                </Link>

                <div
                    className={`${isOnProfilePage ? "hidden" : "hidden md:flex relative flex-grow max-w-md mx-4"
                        }`}
                >
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full py-2 pl-4 pr-10 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => console.log(searchTerm)}
                    >
                        <FaSearch className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    {!isOnProfilePage && (
                        <button
                            onClick={handleProfileClick}
                            className="hidden md:flex items-center bg-gray-800 py-2 px-4 rounded-full hover:bg-gray-700"
                        >
                            <FaRegUser className="mr-2" />
                            <span>{userData ? `${userData?.name}` : "Register"}</span>
                        </button>
                    )}

                    {/* Conditionally hide the cart icon when the user role is "Seller" */}
                    {!isOnProfilePage && userData?.role !== "Seller" && (
                        <button
                            onClick={() => setIsCartOpen(!isCartOpen)}
                            className="flex items-center text-white hover:text-gray-400"
                        >
                            <FaShoppingCart className="w-6 h-6" />
                        </button>
                    )}

                    <button
                        className={`md:hidden flex items-center text-xl p-2 focus:outline-none ${userData?.role !== "Seller" ? "" : "hidden"}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-gray-800 text-white p-4 space-y-4">
                    <button
                        onClick={handleProfileClick}
                        className="block w-full py-2 text-center bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                        {userData ? "Profile" : "Register"}
                    </button>
                    <button
                        onClick={() => setIsCartOpen(!isCartOpen)}
                        className="block w-full py-2 text-center bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                        Cart
                    </button>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full py-2 px-4 rounded-lg bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            )}

            {isModalOpen && <UserAuthModal setIsModalOpen={setIsModalOpen} />}
            {isCartOpen && (
                <Cart_Sidebar
                    isOpen={isCartOpen}
                    closeSidebar={() => setIsCartOpen(false)}
                    cartItems={userData?.userCart?.cart}
                />
            )}
        </header>
    );
};

export default Navbar;
