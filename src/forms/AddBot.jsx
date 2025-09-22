import React, { useState } from 'react'
import { endPoints } from '../utils/apiEndPoint';
import axiosInstance from '../utils/axios';
import { useToast } from "../context/ToastContext";
import { useSelector } from 'react-redux';

const AddBot = ({ setOpenForm, openForm, botData = {}, setBotData, getData }) => {
    const { userData, userCrendentials } = useSelector((state) => state.user)
    const showToast = useToast();
    const toggleDrawer = () => {
        setOpenForm(!openForm);
        setBotData({});
    };


    const [formData, setFormData] = useState({
        clientId: userData?.client?.id,
        botName: botData.botName || '',
        botMobileNo: botData.botMobileNo || '',
        triggerMessage: botData?.triggerMessage?.join(',') || '',
        status: botData?.status || false,
        clientPersonalInfo: {
            clientName: userData?.client?.clientName,
            clientEmail: userData?.email,
            clientMobileNo: userData?.mobileNo,
            clientAddress: userData?.client?.address
        },
        clientMetaInfo: {
            wpPhoneNoId: userCrendentials?.wpPhoneNoId,
            wpPermanentToken: userCrendentials?.wpPermanentToken,
            wpApiVersion: userCrendentials?.wpApiVersion,
        },
        clientSubscriptinInfo: {
            id: '860711e9-dfbd-4767-9ea7-bc515fd88eb1'
        }
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (botData?._id) {
                const response = await axiosInstance.put(
                    endPoints.bot + "/" + botData?._id,
                    {
                        ...formData,
                        triggerMessage: formData.triggerMessage.split(',')
                    }
                )
                if (response.data.status) {
                    showToast("success", "Updated Successfully!");
                    toggleDrawer();
                } else {
                    showToast("error", response.data.message);
                }
            } else {
                if (
                    !formData.botName ||
                    !formData.botMobileNo ||
                    !formData.triggerMessage
                ) {
                    showToast("info", "Please fill all the fields!");
                    return;
                }
                const response = await axiosInstance.post(
                    endPoints.bot,
                    {
                        ...formData,
                        triggerMessage: formData?.triggerMessage?.split(',')
                    }
                )
                if (response?.data?.status) {
                    showToast("success", "Created Successfully!");
                    toggleDrawer();
                } else {
                    showToast("error", response.data.message);
                }
            }
            getData();
        } catch (error) {
            console.log('Error in Creating Bot', error);
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
                        <h2 className="text-lg font-bold">{Object.keys(botData).length ? "Update Bot" : "Add Bot"}</h2>
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
                            <div className=''>
                                <label className="block text-sm font-medium mb-1">
                                    Bot Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Bot Name"
                                    maxLength={50}
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.botName}
                                    onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                                />
                            </div>
                            <div className=''>
                                <label className="block text-sm font-medium mb-1">
                                    Bot Mobile No<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Registered Mobile No"
                                    maxLength={15}
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.botMobileNo}
                                    onChange={(e) => setFormData({ ...formData, botMobileNo: e.target.value })}
                                />
                            </div>
                            <div className='col-span-full'>
                                <label className="block text-sm font-medium mb-1">
                                    Trigger Message<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="hi,hello,main,start"
                                    maxLength={60}
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.triggerMessage}
                                    onChange={(e) => setFormData({ ...formData, triggerMessage: e.target.value })}
                                />
                            </div>

                            <div className="col-span-full flex items-center mt-4 gap-6">
                                <div className="flex items-center">
                                    <label htmlFor="disable-user-toggle" className="text-md font-medium mr-4">
                                        Bot Status
                                    </label>
                                    <div
                                        className="relative"
                                        onClick={() => setFormData({ ...formData, status: !formData?.status})}>
                                        <input
                                            type="checkbox"
                                            id="disable-user-toggle"
                                            className="sr-only"
                                            checked={formData?.status || false}
                                        />
                                        <div
                                            onClick={() => setFormData({ ...formData, status: !formData?.status })}
                                            className={`block w-10 h-6 rounded-full cursor-pointer transition ${formData?.status ? "bg-blue-500" : "bg-gray-300"
                                                }`}
                                        ></div>
                                        <div
                                            className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition ${formData?.status ? "transform translate-x-4" : ""
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
                            {Object.keys(botData).length ? "Update Bot" : "Add Bot"}
                        </button>


                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddBot
