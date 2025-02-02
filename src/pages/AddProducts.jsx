import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const AddProducts = () => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        name, setName, price, setPrice, imageUrl, setImageUrl,
        category, setCategory, quantity, setQuantity,
        description, setdescription, addItems, userData
    } = useAppContext();

    const categories = [
        "Electronics",
        "Clothing",
        "Home Appliances",
        "Books",
        "Toys",
        "Other",
    ];

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "eKart - eCom app");

        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/djrdw0sqz/image/upload", formData);
            return response.data.secure_url;
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            alert("Failed to upload image. Please try again.");
        }
    };

    const addProduct = async (e) => {
        e.preventDefault();

        if (!name || !price || !category || !description || !imageUrl) {
            alert("Please fill all required fields!");
            return;
        }

        setIsLoading(true);

        try {
            const uploadedImageUrl = await uploadImageToCloudinary(imageUrl);
            if (!uploadedImageUrl) return;

            await addItems(name, price, uploadedImageUrl, category, quantity, description);

            alert("Product added successfully!");
            // Clear fields after successful submission
            setName("");
            setPrice("");
            setImageUrl(null);
            setCategory("");
            setQuantity(1);
            setdescription("");
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return userData?.role === "Seller" ? (
        <div className="mt-20 text-black container mx-auto max-w-2xl p-4 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Add Product</h1>
            <form onSubmit={addProduct} className="space-y-4">
                <div>
                    <label className="block font-semibold">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border px-4 py-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="border px-4 py-2 w-full"
                        min="0"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Image:</label>
                    <input
                        type="file"
                        onChange={(e) => setImageUrl(e.target.files[0])}
                        required
                        className="border px-4 py-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Item Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="border px-4 py-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Category:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="border px-4 py-2 w-full"
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block font-semibold">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setdescription(e.target.value)}
                        required
                        className="border px-4 py-2 w-full"
                        maxLength="500"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 ${!name || !price || !category || !description || !imageUrl ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!name || !price || !category || !description || !imageUrl || isLoading}
                >
                    {isLoading ? "Adding Product..." : "Add Product"}
                </button>
            </form>

            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="loader border-t-4 border-b-4 border-blue-500 h-12 w-12 rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    ) : (
        <div className="flex items-center justify-center ">
            <p className="text-3xl text-center">You are not authorized to access the content of this page...</p>
        </div>
    );
};

export default AddProducts;
