import React, { useEffect, useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '../context/ToastContext'
import { endPoints } from '../utils/apiEndPoint'
import axiosInstance from '../utils/axios'
import { setUserCrendentials, setUserData } from '../store/userSlice'

const Profile = () => {
    const { userData, userCrendentials } = useSelector((state) => state.user)
    const showToast = useToast();
    const dispatch = useDispatch();
    const [metaProfileData, setMetaProfileData] = useState({});
    const [openForm, setOpenForm] = useState(false);
    const [openCredForm, setOpenCredForm] = useState(false);


    const [formData, setFormData] = useState({
        id: userData?.client?.id || "",
        clientName: userData?.fullname || "",
        mobileNo: userData?.mobileNo || "",
        email: userData?.email || "",
        address: userData?.client?.address || "",
        isActive: userData?.isActive || true,
    });
    const [credFormData, setCredFormData] = useState({
        id: userCrendentials?.id || "",
        clientId: userCrendentials?.clientId || "",
        wpRegisteredMobileNo: userCrendentials?.wpRegisteredMobileNo || "",
        wpPhoneNoId: userCrendentials?.wpPhoneNoId || "",
        wpBussinessAccId: userCrendentials?.wpBussinessAccId || "",
        wpPermanentToken: userCrendentials?.wpPermanentToken || "",
        wpApiVersion: userCrendentials?.wpApiVersion || "",
        wpAppId: userCrendentials?.wpAppId || "",
    });

    const getData = async () => {
        try {
            const response = await axiosInstance.get(endPoints.getMetaProfile + `/${userData?.client?.id}`);
            if (response?.data?.status) {
                console.log(response?.data?.data);
                setMetaProfileData(response?.data?.data?.metaProfileData.data[0] || {});
            }
        } catch (error) {
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        getData();
    }, [])

    const handleSubmit = async () => {
        try {
            if (formData?.id) {
                const response = await axiosInstance.put(endPoints.updateClient + "/" + formData?.id, formData)
                if (response.data.status) {
                    showToast("success", "Updated successfully!");
                    dispatch(setUserData(response?.data?.data));
                    setOpenForm(false);
                } else {
                    showToast("error", response.data.message);
                }
            } else {
                showToast("info", "Client ID Required");
            }
        } catch (error) {
            console.log(error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }

    const handleCredSubmit = async () => {
        try {
            if (credFormData?.id) {
                const response = await axiosInstance.post(endPoints.addOrUpdateConfig, credFormData)
                if (response.data.status) {
                    showToast("success", "Updated successfully!");
                    dispatch(setUserCrendentials(response?.data?.data));
                    setOpenCredForm(false);
                } else {
                    showToast("error", response.data.message);
                }
            } else {
                showToast("info", "ID Required");
            }
        } catch (error) {
            console.log(error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }
    return (
        <div className='flex-grow bg-gray-100 px-12 py-4 h-auto'>
            {
                openForm && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
                        <div className="bg-white w-full max-w-lg mx-4 sm:mx-auto rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Update</h2>
                                <button
                                    className="text-gray-600 hover:text-gray-800"
                                    onClick={() => setOpenForm(false)}
                                >
                                    ✖
                                </button>
                            </div>


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


                                {/* <div className="col-span-full flex items-center mt-4">
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
                                    </div> */}
                            </div>

                            <button
                                type="submit"
                                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleSubmit}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                )
            }
            {
                openCredForm && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
                        <div className="bg-white w-full max-w-lg mx-4 sm:mx-auto rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Update Credentials</h2>
                                <button
                                    className="text-gray-600 hover:text-gray-800"
                                    onClick={() => setCredFormData(false)}
                                >
                                    ✖
                                </button>
                            </div>


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
                                        value={credFormData.wpRegisteredMobileNo}
                                        onChange={(e) => setCredFormData({ ...credFormData, wpRegisteredMobileNo: e.target.value })}
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
                                        value={credFormData.wpPhoneNoId}
                                        maxLength={15}
                                        onChange={(e) => setCredFormData({ ...credFormData, wpPhoneNoId: e.target.value })}
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
                                        value={credFormData.wpBussinessAccId}
                                        maxLength={15}
                                        onChange={(e) => setCredFormData({ ...credFormData, wpBussinessAccId: e.target.value })}
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
                                        value={credFormData.wpAppId}
                                        onChange={(e) => setCredFormData({ ...credFormData, wpAppId: e.target.value })}
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
                                        value={credFormData.wpPermanentToken}
                                        rows="3"
                                        onChange={(e) => setCredFormData({ ...credFormData, wpPermanentToken: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-sm font-medium mb-1">
                                        API Version<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500  outline-none"
                                        value={credFormData.wpApiVersion}
                                        onChange={(e) => setCredFormData({ ...credFormData, wpApiVersion: e.target.value })}
                                    >
                                        <option>Select...</option>
                                        <option>v18.0</option>
                                        <option>v19.0</option>
                                        <option>v20.0</option>
                                        <option>v21.0</option>
                                    </select>
                                </div>


                            </div>

                            <button
                                type="submit"
                                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleCredSubmit}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                )
            }
            <div className='w-full h-auto bg-gray-200 p-4'>
                <h5 className='mb-1 font-semibold'>Cloud API Status</h5>
                <div className='w-full h-full flex flex-wrap justify-between items-center gap-2'>
                    <div
                        className="w-full sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/4 h-auto flex justify-between items-center bg-gray-50 p-3 px-4 rounded-lg text-sm border-l-4 border-b-2 border-blue-500">
                        <p>Messaging Tier</p>
                        <p className="font-semibold">{metaProfileData?.throughput?.level}</p>
                    </div>
                    <div
                        className="w-full sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/4 h-auto flex justify-between items-center bg-gray-50 p-3 px-4 rounded-lg text-sm border-l-4 border-b-2 border-green-500">
                        <p>Whatsapp Health</p>
                        <p className="font-semibold">{metaProfileData?.quality_rating}</p>
                    </div>
                    <div
                        className="w-full sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/4 h-auto flex justify-between items-center bg-gray-50 p-3 px-4 rounded-lg text-sm border-l-4 border-b-2 border-red-500">
                        <p>Webhook Status</p>
                        <p className="font-semibold">{metaProfileData?.webhook_configuration?.application ? "Connected" : "Not Connected"}</p>
                    </div>
                </div>
            </div>

            <div className='w-full h-auto bg-gray-200 p-4 mt-5'>
                <h5 className='mb-1 font-semibold'>Connected Webhook</h5>
                <div className='w-full h-full'>
                    <div
                        className="w-full h-auto flex justify-between items-center bg-gray-50 p-3 px-4 rounded-lg text-sm border-l-3 border-b-2 border-gray-500">
                        <p className='text-md'>{metaProfileData?.webhook_configuration?.application}</p>
                        {/* <p className="font-semibold">Status</p> */}
                    </div>
                </div>
            </div>


            <div className='w-full h-auto bg-gray-200 p-4 mt-5'>
                <div className='w-full h-full flex justify-between items-center'>
                    <h5 className='mb-1 font-semibold'>Profile</h5>
                    <FiEdit
                        className='text-xl cursor-pointer'
                        onClick={() => setOpenForm(true)}
                    />
                </div>
                <div className="w-full h-full grid grid-cols-2 gap-4 mt-2">
                    <div className="w-full  bg-gray-50 h-auto flex justify-between items-center p-3 px-4 rounded-lg text-sm border-l-2 border-b-2 border-gray-500">
                        <p>Name: </p>
                        <p className="font-semibold">{userData?.fullname}</p>
                    </div>
                    <div className="w-full  bg-gray-50 h-auto flex justify-between items-center p-3 px-4 rounded-lg text-sm border-l-2 border-b-2 border-gray-500">
                        <p>Email: </p>
                        <p className="font-semibold break-all">{userData?.email}</p>
                    </div>
                    <div className="w-full  bg-gray-50 h-auto flex justify-between items-center p-3 px-4 rounded-lg text-sm border-l-2 border-b-2 border-gray-500">
                        <p>Mobile No: </p>
                        <p className="font-semibold">{userData?.mobileNo}</p>
                    </div>
                    <div className="w-full  bg-gray-50 h-auto flex justify-between items-center p-3 px-4 rounded-lg text-sm border-l-2 border-b-2 border-gray-500">
                        <p>Address: </p>
                        <p className="font-semibold">{userData?.client?.address}</p>
                    </div>
                </div>
            </div>
            <div className='w-full h-auto bg-gray-200 p-4 mt-5'>
                <div className='w-full h-full flex justify-between items-center'>
                    <h5 className='mb-1 font-semibold'>Cloud API Account Details</h5>
                    <FiEdit
                        onClick={() => setOpenCredForm(true)}
                        className='text-xl cursor-pointer'
                    />
                </div>
                <div className="w-full h-full grid grid-cols-2 gap-4 mt-2">
                    <div className="w-full h-auto bg-gray-50 flex justify-between items-center p-3 px-4 rounded-lg text-sm border-l-2 border-b-2 border-gray-500">
                        <p>Mobile No: </p>
                        <p className="font-semibold">{userCrendentials?.wpRegisteredMobileNo}</p>
                    </div>
                    <div className="w-full h-auto  bg-gray-50 flex justify-between items-center p-3 px-4 rounded-lg text-sm border-l-2 border-b-2 border-gray-500">
                        <p>Phone Number ID: </p>
                        <p className="font-semibold">{userCrendentials?.wpPhoneNoId}</p>
                    </div>
                    <div className="w-full h-auto  bg-gray-50 flex justify-between items-center p-3 px-4 rounded-lg text-sm border-l-2 border-b-2 border-gray-500">
                        <p>Bussiness Account ID: </p>
                        <p className="font-semibold">{userCrendentials?.wpBussinessAccId}</p>
                    </div>
                    <div className="w-full h-auto bg-gray-50 flex justify-between items-center p-3 px-4 rounded-lg text-sm border-l-2 border-b-2 border-gray-500">
                        <p>App ID: </p>
                        <p className="font-semibold">{userCrendentials?.wpAppId}</p>
                    </div>
                    <div className="w-full h-auto  bg-gray-50 flex justify-between items-center p-3 px-4 rounded-lg text-sm border-l-2 border-b-2 border-gray-500">
                        <p>API Version: </p>
                        <p className="font-semibold">{userCrendentials?.wpApiVersion}</p>
                    </div>
                    <div className="w-full col-span-2  bg-gray-50 h-auto flex justify-between items-center p-3 px-4 rounded-lg text-sm border-l-2 border-b-2 border-gray-500">
                        <p>Permanent Access Token: </p>
                        <p className="font-semibold break-all">
                            {userCrendentials?.wpPermanentToken}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
