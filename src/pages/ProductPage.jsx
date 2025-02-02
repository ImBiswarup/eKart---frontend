import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProductPage = () => {
  const { id } = useParams();
  const { itemQuantity, setItemQuantity, addToCart, selectedItem, setSelectedItem, suggestedItems, setSuggestedItems, userData, allItems,
  } = useAppContext();

  useEffect(() => {
    document.title = selectedItem ? `${selectedItem?.name}` : "eKart"
  }, [selectedItem]);

  useEffect(() => {
    setSelectedItem(allItems.find((item) => item._id === id));
    if (selectedItem) {
      const suggestions = allItems.filter((item) => item.category === selectedItem.category && item._id !== selectedItem._id);
      setSuggestedItems(suggestions);
    }
  }, [id, allItems, selectedItem]);

  if (!selectedItem) {
    return <div className="text-center text-gray-500 mt-10">Product not found</div>;
  }


  return (
    <div className="mx-auto p-5 bg-gray-900">
      <div className="md:flex bg-gray-100 p-5 rounded-lg shadow-lg">
        <div className="flex-1 flex flex-col items-center">
          <img
            src={selectedItem.imageUrl}
            alt={selectedItem.name}
            className="w-3/4 object-cover border border-gray-300 rounded-lg mb-4"
          />


          {/* additional images for product
          <div className="flex gap-2">
            {[...Array(4)].map((_, index) => (
              <img
                key={index}
                src={selectedProduct.imageUrl}
                alt={`Thumbnail ${index + 1}`}
                className="w-16 h-16 border border-gray-300 rounded-lg cursor-pointer hover:ring-2 hover:ring-indigo-500"
              />
            ))}
          </div> */}

        </div>
        <div className="flex-1 px-6">
          <h1 className="text-2xl font-semibold text-gray-800">{selectedItem.name}</h1>
          <p className="text-sm text-gray-500 mt-2">Category: {selectedItem.category}</p>
          <p className="text-lg text-gray-600 mt-4">{selectedItem.description}</p>
          <p className="text-3xl text-indigo-600 font-bold mt-6">${selectedItem.price}</p>
          <p className={`text-lg font-semibold mt-4 ${selectedItem.stock ? "text-green-500" : "text-red-500"}`}>
            {selectedItem?.quantity >= 1 ? "In Stock" : "Out of Stock"}
          </p>
        </div>

        <div className={`flex-1 p-5 rounded-lg shadow-md ${userData ? "" : "hidden"}`}>
          <p className="text-xl font-semibold mb-4">Purchase Options</p>
          <div className="flex items-center mb-4">
            <label htmlFor="quantity" className="mr-2">
              Quantity:
            </label>
            <select
              value={itemQuantity}
              id="quantity"
              className="border border-gray-300 rounded-md px-2 py-1"
              onChange={(e) => setItemQuantity(Number((e.target.value)))}
            >
              {[...Array(10)].map((_, index) => (
                <option key={index} value={index}>
                  {index}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={addToCart}
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 transition">
            Add to Cart
          </button>
          <Link to="/item/checkout">
            <button className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg mt-3 hover:bg-orange-600 transition">
              Buy Now
            </button>
          </Link>

        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-white mb-5">Suggested Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {suggestedItems.map((item) => (
            <Link to={`/${item._id}`} key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                <p className="text-lg text-indigo-600 font-bold mt-2">${item.price}</p>
                <button className="w-full mt-3 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div >
  );
};

export default ProductPage;
