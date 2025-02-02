import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const UserAuthModal = ({ setIsModalOpen }) => {
    const {
        user, setUser,
        username, setUsername,
        email, setEmail,
        password, setPassword,
        image, setImage,
        role, setRole,
        handleLogin, handleSignup,
        currentScreen, setCurrentScreen,
        uploadedImageUrl, setUploadedImageUrl,

    } = useAppContext();

    const uploadUserImageToCloudinary = async (imageFile) => {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "eKart - eCom app"); // Replace with your actual preset

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/djrdw0sqz/image/upload",
                formData
            );
            return response.data.secure_url; // Return the secure URL of the uploaded image
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            return null; // Return null if the upload fails
        }
    };


    const handleUserSignup = async (e) => {
        e.preventDefault();

        if (!username || !email || !password || !image) {
            alert("Please fill all required fields!");
            return;
        }

        try {
            // Upload the user image to Cloudinary
            const uploadedImageUrl = await uploadUserImageToCloudinary(image);
            if (!uploadedImageUrl) {
                alert("Failed to upload image. Please try again.");
                return;
            }

            // Call the signup function with user details and uploaded image URL
            await handleSignup(username, email, password, role, uploadedImageUrl);
        } catch (error) {
            console.error("Error during signup:", error);
            alert("Signup failed. Please try again.");
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {currentScreen === "signup" ? "Sign Up" : "Log In"}
                    </h3>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <svg
                            className="w-3 h-3"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                            aria-hidden="true"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="p-4">
                    {currentScreen === "signup" ? (
                        <form onSubmit={handleUserSignup} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="bg-gray-50 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-gray-50 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-gray-50 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="isSeller"
                                    className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    <input
                                        type="checkbox"
                                        id="isSeller"
                                        checked={role === "Seller"}
                                        onChange={(e) => setRole(e.target.checked ? "Seller" : "Customer")}
                                        className="mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800 dark:border-gray-700"
                                    />
                                    Are you a seller?
                                </label>
                            </div>
                            <div>
                                <label
                                    htmlFor="image"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    id="userImage"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    required
                                    className="bg-gray-50 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Sign Up
                            </button>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setCurrentScreen("login")}
                                    className="text-blue-600 dark:text-blue-400 underline"
                                >
                                    Log In
                                </button>
                            </p>
                        </form>
                    ) : (
                        // Existing login form remains unchanged
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-gray-50 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-gray-50 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Log In
                            </button>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setCurrentScreen("signup")}
                                    className="text-blue-600 dark:text-blue-400 underline"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserAuthModal;
