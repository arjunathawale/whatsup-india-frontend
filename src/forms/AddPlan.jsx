import React, { useState } from 'react'
import { endPoints } from '../utils/apiEndPoint';
import axiosInstance from '../utils/axios';
import { useToast } from "../context/ToastContext";

const AddPlan = ({ setOpenForm, openForm, planData = {}, setPlanData, getData }) => {
    const showToast = useToast();
    const toggleDrawer = () => {
        setOpenForm(!openForm);
        setPlanData({});
    };

    const [formData, setFormData] = useState({
        price: planData?.price,
        currency: planData?.currency || "",
        name: planData?.name || "",
        planType: planData?.planType || "",
        description: planData?.description || "",
        bulkLimit: planData?.bulkLimit,
        externalMessageSendAPI: planData?.externalMessageSendAPI || false,
        chatBotFeature: planData?.chatBotFeature || false,
        isActive: planData?.isActive,
    });

    const planExpire = {
        FREE_TRIAL: 7,
        MONTHLY: 30,
        QUARTERLY: 90,
        YEARLY: 365
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (planData.id) {
                const response = await axiosInstance.put(
                    endPoints.plan + "/" + planData.id,
                    { ...formData, planExpireIn: planExpire[formData.planType] }
                )
                if (response.data.status) {
                    showToast("success", "Updated Successfully!");
                    toggleDrawer();
                } else {
                    showToast("error", response.data.message);
                }
            } else {
                if (
                    !formData.price ||
                    !formData.currency ||
                    !formData.name ||
                    !formData.planType ||
                    !formData.description ||
                    !formData.bulkLimit ||
                    !formData.externalMessageSendAPI,
                    !formData.chatBotFeature,
                    !formData.isActive
                ) {
                    showToast("info", "Please fill all the fields!");
                    return;
                }
                const response = await axiosInstance.post(
                    endPoints.plan,
                    { ...formData, planExpireIn: planExpire[formData.planType] }
                )
                if (response.data.status) {
                    showToast("success", "Created Successfully!");
                    toggleDrawer();
                } else {
                    showToast("error", response.data.message);
                }
            }
            getData();
        } catch (error) {
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }
    return (
        <div>

            {openForm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleDrawer}
                ></div>
            )}

            {/* Centered Drawer */}
            <div
                className={`fixed inset-0 flex items-center justify-center z-50 transition-transform ${openForm ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                    }`}
            >
                {/* Drawer Content */}
                <div className="bg-white w-full max-w-lg mx-4 sm:mx-auto rounded-lg shadow-lg p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">{Object.keys(planData).length ? "Update Plan" : "Add Plan"}</h2>
                        <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={toggleDrawer}
                        >
                            ✖
                        </button>
                    </div>

                    {/* Form */}
                    <form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="">
                                <label className="block text-sm font-medium mb-1">
                                    Currency<span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500  outline-none"
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                >
                                    <option value=''>Select</option>
                                    <option value='INR'>INR</option>
                                    <option value='USD'>USD</option>
                                </select>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium mb-1">
                                    Plan Type<span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500  outline-none"
                                    value={formData.planType}
                                    onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    <option value="FREE_TRIAL">Free Trial</option>
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="QUARTERLY">Quarterly</option>
                                    <option value="YEARLY">Yearly</option>
                                </select>
                            </div>

                            <div className='col-span-full'>
                                <label className="block text-sm font-medium mb-1">
                                    Plan Price<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="999"
                                    maxLength={4}
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>
                            <div className='col-span-full'>
                                <label className="block text-sm font-medium mb-1">
                                    Plan Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Starter Plan"
                                    maxLength={20}
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className='col-span-full'>
                                <label className="block text-sm font-medium mb-1">
                                    Plan Description<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Basic with random thing"
                                    maxLength={60}
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className='col-span-full'>
                                <label className="block text-sm font-medium mb-1">
                                    Bulk Limit<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="1000 or 10000 or 100000"
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.bulkLimit}
                                    maxLength={15}
                                    onChange={(e) => setFormData({ ...formData, bulkLimit: Number(e.target.value) })}
                                />

                            </div>

                            <div className="col-span-full flex items-center mt-4 gap-6">
                                {/* First Toggle */}
                                <div className="flex items-center">
                                    <label htmlFor="disable-user-toggle" className="text-md font-medium mr-4">
                                        Plan Status
                                    </label>
                                    <div
                                        className="relative"
                                        onClick={() => setFormData({ ...formData, isActive: !formData?.isActive })}>
                                        <input
                                            type="checkbox"
                                            id="disable-user-toggle"
                                            className="sr-only"
                                            checked={formData?.isActive || false}
                                        // onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <div
                                            onClick={() => setFormData({ ...formData, isActive: !formData?.isActive })}
                                            className={`block w-10 h-6 rounded-full cursor-pointer transition ${formData?.isActive ? "bg-blue-500" : "bg-gray-300"
                                                }`}
                                        ></div>
                                        <div
                                            className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition ${formData?.isActive ? "transform translate-x-4" : ""
                                                }`}
                                        ></div>
                                    </div>
                                </div>

                                {/* Second Toggle */}
                                <div className="flex items-center">
                                    <label htmlFor="second-toggle" className="text-md font-medium mr-4">
                                        External API
                                    </label>
                                    <div
                                        className="relative"
                                        onClick={() => setFormData({ ...formData, externalMessageSendAPI: !formData?.externalMessageSendAPI })}>
                                        <input
                                            type="checkbox"
                                            id="second-toggle"
                                            className="sr-only"
                                            checked={formData?.externalMessageSendAPI || false}
                                        // onChange={(e) => setFormData({ ...formData, externalMessageSendAPI: e.target.checked })}
                                        />
                                        <div
                                            onClick={() => setFormData({ ...formData, externalMessageSendAPI: !formData?.externalMessageSendAPI })}
                                            className={`block w-10 h-6 rounded-full cursor-pointer transition ${formData?.externalMessageSendAPI ? "bg-blue-500" : "bg-gray-300"
                                                }`}
                                        ></div>
                                        <div
                                            className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition ${formData?.externalMessageSendAPI ? "transform translate-x-4" : ""
                                                }`}
                                        ></div>
                                    </div>
                                </div>

                                {/* Third Toggle */}
                                <div className="flex items-center">
                                    <label htmlFor="third-toggle" className="text-md font-medium mr-4">
                                        ChatBot
                                    </label>
                                    <div 
                                        className="relative"
                                        onClick={() => setFormData({ ...formData, chatBotFeature: !formData?.chatBotFeature })}>
                                        <input
                                            type="checkbox"
                                            id="third-toggle"
                                            className="sr-only"
                                            checked={formData?.chatBotFeature || false}
                                            // onChange={(e) => setFormData({ ...formData, chatBotFeature: e.target.checked })}
                                        />
                                        <div
                                            onClick={() => setFormData({ ...formData, chatBotFeature: !formData?.chatBotFeature })}
                                            className={`block w-10 h-6 rounded-full cursor-pointer transition ${formData?.chatBotFeature ? "bg-blue-500" : "bg-gray-300"
                                                }`}
                                        ></div>
                                        <div
                                            className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition ${formData?.chatBotFeature ? "transform translate-x-4" : ""
                                                }`}
                                        ></div>
                                    </div>
                                </div>
                            </div>




                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={handleSubmit}
                        >
                            {Object.keys(planData).length ? "Update Plan" : "Add Plan"}
                        </button>


                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddPlan
