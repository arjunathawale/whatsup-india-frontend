import React, { useState } from 'react'
import { endPoints } from '../utils/apiEndPoint';
import axiosInstance from '../utils/axios';
import { useToast } from "../context/ToastContext";
import { IoMdEye } from 'react-icons/io';

const BroadcastDetail = ({ setOpenDetails, openDetails, broadcastDetails = [], setBroadcastDetails }) => {
    const showToast = useToast();
    const toggleDrawer = () => {
        setOpenDetails(!openDetails);
        setPlanData({});
    };

    function formatDate(dateString) {
        if (!dateString) {
            return '';
        }
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    }
    const pending = broadcastDetails.filter((item) => item.messageStatus === 'pending').length;
    const failed = broadcastDetails.filter((item) => item.messageStatus === 'failed').length;
    const sent = broadcastDetails.filter((item) => item.messageStatus === 'sent').length;
    const delivered = broadcastDetails.filter((item) => item.messageStatus === 'delivered').length;
    const read = broadcastDetails.filter((item) => item.messageStatus === 'read').length;

    return (
        <div>

            {openDetails && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleDrawer}
                ></div>
            )}

            {/* Centered Drawer */}
            <div
                className={`fixed inset-0 flex items-center justify-center z-50 transition-transform ${openDetails ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                    }`}
            >
                <div className="bg-white w-full max-w-4xl mx-4 sm:mx-auto rounded-lg shadow-lg p-2 px-3 h-[70%]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Broad Cast Details</h2>
                        <button
                            className="text-gray-600 text-lg hover:text-gray-800"
                            onClick={toggleDrawer}
                        >
                            ✖
                        </button>
                    </div>

                    <div className="w-full ">
                        <div className='flex justify-between items-center'>
                            <div className="w-32 h-14 bg-yellow-500 rounded-lg text-white relative cursor-pointer flex flex-col justify-center items-center">
                                <div className="text-md font-bold">{pending}</div>
                                <div className="text-sm font-semibold">Pending</div>
                            </div>
                            <div className="w-32 h-14 bg-red-500 rounded-lg text-white relative cursor-pointer flex flex-col justify-center items-center">
                                <div className="text-md font-bold">{failed}</div>
                                <div className="text-sm font-semibold">Failed</div>
                            </div>
                            <div className="w-32 h-14 bg-green-500 rounded-lg text-white relative cursor-pointer flex flex-col justify-center items-center">
                                <div className="text-md font-bold">{sent}</div>
                                <div className="text-sm font-semibold">Sent</div>
                            </div>
                            <div className="w-32 h-14 bg-yellow-500 rounded-lg text-white relative cursor-pointer flex flex-col justify-center items-center">
                                <div className="text-md font-bold">{delivered}</div>
                                <div className="text-sm font-semibold">Delivered</div>
                            </div>
                            <div className="w-32 h-14 bg-blue-500 rounded-lg text-white relative cursor-pointer flex flex-col justify-center items-center">
                                <div className="text-md font-bold">{read}</div>
                                <div className="text-sm font-semibold">Seen</div>
                            </div>
                        </div>
                        <div className='h-[90%] overflow-y-auto'>
                            <table className="table-auto w-full bg-white shadow-md rounded-lg mt-2">
                                <thead>
                                    <tr className="bg-[#084DF0] text-white text-left">
                                        <th className="px-2 py-1 text-sm font-medium text-center">Sr No</th>
                                        <th className="px-2 py-1 text-sm font-medium">Name</th>
                                        <th className="px-2 py-1 text-sm font-medium">Mobile No</th>
                                        <th className="px-2 py-1 text-sm font-medium">Send Time</th>
                                        <th className="px-2 py-1 text-sm font-medium">Deliver Time</th>
                                        <th className="px-2 py-1 text-sm font-medium">Read Time</th>
                                        <th className="px-2 py-1 text-sm font-medium text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        broadcastDetails.length > 0 &&
                                        broadcastDetails.map((broadcast, index) => (
                                            <tr key={broadcast?.id + String(index)} className="border-b h-max">
                                                <td className="px-4 py-1 text-sm text-center">{index + 1}</td>
                                                <td className="px-4 py-1 text-sm">{broadcast?.broadcastName?.substring(0, 7)}...</td>
                                                <td className="px-4 py-1 text-sm">{broadcast?.mobileNo}</td>
                                                <td className="px-4 py-1 text-sm">{broadcast?.sendDateTime ? formatDate(broadcast?.sendDateTime) : formatDate(broadcast?.messageDateTime)}</td>
                                                <td className="px-4 py-1 text-sm">{formatDate(broadcast?.messageDateTime)}</td>
                                                <td className="px-4 py-1 text-sm">{formatDate(broadcast?.messageDateTime)}</td>
                                                <td className="px-4 py-1 text-sm text-center">{
                                                    broadcast?.messageStatus === "sent" ? <span className='p-1 px-2 bg-green-500 text-xs text-white rounded-lg'>Sent</span> :
                                                        broadcast?.messageStatus === "read" ? <span className='p-1 px-2 bg-blue-500 text-xs text-white rounded-lg'>Read</span> :
                                                            broadcast?.messageStatus === "delivered" ? <span className='p-1 px-2 bg-gray-400 text-xs text-white rounded-lg'>Delivered</span> :
                                                                broadcast?.messageStatus === "failed" ? <span className='p-1 px-2 bg-red-400 text-xs text-white rounded-lg'>Failed</span> :
                                                                    <span className='p-1 px-2 bg-yellow-500 text-xs text-white rounded-lg'>Pending</span>
                                                }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default BroadcastDetail
