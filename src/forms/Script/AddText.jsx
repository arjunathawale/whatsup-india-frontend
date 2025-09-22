import React, { useState } from 'react'
import { FiBold } from 'react-icons/fi';
import { GoItalic, GoStrikethrough } from 'react-icons/go';
import { useToast } from '../../context/ToastContext';
import { endPoints } from '../../utils/apiEndPoint';
import axiosInstance from '../../utils/axios';

const AddText = ({ botId, isTextOpen, setIsTextOpen, data = {}, setCurrentScript, redirectData, getScript }) => {
    const showToast = useToast();
    const toggleDrawer = () => {
        setIsTextOpen(!isTextOpen);
        setCurrentScript({});
    };


    const getExpectedMessage = (validationType) => {
        let type = "text";
        if (validationType === "IMAGE") {
            type = "image";
        } else if (validationType === "VIDEO") {
            type = "video";
        } else if (validationType === "DOCUMENT") {
            type = "document";
        } else {
            type = "text";
        }
        return type;
    }
    const [validationType, setValidationType] = useState(data?.validationType || "");
    const [formData, setFormData] = useState({
        id: data?._id,
        botId: botId,
        messageType: data?.messageType || "TEXT",
        variableName: data?.variableName || "",
        messageDraft: data?.messageDraft || "",
        redirectId: data?.redirectId || "000000000000000000000000",
        waitTime: (parseInt(data?.waitTime) / 1000) || 0,
        // validationType: data?.validationType || "",
        expectedMessage: data?.expectedMessage || getExpectedMessage(validationType),
        prevRedirectId: data?.prevRedirectId || "000000000000000000000000",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (
                !formData.botId ||
                !formData.messageType ||
                !formData.messageDraft
            ) {
                showToast('info', 'Please fill in all required fields.');
                return;
            }
            const response = await axiosInstance.post(endPoints.script, formData);
            if (response?.data?.status) {
                showToast('success', 'Added Successfully!');
            } else {
                showToast('error', response.data.message);
            }
            getScript();
            toggleDrawer();
        } catch (error) {
            console.log('Error in Adding Text Script', error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    };
    return (
        <div>
            {isTextOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleDrawer}
                ></div>
            )}

            <div
                className={`
                    fixed inset-0 flex items-center justify-center z-50 transition-transform
                    ${isTextOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                    }`}
            >

                <div className="bg-white w-full max-w-lg mx-4 sm:mx-auto rounded-lg shadow-lg p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">{Object.keys(data).length ? "Update Text Script" : "Add Text Script"}</h2>
                        <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={toggleDrawer}
                        >
                            ✖
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className='col-span-full'>
                            <label className="block text-sm font-medium mb-1">
                                Message Content<span className="text-red-500">*</span>
                            </label>
                            <textarea
                                type="text"
                                rows={4}
                                maxLength={4096}
                                placeholder="Type something"
                                className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                value={formData.messageDraft}
                                onChange={(e) => setFormData({ ...formData, messageDraft: e.target.value })}
                            />
                            <p className='text-[9px] font-semibold ml-1 flex justify-between items-center'>
                                <p className=' text-red-600'>

                                    {formData.messageDraft.length}/4096
                                </p>
                                <p className='flex gap-1'>
                                    <FiBold className='h-3 w-4 cursor-pointer' />
                                    <GoStrikethrough className='h-3 w-4 cursor-pointer' />
                                    <GoItalic className='h-3 w-4 cursor-pointer' />
                                </p>
                            </p>
                        </div>
                        <div className=''>
                            <label className="block text-sm font-medium mb-1">
                                Wait Time<span className="text-red-500">*</span>
                            </label>

                            <select
                                className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                value={formData?.waitTime || 0}
                                onChange={(e) => setFormData({ ...formData, waitTime: Number(e.target.value) })}
                            >
                                <option value='0'>0 Sec</option>
                                <option value='1'>1 Sec</option>
                                <option value='2'>2 Sec</option>
                                <option value='3'>3 Sec</option>
                                <option value='4'>4 Sec</option>
                                <option value='5'>5 Sec</option>
                            </select>
                            <p className='text-[9px] mt-1 font-semibold text-red-600 ml-1'>If grater than 0 sec then auto redirect to next message</p>
                        </div>
                        <div className="">
                            <label className="block text-sm font-medium mb-1">
                                Redirect To<span className="text-red-500">*</span>
                            </label>



                            <div className="relative">
                                <select
                                    className="w-full text-sm border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData?.redirectId}
                                    onChange={(e) => setFormData({ ...formData, redirectId: e.target.value })}
                                >
                                    <option value="">
                                        SELECT
                                    </option>
                                    {
                                        redirectData?.map((items, index) =>
                                            <option key={index} value={items?.id}>{index + 1 + ". "}{items?.optionName.substring(0, 20) + (items?.optionName.length > 20 ? "..." : "")}</option>
                                        )
                                    }
                                </select>
                            </div>
                            {/* <div className="relative">
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData?.redirectId}
                                    onChange={(e) => setFormData({ ...formData, redirectId: e.target.value })}
                                >
                                    <option value="1">1 Redirect</option>
                                    <option value="2">2 Redirect</option>
                                    <option value="3">3 Redirect</option>
                                    <option value="4">4 Redirect</option>
                                    <option value="5">5 Redirect</option>
                                </select>
                            </div> */}

                            <p className="text-[9px] mt-1 font-semibold text-red-600 ml-1">Where to redirect</p>
                        </div>
                        <div className=''>
                            <label className="block text-sm font-medium mb-1">
                                Variabke Key<span className="text-red-500"></span>
                            </label>
                            <input
                                type="text"
                                placeholder="Key for Store user input"
                                className="w-full uppercase border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                value={formData.variableName}
                                onChange={(e) => setFormData({ ...formData, variableName: e.target.value.replaceAll(" ", "_") })}
                            />
                            <p className='text-[9px] mt-1 font-semibold text-red-600 ml-1'>Key for store user input</p>
                        </div>
                        <div className="">
                            <label className="block text-sm font-medium mb-1">
                                Validation Type
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData?.validationType || ""}
                                    onChange={(e) => setFormData({ ...formData, validationType: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    <option value="NAME">NAME</option>
                                    <option value="EMAIL">EMAIL</option>
                                    <option value="ADDRESS">ADDRESS</option>
                                    <option value="PICCODE">PICCODE</option>
                                    <option value="MOBILE_NO">MOBILE_NO</option>
                                    <option value="NUMBER">NUMBER</option>
                                    <option value="IMAGE">IMAGE</option>
                                    <option value="VIDEO">VIDEO</option>
                                    {/* <option value="PAN">PAN</option> */}
                                    {/* <option value="GST">GST</option> */}
                                </select>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={handleSubmit}
                    >
                        {Object.keys(data).length ? "Update Text Script" : "Add Text Script"}
                    </button>
                </div>

            </div>

        </div>
    )
}

export default AddText
