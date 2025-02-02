import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const TrackingPage = () => {
    const trackingData = {
        orderId: "123456789",
        estimatedDelivery: "January 25, 2025",
        currentStatus: "In Transit",
        steps: [
            { label: "Order Placed", date: "January 15, 2025", completed: true },
            { label: "Order Confirmed", date: "January 16, 2025", completed: true },
            { label: "Dispatched", date: "January 17, 2025", completed: true },
            { label: "In Transit", date: "January 18, 2025", completed: true },
            { label: "Out for Delivery", date: null, completed: false },
            { label: "Delivered", date: null, completed: false },
        ],
    };

    const { userData, cartItems, user } = useAppContext();
    useEffect(() => {
        console.log("user object : ", user);
        console.log("user details: ", userData?.userCart);
        console.log("user cart data: ", cartItems);
    }, [userData]);
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-20">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Track Your Order</h1>
                <p className="text-lg font-bold text-gray-500">Order ID: {trackingData.orderId}</p>
                <p className="text-lg text-gray-500">Estimated Delivery: {trackingData.estimatedDelivery}</p>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Status</h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                            {trackingData.currentStatus}
                        </span>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Progress</h2>
                    <div className="relative">
                        <div className="absolute w-1 h-full bg-gray-200 left-8 transform -translate-x-1/2"></div>
                        {trackingData.steps.map((step, index) => (
                            <div key={index} className="flex items-start mb-8">
                                <div
                                    className={`flex items-center justify-center w-6 h-6 rounded-full ${step.completed ? "bg-blue-500" : "bg-gray-300"
                                        }`}
                                >
                                    {step.completed && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-700">{step.label}</p>
                                    {step.date && (
                                        <p className="text-xs text-gray-500">{step.date}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;
