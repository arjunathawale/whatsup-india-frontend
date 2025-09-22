import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import AddText from '../forms/Script/AddText';
import AddMedia from '../forms/Script/AddMedia';
import AddButton from '../forms/Script/AddButton';
import AddList from '../forms/Script/AddList';
import AddAPIScript from '../forms/Script/AddAPIScript';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { endPoints } from '../utils/apiEndPoint';
import { useToast } from '../context/ToastContext';
import { MdDelete } from 'react-icons/md';
import AddRequestLocation from '../forms/Script/AddRequestLocation';

const ChatbotDesign = () => {
    const showToast = useToast();
    const { chatbotId } = useParams();
    const [isTextOpen, setIsTextOpen] = useState(false);
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [isButtonOpen, setIsButtonOpen] = useState(false);
    const [isListOpen, setIsListOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isAPIOpen, setIsAPIOpen] = useState(false);
    const [mediaType, setMediaType] = useState("");
    const [currentScript, setCurrentScript] = useState({});

    const [scriptData, setScriptData] = useState([]);
    const getScript = async () => {
        try {
            const response = await axiosInstance.get(endPoints.script + `/${chatbotId}`);
            if (response.data.status) {
                setScriptData(response.data.data);
            } else {
                showToast("error", response.data.message);
            }
        } catch (error) {
            console.log('Error Getting Bots', error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }

    const deleteScript = async (id) => {
        try {
            const response = await axiosInstance.delete(endPoints.script + `/${id}`);
            if (response.data.status) {
                getScript();
                showToast("success", response.data.message);
            } else {
                showToast("error", response.data.message);
            }
        } catch (error) {
            console.log('Error Deleting Script', error);
        }
    }

    useEffect(() => {
        getScript();
    }, [])

    const handleOpenForm = (script, type, subType) => {
        setCurrentScript(script);
        switch (type) {
            case "TEXT":
                setIsTextOpen(true);
                break;
            case "LIST":
                setIsListOpen(true);
                break;
            case "BUTTON":
                setIsButtonOpen(true);
                break;
            case "IMAGE":
                setMediaType("IMAGE");
                setIsMediaOpen(true);
                break;
            case "VIDEO":
                setMediaType("VIDEO");
                setIsMediaOpen(true);
                break;
            case "DOCUMENT":
                setMediaType("DOCUMENT");
                setIsMediaOpen(true);
                break;
            case "REQUEST_LOCATION":
                setIsLocationOpen(true);
                break;
            case "API_DATA":
                setIsAPIOpen(true);
                break;
            case "TEMPLATE":
                setIsTextOpen(true);
                break;
            default:
                break;
        }
    }

    const redirectData = scriptData.map((item) => {
        return {
            id: item._id,
            optionName: item.messageDraft?.substring(0, 30),
        }
    })
    return (
        <div className="flex-grow flex-col">
            {/* Header Section */}
            <div className="h-12 w-full bg-gray-100 flex justify-between items-center">
                <FaArrowLeft
                    className="ml-4 h-6 w-6 cursor-pointer"
                    onClick={() => window.history.back()}
                />
                <p className="text-lg font-semibold mr-4">Design Chatbot</p>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 bg-slate-200">
                {/* Scrollable Content Section (90%) */}
                <div className="w-[90%] p-4 h-[90vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {scriptData.length > 0 &&
                            scriptData.map((item, index) => (
                                <div
                                    className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                                    onDoubleClick={() =>
                                        handleOpenForm(item, item?.messageType, item?.messageSubType)
                                    }
                                    key={index}
                                >
                                    <h2 className="text-lg font-semibold flex justify-between items-center">
                                        <span>{item.messageType}</span>
                                        <span className="p-1 px-2 bg-gray-300 text-sm rounded-full">
                                            {index + 1}
                                        </span>
                                    </h2>
                                    <p className="text-gray-600 mt-2 flex justify-between">
                                        <span className="w-[90%]">
                                            {item.messageDraft?.substring(0, 150)}
                                        </span>
                                        <MdDelete
                                            className="text-2xl text-red-500 cursor-pointer hover:text-red-700"
                                            onClick={() => deleteScript(item._id)}
                                        />
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Fixed Options Section (10%) */}
                <div className="w-[10%] bg-gray-100 h-[90vh] flex flex-col items-center justify-start gap-4 p-2">
                    <p
                        className="w-full p-2 bg-red-500 text-white text-center rounded cursor-pointer hover:bg-red-600"
                        onClick={() => setIsTextOpen(true)}
                    >
                        Text
                    </p>
                    <p
                        className="w-full p-2 bg-green-500 text-white text-center rounded cursor-pointer hover:bg-green-600"
                        onClick={() => {
                            setMediaType("IMAGE");
                            setIsMediaOpen(true);
                        }}
                    >
                        Image
                    </p>
                    <p
                        className="w-full p-2 bg-blue-500 text-white text-center rounded cursor-pointer hover:bg-blue-600"
                        onClick={() => {
                            setMediaType("VIDEO");
                            setIsMediaOpen(true);
                        }}
                    >
                        Video
                    </p>
                    <p
                        className="w-full p-2 bg-blue-500 text-white text-center rounded cursor-pointer hover:bg-blue-600"
                        onClick={() => {
                            setMediaType("DOCUMENT");
                            setIsMediaOpen(true);
                        }}
                    >
                        Document
                    </p>
                    <p
                        className="w-full p-2 bg-cyan-500 text-white text-center rounded cursor-pointer hover:bg-cyan-600"
                        onClick={() => setIsButtonOpen(true)}
                    >
                        Buttons
                    </p>
                    <p
                        className="w-full p-2 bg-rose-800 text-white text-center rounded cursor-pointer hover:bg-rose-900"
                        onClick={() => setIsListOpen(true)}
                    >
                        List
                    </p>
                    <p
                        className="w-full p-2 bg-purple-500 text-white text-center rounded cursor-pointer hover:bg-purple-600"
                        onClick={() => setIsLocationOpen(true)}
                    >
                        Request Location
                    </p>
                    <p
                        className="w-full p-2 bg-purple-500 text-white text-center rounded cursor-pointer hover:bg-purple-600"
                        onClick={() => setIsAPIOpen(true)}
                    >
                        API
                    </p>
                    <p
                        className="w-full p-2 bg-yellow-500 text-white text-center rounded cursor-pointer hover:bg-yellow-600"
                    >
                        Template
                    </p>
                </div>
            </div>

            {
                isTextOpen && (
                    <AddText
                        botId={chatbotId}
                        isTextOpen={isTextOpen}
                        setIsTextOpen={setIsTextOpen}
                        data={currentScript}
                        setCurrentScript={setCurrentScript}
                        redirectData={redirectData}
                        getScript={getScript}
                    />
                )
            }
            {
                isMediaOpen && (
                    <AddMedia
                        botId={chatbotId}
                        mediaType={mediaType}
                        isMediaOpen={isMediaOpen}
                        setIsMediaOpen={setIsMediaOpen}
                        data={{ mediaType: mediaType, ...currentScript }}
                        setCurrentScript={setCurrentScript}
                        redirectData={redirectData}
                        getScript={getScript}
                    />
                )
            }
            {
                isButtonOpen && (
                    <AddButton
                        botId={chatbotId}
                        isButtonOpen={isButtonOpen}
                        setIsButtonOpen={setIsButtonOpen}
                        data={currentScript}
                        setCurrentScript={setCurrentScript}
                        redirectData={redirectData}
                        getScript={getScript}
                    />
                )
            }
            {
                isListOpen && (
                    <AddList
                        botId={chatbotId}
                        isListOpen={isListOpen}
                        setIsListOpen={setIsListOpen}
                        data={currentScript}
                        setCurrentScript={setCurrentScript}
                        redirectData={redirectData}
                        getScript={getScript}
                    />
                )
            }

            {
                isLocationOpen && (
                    <AddRequestLocation
                        botId={chatbotId}
                        isLocationOpen={isLocationOpen}
                        setIsLocationOpen={setIsLocationOpen}
                        data={currentScript}
                        setCurrentScript={setCurrentScript}
                        redirectData={redirectData}
                        getScript={getScript}
                    />
                )
            }

            {
                isAPIOpen && (
                    <AddAPIScript
                        botId={chatbotId}
                        isAPIOpen={isAPIOpen}
                        setIsAPIOpen={setIsAPIOpen}
                        data={currentScript}
                        setCurrentScript={setCurrentScript}
                        redirectData={redirectData}
                        getScript={getScript}
                    />
                )
            }
        </div>
    )
}

export default ChatbotDesign
