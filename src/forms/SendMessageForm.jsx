import React, { useEffect, useState } from 'react'
import { endPoints, TemplateDropdown } from '../utils/apiEndPoint';
import axiosInstance from '../utils/axios';
import { useToast } from "../context/ToastContext";
import 'react-quill/dist/quill.snow.css';
import { MdContentCopy } from 'react-icons/md';
import { HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import { IoMdCall } from 'react-icons/io';
import { PiArrowBendUpLeft } from 'react-icons/pi';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';
import DynamicForm from '../components/DynamicForm';

const SendMessageForm = ({ setOpenForm, openForm, getData }) => {
    const { userData } = useSelector((state) => state.user);
    const showToast = useToast();
    const toggleDrawer = () => {
        setOpenForm(!openForm);
    };
    const [templateData, setTemplateData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(endPoints.getTemplateDropdown + `/${userData?.client?.id}`);
                if (response?.data?.status) {
                    setTemplateData(response?.data?.data?.templates || []);
                } else {
                    showToast('error', response?.data?.message || 'Something went wrong');
                }
            } catch (error) {
                showToast('error', error?.response?.data?.message || 'Something went wrong');
            }
        }
        fetchData();

    }, [])
    // const templateData = TemplateDropdown;
    const [activeTab, setActiveTab] = useState('manual');
    const [selectedTempate, setSelectedTemplate] = useState(null);
    const [tempateName, setTempateName] = useState('');
    const [headerSampleValue, setHeaderSampleValue] = useState(null);
    const [headerUrlValue, setHeaderUrlValue] = useState("");
    const [whatsappMobileNo, setWhatsappMobileNo] = useState('');
    const [buttonParams, setButtonParams] = useState([]);
    const [bodySampleValue, setBodySampleValue] = useState([]);



    // Added for logic for header type template
    const [selectedLocationOptions, setSelectedLocationOptions] = useState([]);
    const [headerLocationkey, setHeaderLocationkey] = useState([]);
    const onTemplateChange = (e) => {
        const selectedTemplate = templateData.find((temp) => temp.id === e.target.value);
        setSelectedTemplate(selectedTemplate);
        setTempateName(selectedTempate?.templateName);
        if (selectedTemplate?.headerType === 'LOCATION') {
            setHeaderLocationkey(["latitude", "longitude", "name", "address"])
        }
    }
    console.log("headerLocationkey", headerLocationkey);

    const changeBodyValue = (index, value) => {
        const newBodySampleValue = [...bodySampleValue];
        newBodySampleValue[index] = value;
        setBodySampleValue(newBodySampleValue);
    };

    const handleButtonsParams = (index, type, value) => {
        const data = {
            "type": type,
            "text": value
        }
        const newButtonValues = [...buttonParams];
        newButtonValues[index] = data;
        setButtonParams(newButtonValues);
    }

    function isValidUrl(url) {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
        } catch (err) {
            return false;
        }
    }

    const [data, setData] = useState([])
    const [column, setColumn] = useState([])
    const getAllKeys = (arr) => {
        const allKeys = arr.reduce((keys, obj) => {
            Object.keys(obj).forEach((key) => keys.add(key));
            return keys;
        }, new Set());

        return Array.from(allKeys);
    };
    const handleFileUploadFile = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (!file) {
            showToast('error', 'File not found')
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (!e.target.result) {
                    showToast('error', 'Unable to get file')
                }

                const binaryStr = e.target.result;

                const workbook = XLSX.read(binaryStr, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];

                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                setData(jsonData);
                const data = getAllKeys(jsonData);
                setColumn(data);
                showToast('success', 'File Uploaded Successfully')
            } catch (error) {
                console.error('Error reading file:', error);
                console.error('Error reading file. Please check the file format.');
            }
        };
        reader.readAsBinaryString(file);
    };

    const [mobileNoKey, setMobileNoKey] = useState("")
    const [headerDynamicState, setHeaderDynamicState] = useState({
        key: "",
        value: ""
    })
    const [bodyDynamicValue, setBodyDynamicValue] = useState([]);
    const [buttonDynamicValue, setBUttonDynamicValue] = useState([]);
    const [broadcastTitle, setBroadcastTitle] = useState("")


    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setBodySampleValue([]);
        setSelectedTemplate(null);
        setTempateName(null);
        setHeaderSampleValue(null);
        setWhatsappMobileNo(null);
        setButtonParams([]);
        setHeaderDynamicState({
            key: "",
            value: ""
        });
        setMobileNoKey('')
        setBodyDynamicValue([])
        setBUttonDynamicValue([])
        setData([])
        setColumn([])
    };
    const handleHeaderChangeDropdown = (e) => {
        const url = data[0][e.target.value]
        setHeaderDynamicState({
            key: e.target.value,
            value: url
        })
    }
    const handleBodyChangeDropdown = (e, index) => {
        const selectedKey = e.target.value;
        const selectedData = data[0][selectedKey];

        const json = {
            key: selectedKey,
            value: selectedData,
        };

        const newData = [...bodyDynamicValue];
        newData[index] = json;
        setBodyDynamicValue(newData);
    };

    const handleButtonsChangeDropdown = (e, index, type) => {
        const selectedKey = e.target.value;
        const selectedData = data[0][selectedKey];
        const json = {
            "type": type,
            "key": selectedKey,
            "text": String(selectedData)
        }
        const newButtonValues = [...buttonDynamicValue];
        newButtonValues[index] = json;
        setBUttonDynamicValue(newButtonValues);
    }

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (activeTab === 'manual') {
            const mobileNo = whatsappMobileNo.split(',').map((item) => item.trim());
            const checkLenght = mobileNo.some((item) => item.length !== 12);
            if (checkLenght) {
                showToast("error", "Please Check Mobile Number Lenght!");
                return;
            }
            const payloadData = mobileNo.map((item) => {
                let headerObject = {}
                if (selectedTempate?.headerValue?.example) {
                    switch (selectedTempate?.headerType) {
                        case "TEXT":
                            headerObject = {
                                type: "header",
                                parameters: [
                                    {
                                        type: "text",
                                        text: headerSampleValue,
                                    }
                                ]
                            }
                            break;

                        case "IMAGE":
                            headerObject = {
                                type: "header",
                                parameters: [
                                    {
                                        type: "image",
                                        image: {
                                            link: headerUrlValue
                                        },
                                    }
                                ]
                            }
                            break;
                        case "VIDEO":
                            headerObject = {
                                type: "header",
                                parameters: [
                                    {
                                        type: "video",
                                        video: {
                                            link: headerUrlValue
                                        },
                                    }
                                ]
                            }
                            break;
                        case "DOCUMENT":
                            headerObject = {
                                type: "header",
                                parameters: [
                                    {
                                        type: "document",
                                        document: {
                                            link: headerUrlValue
                                        },
                                    }
                                ]
                            }
                            break;
                        case "LOCATION":
                            headerObject = {
                                location: {

                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
                return {
                    "mobileNo": item,
                    "header": headerObject,
                    "body": bodySampleValue.length > 0 ? {
                        type: "body",
                        parameters: bodySampleValue.map((item, index) => {
                            return {
                                type: "text",
                                text: item
                            }
                        })
                    } : {},
                    "button": buttonParams.length > 0 ? buttonParams.map((item, index) => {
                        return {
                            type: "button",
                            sub_type: item?.type?.toLowerCase(),
                            index: 0,
                            parameters: {
                                type: "text",
                                text: item?.text
                            }
                        }
                    }) : {}
                }
            })
            const payload = {
                clientId: userData?.client?.id,
                broadcastName: broadcastTitle,
                templateId: selectedTempate?.id,
                templateName: selectedTempate?.templateName,
                templateLang: selectedTempate?.templateLang,
                templateCategory: selectedTempate?.templateCategory,
                broadCastData: payloadData

            }

            try {
                const response = await axiosInstance.post(endPoints.sendBroadcast, payload);
                if (response?.data?.status) {
                    showToast('success', response?.data?.message);
                } else {
                    showToast('error', response?.data?.message || 'Something went wrong');
                }
            } catch (error) {
                showToast('error', error?.response?.data?.message || 'Something went wrong');
            }
        } else {
            const checkLenght = data.some((item) =>
                String(item[mobileNoKey]) === undefined ||
                String(item[mobileNoKey]) === '' ||
                String(item[mobileNoKey]).length !== 12
            );
            if (checkLenght) {
                showToast("error", "Please Check Mobile Number Lenght!");
                return;
            }
            console.log('bodyDynamicValue.length', buttonDynamicValue.length);
            console.log('bodyDynamicValue.length', selectedTempate?.buttonValue?.buttons);
            if (bodyDynamicValue.length !== (selectedTempate?.bodyValue?.example?.body_text?.length || 0)) {
                showToast("error", "Please Check, You not provided all body params!");
                return;
            }

            if (selectedTempate?.buttonValue?.buttons) {
                const count = selectedTempate?.buttonValue?.buttons?.filter(obj => Array.isArray(obj?.example) && obj?.example.length > 0).length;
                if (buttonDynamicValue.length !== count) {
                    showToast("error", "Please Check, You not provided all button params!");
                    return;
                }
            }
            const payloadData = data?.map((itemObject) => {
                let headerObject = {}
                if (
                    selectedTempate?.headerType === "IMAGE" ||
                    selectedTempate?.headerType === "VIDEO" ||
                    selectedTempate?.headerType === "DOCUMENT"
                ) {
                    if (!isValidUrl(itemObject[headerDynamicState.key])) {
                        showToast("error", "Please Check Mobile Number Lenght!");
                    }
                }
                if (selectedTempate?.headerValue?.example) {
                    switch (selectedTempate?.headerType) {
                        case "TEXT":
                            headerObject = {
                                type: "header",
                                parameters: [
                                    {
                                        type: "text",
                                        text: itemObject[headerDynamicState.key],
                                    }
                                ]
                            }
                            break;
                        case "IMAGE":
                            headerObject = {
                                type: "header",
                                parameters: [
                                    {
                                        type: "image",
                                        image: {
                                            link: itemObject[headerDynamicState.key]
                                        },
                                    }
                                ]
                            }
                            break;
                        case "VIDEO":
                            headerObject = {
                                type: "header",
                                parameters: [
                                    {
                                        type: "video",
                                        video: {
                                            link: itemObject[headerDynamicState.key]
                                        },
                                    }
                                ]
                            }
                            break;
                        case "DOCUMENT":
                            headerObject = {
                                type: "header",
                                parameters: [
                                    {
                                        type: "document",
                                        document: {
                                            link: itemObject[headerDynamicState.key]
                                        },
                                    }
                                ]
                            }
                            break;
                        // case "LOCATION":
                        //     headerObject = {
                        //         location: selectedLocationOptions.reduce((acc, item) => {
                        //             acc[item?.ACTUAL_VALUE] = itemObject[item?.COL_NAME];
                        //             return acc;
                        //         }, {})
                        //     }
                        //     break;
                        default:
                            break;
                    }
                } else {
                    if (selectedTempate?.headerType === "LOCATION") {
                        headerObject = selectedLocationOptions.reduce((acc, item) => {
                            acc[item?.ACTUAL_VALUE] = itemObject[item?.COL_NAME];
                            return acc;
                        }, {})

                    }
                }

                console.log('headerObject', headerObject);


                return {
                    "mobileNo": String(itemObject[mobileNoKey]),
                    "header": headerObject,
                    "body": bodyDynamicValue?.length > 0 ? {
                        type: "body",
                        parameters: bodyDynamicValue?.map((item) => {
                            return {
                                type: "text",
                                text: itemObject[item?.key]
                            }
                        })
                    } : {},
                    "button": buttonDynamicValue?.length > 0 ? buttonDynamicValue?.map((item) => {
                        return {
                            type: "button",
                            sub_type: item?.type?.toLowerCase(),
                            index: 0,
                            parameters: {
                                type: "text",
                                text: itemObject[item?.key]
                            }
                        }
                    }) : {}
                }
            })
            console.log('payloadData', payloadData);

            const payload = {
                clientId: userData?.client?.id,
                broadcastName: broadcastTitle,
                templateId: selectedTempate?.id,
                templateName: selectedTempate?.templateName,
                templateLang: selectedTempate?.templateLang,
                templateCategory: selectedTempate?.templateCategory,
                broadCastData: payloadData

            }

            try {
                const response = await axiosInstance.post(endPoints.sendBroadcast, payload);
                if (response?.data?.status) {
                    showToast('success', response?.data?.message);
                } else {
                    showToast('error', response?.data?.message || 'Something went wrong');
                }
            } catch (error) {
                showToast('error', error?.response?.data?.message || 'Something went wrong');
            }

        }
        getData()
        toggleDrawer();
    }


    function transformString(inputString) {
        inputString = inputString.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        inputString = inputString.replace(/_(.*?)_/g, '<em>$1</em>');
        inputString = inputString.replace(/~(.*?)~/g, '<s>$1</s>');
        inputString = inputString.replace(/\n/g, '<br>');
        return inputString;
    }

    console.log("selectedTempate", selectedTempate);


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
                className={`fixed inset-0 flex items-center justify-center z-50 transition-transform ${openForm ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}
            >
                {/* Drawer Content */}
                <div className="bg-white w-8/12 max-w-full mx-4 sm:mx-auto rounded-lg shadow-lg p-6 flex">
                    {/* Form Container (70% width with scrolling) */}
                    <div className="w-[75%] overflow-y-auto max-h-[80vh] pr-4">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-0">
                            <h2 className="text-lg font-bold">Send Messages</h2>
                            <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={toggleDrawer}
                            >
                                ✖
                            </button>
                        </div>
                        {/* Tabs */}
                        <div className="flex justify-center border-b mb-2">
                            <button
                                className={`px-4 py-1 ${activeTab === 'manual'
                                    ? 'bg-gray-200 border-b-2 border-blue-500'
                                    : 'hover:bg-gray-100'
                                    }`}
                                onClick={() => handleTabClick('manual')}
                            >
                                Manual Input
                            </button>
                            <button
                                className={`px-4 py-1 ${activeTab === 'bulk'
                                    ? 'bg-gray-200 border-b-2 border-blue-500'
                                    : 'hover:bg-gray-100'
                                    }`}
                                onClick={() => handleTabClick('bulk')}
                            >
                                Bulk Sheet Upload
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">

                            {/* Broadcast title */}
                            <div className='col-span-full'>
                                <label className="block text-sm font-medium mb-1">
                                    Broadcast Title<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={broadcastTitle}
                                    onChange={(e) => setBroadcastTitle(e.target.value)}
                                />
                            </div>
                            {/* Select Template Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Select Template<span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={tempateName}
                                    onChange={onTemplateChange}
                                >

                                    <option value=''>Select</option>
                                    {
                                        templateData.map((item, index) =>
                                            <option key={item.id} value={item.id} >{item.templateName} - {item.templateLang}</option>)
                                    }
                                </select>
                            </div>
                            <div className=''>
                                <label className="block text-sm font-medium mb-1">
                                    Template Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    disabled={true}
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={selectedTempate?.templateName || ''}
                                />
                            </div>

                            {/* Manual Logic */}
                            {
                                activeTab === 'manual' &&
                                <>
                                    <div className='col-span-full'>
                                        <label className="block text-sm font-medium mb-1">
                                            Whatsapp Numbers<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="919146030303, 919146030304"
                                            className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                            value={whatsappMobileNo}
                                            onChange={(e) => setWhatsappMobileNo(e.target.value)}
                                        />
                                        <p className='text-[10px] mt-1 font-semibold text-red-600 ml-1'>Note: You can add multiple with comma</p>
                                    </div>
                                    {
                                        (selectedTempate?.headerType === 'TEXT' && selectedTempate?.headerValue?.example?.header_text?.length > 0) &&
                                        <>
                                            <div className=''>
                                                <label className="block text-sm font-medium mb-1">
                                                    Header Text Value<span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled={true}
                                                    className="w-full text-center border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    value={'{{1}}'}
                                                />
                                            </div>
                                            <div className=''>
                                                <label className="block text-sm font-medium mb-1">
                                                    Header Text Sample Value<span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={`Please Value for {{1}}`}
                                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    value={headerSampleValue}
                                                    onChange={(e) => setHeaderSampleValue(e.target.value)}
                                                />
                                            </div>
                                        </>
                                    }

                                    {

                                        (selectedTempate?.headerType === 'IMAGE' || selectedTempate?.headerType === 'VIDEO' || selectedTempate?.headerType === 'DOCUMENT') && selectedTempate?.headerValue?.example?.header_handle?.length > 0 &&
                                        <>
                                            <div className=''>
                                                <label className="block text-sm font-medium mb-1">
                                                    Header URL Value<span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled={true}
                                                    className="w-full text-center border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    value={selectedTempate?.headerType + ' URL'}
                                                />
                                            </div>
                                            <div className=''>
                                                <label className="block text-sm font-medium mb-1">
                                                    Header URL Sample Value<span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={`Url`}
                                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    value={headerUrlValue}
                                                    onChange={(e) => setHeaderUrlValue(e.target.value)}
                                                />
                                                {
                                                    (!isValidUrl(headerUrlValue) && headerUrlValue.length > 0) ? <div className='text-[10px] mt-1 font-semibold text-red-600 ml-1'>Invalid URL</div> : <p className='text-[10px] mt-1 font-semibold text-red-600 ml-1'>Note: Only Secured Https URLs</p>
                                                }

                                            </div>
                                        </>
                                    }

                                    {
                                        (selectedTempate?.bodyValue?.example?.body_text[0].length > 0) &&
                                        <>
                                            <div className=''>
                                                <label className="block text-sm font-medium">
                                                    Body Value<span className="text-red-500">*</span>
                                                </label>
                                                {

                                                    selectedTempate?.bodyValue?.example?.body_text[0].map((item, index) =>
                                                        <input
                                                            key={index}
                                                            type="text"
                                                            disabled={true}
                                                            className="w-full text-center border rounded my-1 px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            value={'{{' + (index + 1) + '}}'}
                                                        />
                                                    )
                                                }

                                            </div>
                                            <div className=''>
                                                <label className="block text-sm font-medium">
                                                    Body Sample Sample Value<span className="text-red-500">*</span>
                                                </label>
                                                {
                                                    selectedTempate?.bodyValue?.example?.body_text[0].map((item, index) => <input
                                                        type="text"
                                                        placeholder={`Please Value for {{${index + 1}}}`}
                                                        className="w-full border rounded px-3 py-2 my-1 focus:ring-1 focus:ring-blue-500 outline-none"
                                                        value={bodySampleValue[index]}
                                                        onChange={(e) => changeBodyValue(index, e.target.value)}
                                                    />)
                                                }

                                            </div>
                                        </>
                                    }

                                    {
                                        selectedTempate?.buttonValue?.buttons?.map((item, index) => {
                                            if (item?.type === 'URL' && item?.example?.length > 0) {
                                                return <>
                                                    <div className=''>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Button Dynamic URL Value<span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            disabled={true}
                                                            className="w-full text-center border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            value={item?.type + ' URL'}
                                                        />
                                                    </div>
                                                    <div className=''>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Button URL<span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder={item.url}
                                                            className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            value={buttonParams[index]?.text || ''}
                                                            onChange={(e) => handleButtonsParams(index, item?.type, e.target.value)}
                                                        />
                                                        {
                                                            !isValidUrl(buttonParams[index]?.text) && buttonParams[index]?.text?.length > 0 && <div className='text-[10px] mt-1 font-semibold text-red-600 ml-1'>Invalid URL</div>
                                                        }
                                                    </div>
                                                </>
                                            } else if (item?.type === 'COPY_CODE' && item?.example?.length > 0) {
                                                return <>
                                                    <div className=''>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Button Copy Code Value<span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            disabled={true}
                                                            className="w-full text-center border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            value={item?.type}
                                                        />
                                                    </div>
                                                    <div className=''>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Button Copy Code<span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            maxLength={15}
                                                            placeholder={'XXSUSK12'}
                                                            className="w-full uppercase border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            value={buttonParams[index]?.text || ''}
                                                            onChange={(e) => handleButtonsParams(index, item.type, e.target.value)}
                                                        />
                                                    </div>
                                                </>
                                            } else {
                                                return;
                                            }
                                        })
                                    }
                                </>
                            }
                            {/* Bulk Logic */}
                            {
                                activeTab === 'bulk' &&
                                <>
                                    <div className="col-span-full">
                                        <label className="block text-sm font-medium mb-1">
                                            Upload Sheet File<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="file"
                                            accept='.xlsx, .xls'
                                            className="w-full border rounded px-3 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                                            onChange={handleFileUploadFile}
                                        />
                                    </div>

                                    <div className=''>
                                        <label className="block text-sm font-medium mb-1">
                                            Whatsapp Numbers<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            disabled={true}
                                            className="w-full text-center border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                            value={'Whatsapp No.'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Map Key For Number<span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                            value={mobileNoKey}
                                            onChange={(e) => setMobileNoKey(e.target.value)}
                                        >
                                            <option value=''>Select</option>
                                            {
                                                column.map((item, index) =>
                                                    <option key={index} value={item}>{item}</option>)
                                            }
                                        </select>
                                    </div>
                                    {
                                        (selectedTempate?.headerType === 'TEXT' && selectedTempate?.headerValue?.example?.header_text?.length > 0) &&
                                        <>
                                            <div className=''>
                                                <label className="block text-sm font-medium mb-1">
                                                    Header Text Value<span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled={true}
                                                    className="w-full text-center border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    value={'{{1}}'}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Select Header Key<span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    value={headerDynamicState?.key}
                                                    onChange={handleHeaderChangeDropdown}
                                                >
                                                    <option value=''>Select</option>
                                                    {
                                                        column.map((item, index) =>
                                                            <option key={index} value={item}>{item}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </>
                                    }

                                    {
                                        (
                                            (selectedTempate?.headerType === 'IMAGE' || selectedTempate?.headerType === 'VIDEO' || selectedTempate?.headerType === 'DOCUMENT') && selectedTempate?.headerValue?.example?.header_handle?.length > 0) &&
                                        <>
                                            <div className=''>
                                                <label className="block text-sm font-medium mb-1">
                                                    Header URL Value<span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled={true}
                                                    className="w-full text-center border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    value={selectedTempate?.headerType + ' URL'}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium">
                                                    Select Header Key<span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    value={headerDynamicState?.key}
                                                    onChange={handleHeaderChangeDropdown}
                                                >
                                                    <option value=''>Select</option>
                                                    {
                                                        column.map((item, index) =>
                                                            <option key={index} value={item}>{item}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </>
                                    }

                                    {
                                        headerLocationkey.length > 0 &&
                                        <div className='col-span-full'>
                                            <h5>Header Location Key Mapping</h5>
                                            <p className='text-xs text-red-500 mb-2'>{'{{1}}' + " " + 'will replace with which column you have selected value'}</p>
                                            <DynamicForm items={headerLocationkey} column={column} selectedOptions={selectedLocationOptions} setSelectedOptions={setSelectedLocationOptions} />
                                        </div>
                                    }

                                    {
                                        (selectedTempate?.bodyValue?.example?.body_text[0].length > 0) &&
                                        <>
                                            <div className=''>
                                                <label className="block text-sm font-medium">
                                                    Body Value<span className="text-red-500">*</span>
                                                </label>
                                                {
                                                    selectedTempate?.bodyValue?.example?.body_text[0].map((item, index) =>
                                                        <input
                                                            type="text"
                                                            disabled={true}
                                                            className="w-full text-center border rounded my-1 px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            value={'{{' + (index + 1) + '}}'}
                                                            key={index}
                                                        />
                                                    )
                                                }

                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium">
                                                    Select Body Key<span className="text-red-500">*</span>
                                                </label>
                                                {
                                                    selectedTempate?.bodyValue?.example?.body_text[0].map((item, index) => <select
                                                        className="w-full border rounded px-3 my-[4px] py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                        value={bodyDynamicValue[index]?.key}
                                                        onChange={(e) => handleBodyChangeDropdown(e, index)}
                                                        key={index}
                                                    >
                                                        <option value=''>Select</option>
                                                        {
                                                            column.map((item, index) =>
                                                                <option key={index} value={item}>{item}</option>)
                                                        }
                                                    </select>)

                                                }
                                            </div>
                                        </>
                                    }

                                    {
                                        selectedTempate?.buttonValue?.buttons?.map((item, index) => {
                                            if (item?.type === 'URL' && item?.example?.length > 0) {
                                                return <>
                                                    <div className=''>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Button Dynamic URL Value<span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            disabled={true}
                                                            className="w-full text-center border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            value={item?.type + ' URL'}
                                                        />
                                                    </div>
                                                    <div className=''>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Button URL<span className="text-red-500">*</span>
                                                        </label>
                                                        <select
                                                            className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            value={buttonDynamicValue[index]?.key}
                                                            onChange={(e) => handleButtonsChangeDropdown(e, index, item?.type)}
                                                            key={index}
                                                        >
                                                            <option value=''>Select</option>
                                                            {
                                                                column.map((item, index) =>
                                                                    <option key={index} value={item}>{item}</option>)
                                                            }
                                                        </select>
                                                        {
                                                            !isValidUrl(buttonDynamicValue[index]?.text) && buttonDynamicValue[index]?.text?.length > 0 && <div className='text-[10px] mt-1 font-semibold text-red-600 ml-1'>Invalid URL</div>
                                                        }
                                                    </div>
                                                </>
                                            } else if (item?.type === 'COPY_CODE' && item?.example?.length > 0) {
                                                return <>
                                                    <div className=''>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Button Copy Code Value<span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            disabled={true}
                                                            className="w-full text-center border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            value={item?.type}
                                                        />
                                                    </div>
                                                    <div className=''>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Button Copy Code Value<span className="text-red-500">*</span>
                                                        </label>
                                                        <select
                                                            className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            value={buttonDynamicValue[index]?.key}
                                                            onChange={(e) => handleButtonsChangeDropdown(e, index, item?.type)}
                                                            key={index}
                                                        >
                                                            <option value=''>Select</option>
                                                            {
                                                                column.map((item, index) =>
                                                                    <option key={index} value={item}>{item}</option>)
                                                            }
                                                        </select>

                                                        {
                                                            buttonDynamicValue[index]?.text?.length > 14 && <div className='text-[10px] mt-1 font-semibold text-red-600 ml-1'>Code should be less 14</div>
                                                        }
                                                    </div>
                                                </>
                                            } else {
                                                return;
                                            }
                                        })
                                    }
                                </>
                            }
                        </div>

                        {/* Buttons */}
                        <div className='flex justify-evenly'>
                            <button
                                type="submit"
                                className="mt-4 mx-1 mb-2 w-[50%] bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={toggleDrawer}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="mt-4 mx-1 mb-2 w-[50%] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleManualSubmit}
                            >
                                Send Message
                            </button>
                        </div>
                    </div>

                    {/* Preview Container (30% width) */}
                    <div className="w-[25%] bg-gray-100 py-2 px-1 ml-2">
                        <h3 className="font-semibold text-sm mb-2">Template Preview</h3>
                        {
                            selectedTempate?.headerType === "IMAGE" &&
                            <img
                                src={headerDynamicState?.value || headerUrlValue || selectedTempate?.headerValue?.example?.header_handle[0]}
                                alt="Header" className="w-full h-[130px] border border-gray-300 object-fit rounded-t-lg mt-2" />
                        }

                        {
                            selectedTempate?.headerType === "VIDEO" && <video
                                src={headerDynamicState?.value || headerUrlValue || selectedTempate?.headerValue?.example?.header_handle[0]}
                                controls
                                className="w-full h-[130px] object-cover rounded-t-lg mt-2"
                                autoPlay={true}
                            />
                        }

                        {
                            selectedTempate?.headerType === "DOCUMENT" &&
                            <iframe
                                src={selectedTempate?.headerValue?.example?.header_handle[0]}
                                title="Document Preview"
                                className="w-full object-cover rounded-t-lg mt-2"
                                style={{
                                    overflow: 'hidden'
                                }}
                            />
                        }

                        <article className="text-wrap bg-white p-2 rounded-b-lg">
                            <p className='text-xs font-semibold break'>
                                {
                                    selectedTempate?.headerValue?.text?.replace(
                                        /{{(\d+)}}/g,
                                        (_, index) =>
                                            headerDynamicState.value || headerSampleValue || `{{${index}}}`
                                    )
                                }
                            </p>
                            <p
                                className='text-xs break-words'
                                dangerouslySetInnerHTML={
                                    {
                                        __html: transformString(selectedTempate?.bodyValue?.text ? selectedTempate?.bodyValue?.text?.replace(
                                            /{{(\d+)}}/g,
                                            (_, index) =>
                                                bodyDynamicValue[index - 1]?.value || bodySampleValue[index - 1] || `{{${index}}}`
                                        ) : "")
                                    }
                                }>
                            </p>
                            <p className='text-xs mt-2 text-gray-500 break'>{selectedTempate?.footer?.text}</p>
                            <p className='text-[10px] text-end '>9.00 PM</p>
                            <hr />
                            <hr />
                            <div className='px-2'>
                                {
                                    selectedTempate?.buttonValue?.buttons?.length > 0 &&
                                    selectedTempate?.buttonValue?.buttons.map((item, index) => {
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
            </div>
        </div>
    )
}

export default SendMessageForm;
