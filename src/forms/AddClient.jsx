import React, { useState } from 'react'
import { endPoints } from '../utils/apiEndPoint';
import axiosInstance from '../utils/axios';
import { useToast } from "../context/ToastContext";

const AddClient = ({ isOpen, setIsOpen, clientData = {}, setClientData, getData }) => {
    const showToast = useToast();
    const toggleDrawer = () => {
        setIsOpen(!isOpen);
        setClientData({});
    };
    const [formData, setFormData] = useState({
        clientName: clientData?.clientName || "",
        mobileNo: clientData?.user?.mobileNo || "",
        email: clientData?.user?.email || "",
        address: clientData?.address || "",
        isActive: clientData?.user?.isActive || true,
        password: 'Arjun@08'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (clientData?.id) {
                const response = await axiosInstance.put(endPoints.updateClient + "/" + clientData.id, formData)
                if (response.data.status) {
                    showToast("success", "Client Updated successfully!");
                    toggleDrawer();
                } else {
                    showToast("error", response.data.message);
                }
            } else {
                if (
                    !formData.clientName ||
                    !formData.mobileNo ||
                    !formData.email ||
                    !formData.address) {
                    showToast("info", "Please fill all the fields!");
                    return;
                }
                const response = await axiosInstance.post(endPoints.createClient, formData)
                if (response.data.status) {
                    showToast("success", "Client Created Successfully!");
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

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleDrawer}
                ></div>
            )}
            {/* Centered Drawer */}
            <div
                className={`fixed inset-0 flex items-center justify-center z-50 transition-transform ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                    }`}
            >
                {/* Drawer Content */}
                <div className="bg-white w-full max-w-lg mx-4 sm:mx-auto rounded-lg shadow-lg p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">{Object.keys(clientData).length ? "Update Client" : "Add Client"}</h2>
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
                                    Full Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={50}
                                    placeholder="Enter Full name"
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.clientName}
                                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Contact Number<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Contact Number"
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.mobileNo}
                                    maxLength={10}
                                    onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                                />

                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-medium mb-1">
                                    Email Id<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter email id"
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-medium mb-1">
                                    Address<span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    type="text"
                                    placeholder="Enter Address"
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            {/* <div>
                                <label className="block text-sm font-medium mb-1">
                                    Gender<span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option>Select...</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div> */}
                            {/* <div>
                                <label className="block text-sm font-medium mb-1">
                                    Date of Birth<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Age<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter your age"
                                    max={3}
                                    maxLength={3}
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div> */}
                            {/* <div className="col-span-full">
                                <label className="block text-sm font-medium mb-1">
                                    Role<span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500  outline-none"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option>Select...</option>
                                    <option>Admin</option>
                                    <option>Client</option>
                                    <option>Client Agent</option>
                                    <option>Customer</option>
                                </select>
                            </div> */}

                            <div className="col-span-full flex items-center mt-4">
                                <label htmlFor="disable-user-toggle" className="text-md font-medium mr-4">
                                    Disable Client
                                </label>
                                <div className="relative" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>
                                    <input
                                        type="checkbox"
                                        id="disable-user-toggle"
                                        className="sr-only"
                                        checked={formData.isActive || false}
                                    />
                                    <div
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={`block w-10 h-6 rounded-full cursor-pointer transition ${formData.isActive ? "bg-blue-500" : "bg-gray-300"
                                            }`}
                                    ></div>
                                    <div
                                        className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition ${formData.isActive ? "transform translate-x-4" : ""
                                            }`}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={handleSubmit}
                        >
                            {Object.keys(clientData).length ? "Update Client" : "Add Client"}
                        </button>


                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddClient
