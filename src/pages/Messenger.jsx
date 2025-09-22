import React, { useState, useRef, useEffect } from 'react';
import { FaRegUser } from 'react-icons/fa';
import axiosInstance from '../utils/axios';
import { endPoints } from '../utils/apiEndPoint';
import { useToast } from '../context/ToastContext';
import { useSelector } from 'react-redux';
import { TfiMenuAlt } from "react-icons/tfi";
import { HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import { IoMdCall } from 'react-icons/io';
import { MdContentCopy } from 'react-icons/md';
import { PiArrowBendUpLeft } from 'react-icons/pi';
import { BsCheck, BsCheck2All, BsClock } from 'react-icons/bs';
import { FcCancel } from "react-icons/fc";

const Messagener = () => {
    const { userData } = useSelector((state) => state.user)
    const showToast = useToast();
    const [customers, setCustomers] = useState([]);
    const [total, setTotal] = useState(0);
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;
        const updatedUser = {
            ...selectedUser,
            chatHistory: [
                ...selectedUser.chatHistory,
                { sender: "you", message: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ],
        };
        setSelectedUser(updatedUser);
        setNewMessage("");
    };

    // console.log('selectedUser', selectedUser);

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // useEffect(() => {
    //     if (selectedUser) {
    //         scrollToBottom();
    //     }
    // }, [selectedUser]);

    const [searchTerm, setSearchTerm] = useState("");

    const getCustomers = async () => {
        try {
            const response = await axiosInstance.get(endPoints.getAllClientCustomers + `/${userData?.client?.id}`);
            if (response?.data?.status) {
                setCustomers(response?.data?.data?.customers || []);
                setTotal(response?.data?.pagination?.totalCount || 0);
            } else {
                showToast('error', response?.data?.message || 'Something went wrong');
            }
        } catch (error) {
            console.log(error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        getCustomers();
    }, []);

    const getChatHistory = async (clientId, mobileNo) => {
        try {
            const response = await axiosInstance.get(endPoints.getChatHistory + `/${clientId}` + `/?mobileNo=${mobileNo}`);
            if (response?.data?.status) {
                console.log(response?.data?.data);

                setChatHistory(response?.data?.data?.messages || []);
            } else {
                showToast('error', response?.data?.message || 'Something went wrong');
            }
        } catch (error) {
            console.log(error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }
    function getISTTime(isoTimestamp) {
        const date = new Date(isoTimestamp);
        date.setMinutes(date.getMinutes() + 330);
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
        return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    }

    function transformString(inputString) {
        inputString = inputString.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        inputString = inputString.replace(/_(.*?)_/g, '<em>$1</em>');
        inputString = inputString.replace(/~(.*?)~/g, '<s>$1</s>');
        inputString = inputString.replace(/\n/g, '<br>');
        return inputString;
    }

    // console.log("chatHistory", String(chatHistory[18].messageJsonData.BODY_TEXT));

    return (
        <div className="flex h-[92vh]">
            <div className="w-64 bg-gray-100 border-r border-gray-300 overflow-y-auto">
                <div className="p-2 border-b border-gray-300">
                    <input
                        type="text"
                        placeholder="Search user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-md outline-none"
                    />
                </div>
                <ul className="list-none p-0 m-0">
                    {customers.map((user) => (
                        <li
                            key={user?._id}
                            onClick={() => {
                                setSelectedUser(user)
                                getChatHistory(user.clientId, user.mobileNo)
                            }}
                            className="p-3 cursor-pointer border-b border-gray-200 hover:bg-gray-200 flex items-center space-x-3"
                        >
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex justify-center items-center">
                                <FaRegUser className='text-gray-600' />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">{user.name || user?.mobileNo}</h4>
                                    <span className="text-xs text-gray-500">{user.lastMessageTime}</span>
                                </div>
                                <p className="text-xs text-gray-600 truncate">
                                    Sent by: {user.sender === "you" ? "You" : user.sender} {user.lastMessage}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex-1 bg-gray-300 px-4 flex flex-col">
                {selectedUser ? (
                    <>
                        <h2 className="text-lg font-medium mb-4 h-10 gap-2 mt-2 rounded-sm flex items-center px-2 bg-gray-100">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex justify-center items-center">
                                <FaRegUser className='text-gray-600 h-4 w-4' />
                            </div>{selectedUser.name}
                        </h2>
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {chatHistory?.map((chat, index) => (

                                <div>
                                    {
                                        <div
                                            key={index}
                                            className={`flex  ${(chat?.sender === "BOT" || chat?.sender === "SYSTEM") ? "justify-end" : "justify-start"}`}
                                        >
                                            {
                                                chat.messageJsonData.TYPE === "LIST" && <div
                                                    className={`p-2 rounded-lg ${chat?.sender === "BOT" || chat?.sender === "SYSTEM"
                                                        ? "bg-[#D9FDD3] text-gray max-w-max w-[40%]"
                                                        : "bg-white text-gray-800 max-w-max w-[40%]"
                                                        }`}
                                                >
                                                    <div className=''>
                                                        <p className="text-md break-all">{chat?.messageJsonData?.BODY_TEXT || ''}</p>
                                                        <p className="text-xs text-end text-gray-800 flex justify-end items-center">
                                                            {getISTTime(chat.messageDateTime)}
                                                            <span>
                                                                {
                                                                    chat?.messageStatus === "pending" && <BsClock className='h-3 w-3 text-gray-600 flex justify-center items-center' />
                                                                }
                                                                {
                                                                    chat?.messageStatus === "sent" && <BsCheck className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                                }
                                                                {
                                                                    chat?.messageStatus === "delivered" && <BsCheck2All className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                                }
                                                                {
                                                                    chat?.messageStatus === "read" && <BsCheck2All className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                                }
                                                                {
                                                                    chat?.messageStatus === "failed" && <FcCancel className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                                }
                                                            </span>
                                                        </p>
                                                        <hr />
                                                        <p className="text-md break-all items-center flex gap-2"><TfiMenuAlt />{chat?.messageJsonData?.BUTTON_NAME || ''}</p>
                                                        <hr />
                                                        {
                                                            chat?.messageJsonData?.LIST_DATA?.map((button, index) => (
                                                                <div className='gap-2 items-center p-2'>
                                                                    <p className='border text-sm p-1 border-gray-400 items-center'>
                                                                        {button?.title}
                                                                    </p>
                                                                    <p className='border text-sm p-1 border-gray-400 items-center'>
                                                                        {button?.desc || ''}
                                                                    </p>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            {
                                                chat.messageJsonData.TYPE === "BUTTON" && <div
                                                    className={`p-2 rounded-lg ${chat?.sender === "BOT" || chat?.sender === "SYSTEM"
                                                        ? "bg-[#D9FDD3] text-gray max-w-max w-[40%]"
                                                        : "bg-white text-gray-800 max-w-max w-[40%]"
                                                        }`}
                                                >
                                                    <div className=''>
                                                        <p className="text-md break-all">{chat?.messageJsonData?.BODY_TEXT || ''}</p>
                                                        <p className="text-xs text-end text-gray-800 flex justify-end items-center">
                                                            {getISTTime(chat.messageDateTime)}
                                                            <span>
                                                                {
                                                                    chat?.messageStatus === "pending" && <BsClock className='h-3 w-3 text-gray-600 flex justify-center items-center' />
                                                                }
                                                                {
                                                                    chat?.messageStatus === "sent" && <BsCheck className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                                }
                                                                {
                                                                    chat?.messageStatus === "delivered" && <BsCheck2All className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                                }
                                                                {
                                                                    chat?.messageStatus === "read" && <BsCheck2All className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                                }
                                                                {
                                                                    chat?.messageStatus === "failed" && <FcCancel className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                                }
                                                            </span>
                                                        </p>
                                                        <hr />
                                                        <hr />
                                                        {
                                                            chat?.messageJsonData?.BUTTON_DATA?.map((button, index) => (
                                                                <div className='gap-2 items-center p-2' key={index}>
                                                                    <p className='border text-sm p-1 border-gray-400 items-center'>
                                                                        {button?.title}
                                                                    </p>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            {
                                                chat.messageJsonData.TYPE === "TEXT" && <div
                                                    className={`p-2 rounded-lg ${chat?.sender === "BOT" || chat?.sender === "SYSTEM"
                                                        ? "bg-[#D9FDD3] text-gray max-w-max w-[40%]"
                                                        : "bg-white text-gray-800 max-w-max w-[40%]"
                                                        }`}
                                                >
                                                    {/* <p className="text-sm break-all">{chat.messageJsonData?.BODY_TEXT || ''}</p>
                                                     */}
                                                    <p className="text-sm break-all" dangerouslySetInnerHTML={{ __html: transformString(chat.messageJsonData?.BODY_TEXT || '') }}></p>
                                                    <p className="text-xs text-end text-gray-800 flex justify-end items-center">
                                                        {getISTTime(chat.messageDateTime)}
                                                        <span>
                                                            {
                                                                chat?.messageStatus === "pending" && <BsClock className='h-3 w-3 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "sent" && <BsCheck className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "delivered" && <BsCheck2All className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "read" && <BsCheck2All className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "failed" && <FcCancel className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                            }
                                            {
                                                chat.messageJsonData.TYPE === "SELECTED_BUTTON_OPTION" && <div
                                                    className={`p-2 rounded-lg ${chat?.sender === "BOT" || chat?.sender === "SYSTEM"
                                                        ? "bg-[#D9FDD3] text-gray max-w-max w-[40%]"
                                                        : "bg-white text-gray-800 max-w-max w-[40%]"
                                                        }`}
                                                >
                                                    <p className="text-sm break-all">{chat.messageJsonData?.BODY_TEXT || ''}</p>
                                                    <p className="text-xs text-end text-gray-800 flex justify-end items-center">
                                                        {getISTTime(chat.messageDateTime)}
                                                        <span>
                                                            {
                                                                chat?.messageStatus === "pending" && <BsClock className='h-3 w-3 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "sent" && <BsCheck className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "delivered" && <BsCheck2All className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "read" && <BsCheck2All className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "failed" && <FcCancel className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                            }
                                            {
                                                chat.messageJsonData.TYPE === "SELECTED_LIST_OPTION" && <div
                                                    className={`p-2 rounded-lg ${chat?.sender === "BOT" || chat?.sender === "SYSTEM"
                                                        ? "bg-[#D9FDD3] text-gray max-w-max w-[40%]"
                                                        : "bg-white text-gray-800 max-w-max w-[40%]"
                                                        }`}
                                                >
                                                    <p className="text-sm break-all">{chat.messageJsonData?.BODY_TEXT || ''}</p>
                                                    <p className="text-xs text-end text-gray-800 flex justify-end items-center">
                                                        {getISTTime(chat.messageDateTime)}
                                                        <span>
                                                            {
                                                                chat?.messageStatus === "pending" && <BsClock className='h-3 w-3 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "sent" && <BsCheck className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "delivered" && <BsCheck2All className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "read" && <BsCheck2All className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "failed" && <FcCancel className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                            }
                                            {
                                                chat.messageJsonData.TYPE === "LOCATION_REQUEST" && <div
                                                    className={`p-2 rounded-lg ${chat?.sender === "BOT" || chat?.sender === "SYSTEM"
                                                        ? "bg-[#D9FDD3] text-gray max-w-max w-[40%]"
                                                        : "bg-white text-gray-800 max-w-max w-[40%]"
                                                        }`}
                                                >
                                                    <p className="text-sm break-all" dangerouslySetInnerHTML={{ __html: transformString(chat.messageJsonData?.BODY_TEXT || '') }}></p>
                                                    <p className="text-xs text-end text-gray-800 flex justify-end items-center">
                                                        {getISTTime(chat.messageDateTime)}
                                                        <span>
                                                            {
                                                                chat?.messageStatus === "pending" && <BsClock className='h-3 w-3 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "sent" && <BsCheck className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "delivered" && <BsCheck2All className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "read" && <BsCheck2All className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "failed" && <FcCancel className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                            }
                                                        </span>
                                                    </p>
                                                    <hr />
                                                    <p className="text-md break-all text-center gap-2">{chat?.messageJsonData?.BUTTON_NAME || ''}</p>
                                                </div>
                                            }
                                            {
                                                chat.messageJsonData.TYPE === "LOCATION" && <div
                                                    className={`p-2 rounded-lg ${chat?.sender === "BOT" || chat?.sender === "SYSTEM"
                                                        ? "bg-[#D9FDD3] text-gray max-w-max w-[40%]"
                                                        : "bg-white text-gray-800 max-w-max w-[40%]"
                                                        }`}
                                                >
                                                    <p className='text-center'>
                                                        <a href={`https://www.google.com/maps/search/?api=1&query=${chat.messageJsonData?.LATITUDE},${chat.messageJsonData?.LONGITUDE}`} target="_blank" rel="noopener noreferrer" className="text-sm break-all  text-blue-500">Open In Map</a>
                                                    </p>
                                                    <p className="text-xs text-end text-gray-800 flex justify-end items-center">
                                                        {getISTTime(chat.messageDateTime)}
                                                        <span>
                                                            {
                                                                chat?.messageStatus === "pending" && <BsClock className='h-3 w-3 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "sent" && <BsCheck className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "delivered" && <BsCheck2All className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "read" && <BsCheck2All className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "failed" && <FcCancel className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                            }
                                                        </span>
                                                    </p>
                                                    <hr />
                                                    <p className="text-xs break-all text-center gap-x-2">{chat.messageJsonData?.NAME}</p>
                                                </div>
                                            }
                                            {
                                                chat.messageJsonData.TYPE === "IMAGE" && <div
                                                    className={`p-2 rounded-lg ${chat?.sender === "BOT" || chat?.sender === "SYSTEM"
                                                        ? "bg-[#D9FDD3] text-gray max-w-max w-[40%]"
                                                        : "bg-white text-gray-800 max-w-max w-[40%]"
                                                        }`}
                                                >
                                                    <img src={chat.messageJsonData?.URL} className="w-64 h-32" alt="" />
                                                    <p className="text-xs text-end text-gray-800 flex justify-end items-center">
                                                        {getISTTime(chat.messageDateTime)}
                                                        <span>
                                                            {
                                                                chat?.messageStatus === "pending" && <BsClock className='h-3 w-3 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "sent" && <BsCheck className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "delivered" && <BsCheck2All className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "read" && <BsCheck2All className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                            }
                                                            {
                                                                chat?.messageStatus === "failed" && <FcCancel className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                            }
                                                        </span>
                                                    </p>
                                                    <hr />
                                                </div>
                                            }
                                            {
                                                chat?.messageJsonData?.TYPE === "TEMPLATE" && <div
                                                    className={`p-2 rounded-lg ${chat?.sender === "BOT" || chat?.sender === "SYSTEM"
                                                        ? "bg-[#D9FDD3] text-gray max-w-max w-[40%]"
                                                        : "bg-white text-gray-800 max-w-max w-[40%]"
                                                        }`}
                                                >

{
    // console.log("chat?.messageJsonData?.PARAMETERS[0]", chat?.messageJsonData?.H_PARAMETERS[0])
}
                                                    <div className="px-1">
                                                        {/* {
                                                            chat?.messageJsonData?.CONTENT?.headerType === "IMAGE" &&
                                                            <img
                                                                src={chat?.messageJsonData?.H_PARAMETERS[0]}
                                                                alt="Header" className="w-full h-[130px] border border-gray-300 object-cover rounded-t-lg mt-2" />
                                                        }

                                                        {
                                                            chat?.messageJsonData?.CONTENT?.headerType === "DOCUMENT" &&
                                                            <div className="relative w-full h-[130px] border border-gray-300 rounded-t-lg mt-2 overflow-hidden">
                                                                <iframe
                                                                    src={chat?.messageJsonData?.PARAMETERS[0]?.parameters[0]?.video?.link}
                                                                    title="Document Preview"
                                                                    className="w-full h-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                                                                    style={{
                                                                        overflow: 'hidden'
                                                                    }}
                                                                />
                                                                <a
                                                                    href={chat?.messageJsonData?.PARAMETERS[0]?.parameters[0]?.document?.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="absolute inset-0 z-10"
                                                                    title="Open in new tab"
                                                                />
                                                            </div>
                                                        }
                                                        {
                                                            chat?.messageJsonData?.CONTENT?.headerType === "VIDEO" && <video
                                                                src={templateData?.headerValue?.example?.header_handle[0]}
                                                                controls
                                                                className="w-full h-[130px] object-cover rounded-t-lg mt-2"
                                                                autoPlay={true}
                                                            />
                                                        } */}

                                                        <article className=" p-2 rounded-b-lg">
                                                            {
                                                                chat?.messageJsonData?.CONTENT?.headerType === "TEXT" && <p className='text-xs font-semibold break'>{chat?.messageJsonData?.CONTENT?.headerText}
                                                                </p>
                                                            }

                                                            <p className='text-xs break-all' dangerouslySetInnerHTML={{ __html: transformString(chat?.messageJsonData?.CONTENT?.bodyText) }}></p>
                                                            {/* templateData?.headerValue?.text?.replace(/{{(\d+)}}/g, (_, index) => templateData?.headerValue?.example?.header_text[index - 1] || `{{${index}}}`)}</p> */}

                                                            {/* <p className='text-sm break-words' dangerouslySetInnerHTML={{ __html: bodyText.replace(/{{(\d+)}}/g, (_, index) => templateData?.bodyValue?.example?.body_text[0][index - 1] || `{{${index}}}`) }}></p> */}
                                                            <p className='text-xs mt-2 text-gray-500 break'>{chat?.messageJsonData?.CONTENT?.footerText}</p>
                                                            <hr />
                                                            <p className="text-xs text-end text-gray-800 flex justify-end items-center">
                                                                {getISTTime(chat.messageDateTime)}
                                                                <span>
                                                                    {
                                                                        chat?.messageStatus === "pending" && <BsClock className='h-3 w-3 text-gray-600 flex justify-center items-center' />
                                                                    }
                                                                    {
                                                                        chat?.messageStatus === "sent" && <BsCheck className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                                    }
                                                                    {
                                                                        chat?.messageStatus === "delivered" && <BsCheck2All className='h-4 w-4 text-gray-600 flex justify-center items-center' />
                                                                    }
                                                                    {
                                                                        chat?.messageStatus === "read" && <BsCheck2All className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                                    }
                                                                    {
                                                                        chat?.messageStatus === "failed" && <FcCancel className='h-4 w-4 text-blue-500 flex justify-center items-center' />
                                                                    }
                                                                </span>
                                                            </p>
                                                            <div className='px-2'>

                                                                {
                                                                    chat?.messageJsonData?.CONTENT?.buttonValue?.length > 0 && chat?.messageJsonData?.CONTENT?.buttonValue?.map((item, index) => {
                                                                        return (
                                                                            <div className='flex justify-center mt-[3px] gap-1'>
                                                                                {
                                                                                    item?.type == "URL" ?
                                                                                        <HiOutlineArrowTopRightOnSquare className='w-4 h-4 text-blue-600 flex justify-center items-center cursor-pointer' /> :
                                                                                        item?.type == "PHONE_NUMBER" ? <IoMdCall className='w-4 h-4 text-blue-600 flex justify-center items-center cursor-pointer' /> :
                                                                                            item.type == "COPY_CODE" ? <MdContentCopy className='w-4 h-4 text-blue-600 flex justify-center items-center cursor-pointer' /> :
                                                                                                <PiArrowBendUpLeft className='w-4 h-4 text-blue-600 flex justify-center items-center cursor-pointer' />
                                                                                }

                                                                                <p className='text-sm text-blue-600 font-medium text-center'>{item?.text}</p>
                                                                                <hr />
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </article>


                                                    </div>
                                                </div>
                                            }

                                            {/* <div
                                                className={`p-2 rounded-lg ${chat?.sender === "BOT" || chat?.sender === "SYSTEM"
                                                    ? "bg-blue-400 text-white max-w-max w-[40%]"
                                                    : "bg-gray-200 text-gray-800 max-w-max w-[40%]"
                                                    }`}
                                            >
                                                <p className="text-sm break-all">{chat.messageJsonData?.BODY_TEXT || ''}</p>
                                                <p className="text-xs text-end pl-10">{getISTTime(chat.messageDateTime)}</p>
                                            </div> */}
                                        </div>
                                    }

                                </div>
                            )

                            )}
                            {/* Empty div to ensure scrolling to bottom */}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input Box */}
                        <div className="border-t border-gray-200 pt-4 mt-4 flex items-center">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button
                                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                onClick={handleSendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 bg-gray-50 relative">
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-100"
                            style={{
                                backgroundImage: "url('https://plus.unsplash.com/premium_photo-1676057060928-c717a8e96784?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
                            }}
                        ></div>

                        {/* Centered Message */}
                        <div className="relative z-10 flex items-center justify-center h-full">
                            <p className="text-black text-xl">Select a user to start chatting.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Messagener
