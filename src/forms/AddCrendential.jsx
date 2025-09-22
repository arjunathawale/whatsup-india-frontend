import React, { useState } from 'react'
import { endPoints } from '../utils/apiEndPoint';
import axiosInstance from '../utils/axios';
import { useToast } from "../context/ToastContext";

const AddCrendential = ({ setOpenCrendentialForm, openCrendentialForm, clientCredentialData = {}, setClientCredentialData, getData }) => {
    const showToast = useToast();
    const toggleDrawer = () => {
        setOpenCrendentialForm(!openCrendentialForm);
        setClientCredentialData({});
    };
    console.log("clientCredentialData", clientCredentialData);

    const [formData, setFormData] = useState({
        clientId: clientCredentialData?.clientId || "",
        wpRegisteredMobileNo: clientCredentialData?.wpRegisteredMobileNo || "",
        wpPhoneNoId: clientCredentialData?.wpPhoneNoId || "",
        wpBussinessAccId: clientCredentialData?.wpBussinessAccId || "",
        wpPermanentToken: clientCredentialData?.wpPermanentToken || "",
        wpApiVersion: clientCredentialData?.wpApiVersion || "",
        wpAppId: clientCredentialData?.wpAppId || "",
    });

    console.log(formData);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (clientCredentialData.clientId) {
            try {
                const response = await axiosInstance.post(endPoints.addOrUpdateConfig, formData)
                if (response.data.status) {
                    showToast("success", "Added Successfully!");
                    getData();
                    toggleDrawer();
                } else {
                    showToast("error", response.data.message);
                }
            } catch (error) {
                showToast("error", error?.response?.data?.message || "Something went wrong");
            }
        } else {
            if (
                !formData.wpRegisteredMobileNo ||
                !formData.wpPhoneNoId ||
                !formData.wpBussinessAccId ||
                !formData.wpPermanentToken ||
                !formData.wpApiVersion ||
                !formData.wpAppId
            ) {
                showToast("info", "Please fill all the fields!");
                return;
            }
            try {
                const response = await axiosInstance.post(endPoints.addOrUpdateConfig, formData)
                if (response.data.status) {
                    showToast("success", "Added Successfully!");
                    getData();
                    toggleDrawer();
                } else {
                    showToast("error", response.data.message);
                }
            } catch (error) {
                showToast("error", error?.response?.data?.message || "Something went wrong");
            }
        }
    }
    return (
        <div>

            {openCrendentialForm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleDrawer}
                ></div>
            )}




            {/* Centered Drawer */}
            <div
                className={`fixed inset-0 flex items-center justify-center z-50 transition-transform ${openCrendentialForm ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                    }`}
            >
                {/* Drawer Content */}
                <div className="bg-white w-full max-w-lg mx-4 sm:mx-auto rounded-lg shadow-lg p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">{Object.keys(clientCredentialData).length > 1 ? "Update Meta Config" : "Add Meta Config"}</h2>
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
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Registered Mobile no<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="918978675677"
                                    maxLength={12}
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.wpRegisteredMobileNo}
                                    onChange={(e) => setFormData({ ...formData, wpRegisteredMobileNo: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Phone No ID<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="302237989640417"
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.wpPhoneNoId}
                                    maxLength={15}
                                    onChange={(e) => setFormData({ ...formData, wpPhoneNoId: e.target.value })}
                                />

                            </div>
                            <div className="">
                                <label className="block text-sm font-medium mb-1">
                                    Bussiness Account ID<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="279663541904824"
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.wpBussinessAccId}
                                    maxLength={15}
                                    onChange={(e) => setFormData({ ...formData, wpBussinessAccId: e.target.value })}
                                />
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium mb-1">
                                    App ID<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="316906588104672"
                                    maxLength={15}
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.wpAppId}
                                    onChange={(e) => setFormData({ ...formData, wpAppId: e.target.value })}
                                />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-medium mb-1">
                                    Permanent Access Token<span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    type="textarea"
                                    placeholder="Paste your Token"
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.wpPermanentToken}
                                    rows="3"
                                    onChange={(e) => setFormData({ ...formData, wpPermanentToken: e.target.value })}
                                />
                            </div>

                            <div className="col-span-full">
                                <label className="block text-sm font-medium mb-1">
                                    API Version<span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500  outline-none"
                                    value={formData.wpApiVersion}
                                    onChange={(e) => setFormData({ ...formData, wpApiVersion: e.target.value })}
                                >
                                    <option>Select...</option>
                                    <option>v18.0</option>
                                    <option>v19.0</option>
                                    <option>v20.0</option>
                                    <option>v21.0</option>
                                </select>
                            </div>


                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={handleSubmit}
                        >
                            {Object.keys(clientCredentialData).length > 1  ? "Update Meta Config" : "Add Meta Config"}
                        </button>


                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddCrendential
