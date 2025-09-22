import React, { useEffect, useState } from 'react'
import { endPoints, HeaderTypeDropdown, LanguageDropdown, TemplateCategoryDropdown, UrlTypeDropdown } from '../utils/apiEndPoint';
import axiosInstance from '../utils/axios';
import { useToast } from "../context/ToastContext";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MdCancel, MdContentCopy } from 'react-icons/md';
import { FaCheck, FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa';
import logo from '../assets/whatsapp.png'
import { HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import { IoMdCall } from 'react-icons/io';
import { PiArrowBendUpLeft } from 'react-icons/pi';
import { useSelector } from 'react-redux';

const AddTemplate = ({ setOpenForm, openForm }) => {
    const { userData } = useSelector((state) => state.user)
    const showToast = useToast();
    const toggleDrawer = () => {
        setOpenForm(!openForm);
    };

    const urlData = UrlTypeDropdown;
    const languageData = LanguageDropdown;
    const headerData = HeaderTypeDropdown;
    const categoryData = TemplateCategoryDropdown;
    const [formData, setFormData] = useState({
        templateName: "",
        category: "",
        language: "",
        headerType: "",
        headerText: "",
        headerValues: [],
        tags: [],
        file: null,
        uploadProgress: 0,
        mediaId: "",
        inputValue: "",
        bodyTags: [],
        inputBodyValue: "",
        bodyValues: [],
        bodyText: "<p></p>",
        footerText: "",
        allButtonArray: [],
        buttonName: "",
        buttonCallString: "",
        buttonType: "",
        buttonUrlString: "",
        buttonUrlDynamicString: "",
        buttonOfferCodeString: "",
        urlType: urlData[0].name,
        templateId: "",
        currentButtonObject: {},
        isOpenUrlType: false,
        btnNameOfferCode: "Copy Offer Code",
        buttonNameError: "",
        templateSampleUrl: logo,
        editIndex: null,
    });
    const buttonData = [
        {
            id: 1,
            name: "Visit Website",
            count: 2,
            code: "URL",
            disabled:
                formData.allButtonArray.filter((button) => button.type === "URL")
                    .length >= 2,
        },
        {
            id: 2,
            name: "Call Phone Number",
            count: 1,
            code: "PHONE_NUMBER",
            disabled:
                formData.allButtonArray.filter((button) => button.type === "PHONE_NUMBER")
                    .length >= 1,
        },
        {
            id: 3,
            name: "Send Offer Code",
            count: 1,
            code: "COPY_CODE",
            disabled:
                formData.allButtonArray.filter((button) => button.type === "COPY_CODE")
                    .length >= 1,
        },
        // {
        //     "id": 4,
        //     "name": "Custom",
        //     "count": 10,
        //     "code": "QUICK_REPLY",
        //     "disabled": formData.allButtonArray.length >= 10
        // }
    ];;





    // Media File Upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, file });
        }
    };

    const handleFileUpload = async () => {
        if (!formData.file) {
            showToast('info', 'Please select a file to upload!');
            return;
        }

        const fileData = new FormData();
        fileData.append('file', formData.file);

        try {
            const response = await axiosInstance.post(
                endPoints.templateMediaUpload + `/${userData?.client?.id}`,
                fileData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = (progressEvent.loaded / progressEvent.total) * 100;
                        setFormData((prevState) => ({
                            ...prevState,
                            uploadProgress: progress,
                        }));
                    }
                },
            });
            if (response.data.status) {
                setFormData({
                    ...formData,
                    mediaId: response?.data?.data?.mediaId,
                })
                showToast('success', 'File uploaded successfully');
            } else {
                showToast('error', response.data.message || 'Something went wrong');
            }
        } catch (error) {
            console.log(error?.response?.data?.message);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    };


    useEffect(() => {
        // const regex = /{{\d+}}/g;
        let matches = formData.headerText.match(/{{\d+}}/g) ? formData.headerText.match(/{{\d+}}/g) : []
        let matches2 = formData.bodyText.match(/{{\d+}}/g) ? formData.bodyText.match(/{{\d+}}/g) : []

        setFormData({ ...formData, headerValues: matches, bodyValues: matches2 });
    }, [formData.headerText, formData.bodyText])

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (formData.inputValue.trim()) {
                const tags = formData.tags.filter(tag => tag !== formData.inputValue);
                setFormData({
                    ...formData,
                    tags: [...tags, formData.inputValue.trim()],
                    inputValue: ''
                });
            }

        }
    };


    const handleTagRemove = (tagToRemove) => {
        // setTags(tags.filter(tag => tag !== tagToRemove));
        setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
    };

    const handleInputKeyBodyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (formData.inputBodyValue.trim()) {
                setFormData({
                    ...formData,
                    bodyTags: [...formData.bodyTags, formData.inputBodyValue.trim()],
                    inputBodyValue: '',
                });
            }
        }
    };

    const handleBodyTagRemove = (tagToRemove) => {
        setFormData({ ...formData, bodyTags: formData.bodyTags.filter(tag => tag !== tagToRemove) });
    };

    const handleChange = (content, delta, source, editor) => {
        setFormData({ ...formData, bodyText: content });
    };

    function getTextLength(htmlString) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        const textContent = tempDiv.textContent || tempDiv.innerText || ""; // Handle browser compatibility
        // const cleanedText = textContent.replace(/\s+/g, ' ');
        return textContent.length;
    }



    const handleButtonAdd = () => {
        if (formData.buttonType === "PHONE_NUMBER") {
            if (formData.buttonName && formData.buttonCallString) {
                let currentButtonObject = {
                    "type": "PHONE_NUMBER",
                    "text": formData.buttonName,
                    "phone_number": "+910" + formData.buttonCallString
                }
                setFormData({ ...formData, allButtonArray: [...formData.allButtonArray, currentButtonObject], buttonName: "", buttonCallString: "", buttonType: "" });
            } else {
                showToast("info", "Please enter all fields");
            }

        } else if (formData.buttonType === "URL") {
            if (formData.buttonName && formData.buttonUrlString && formData.urlType) {
                if (formData.urlType == "DYNAMIC") {
                    let currentButtonObject = {
                        "type": "URL",
                        "text": formData.buttonName,
                        "url": formData.buttonUrlString + "/{{1}}",
                        "example": [
                            formData.buttonUrlDynamicString
                        ]
                    }
                    setFormData({ ...formData, allButtonArray: [...formData.allButtonArray, currentButtonObject], buttonName: "", buttonUrlString: "", buttonUrlDynamicString: "", buttonType: "", urlType: "STATIC" });
                } else {
                    let currentButtonObject = {
                        "type": "URL",
                        "text": formData.buttonName,
                        "url": formData.buttonUrlString
                    }
                    setFormData({ ...formData, allButtonArray: [...formData.allButtonArray, currentButtonObject], buttonName: "", buttonUrlString: "", buttonType: "", urlType: "STATIC" });
                }
            } else {
                showToast("info", "Please enter all fields");
            }
        } else if (formData.buttonType === "COPY_CODE") {
            if (formData.btnNameOfferCode && formData.buttonOfferCodeString) {
                let currentButtonObject = {
                    "type": "COPY_CODE",
                    "text": formData.btnNameOfferCode,
                    "example": [
                        formData.buttonOfferCodeString
                    ]
                }
                setFormData({ ...formData, allButtonArray: [...formData.allButtonArray, currentButtonObject], buttonOfferCodeString: "", buttonType: "", btnNameOfferCode: "" });
            } else {
                showToast("info", "Please enter all fields");
            }

        } else if (buttonType === "QUICK_REPLY") {
            if (btnNameOfferCode) {
                let currentButtonObject = {
                    "type": "QUICK_REPLY",
                    "text": buttonName
                }
                setFormData({ ...formData, allButtonArray: [...formData.allButtonArray, currentButtonObject], buttonName: "", buttonType: "" });
            } else {
                showToast("info", "Please enter all fields");
            }
        } else {
            showToast("info", "Please select button type");
        }
    }

    useEffect(() => {
        const hasDuplicateButtonName = formData.allButtonArray.some(
            (button) => button.text.toLowerCase() === formData.buttonName.toLowerCase()
        );
        if (hasDuplicateButtonName) {
            setFormData((prevData) => ({
                ...prevData,
                buttonNameError: "You can't enter the same text for multiple buttons."
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                buttonNameError: ''
            }));
        }

        // Cleanup function (optional)
        return () => {
            setFormData((prevData) => ({
                ...prevData,
                buttonNameError: ''
            }));
        };
    }, [formData.buttonName, formData.allButtonArray]);



    let headerJson = null
    let example = {}
    if (formData.headerType === "TEXT") {
        if (formData.headerValues.length > 0) {
            example = {
                "example": {
                    "header_text": [
                        ...formData.tags
                    ]
                }
            }
            headerJson = {
                "type": "HEADER",
                "format": "TEXT",
                "text": formData.headerText,
                ...example
            }
        } else {
            headerJson = {
                "type": "HEADER",
                "format": "TEXT",
                "text": formData.headerText,
            }
        }

    } else if (formData.headerType === "IMAGE") {
        if (formData.headerType.length > 0) {
            example = {
                "example": {
                    "header_handle": [
                        formData.mediaId
                    ]
                }
            }
            headerJson = {
                "type": "HEADER",
                "format": "IMAGE",
                ...example
            }
        }
    } else if (formData.headerType === "VIDEO") {
        if (formData.headerType.length > 0) {
            example = {
                "example": {
                    "header_handle": [
                        formData.mediaId
                    ]
                }
            }
            headerJson = {
                "type": "HEADER",
                "format": "VIDEO",
                ...example
            }
        }
    } else if (formData.headerType === "DOCUMENT") {
        if (formData.headerType.length > 0) {
            example = {
                "example": {
                    "header_handle": [
                        formData.mediaId
                    ]
                }
            }
            headerJson = {
                "type": "HEADER",
                "format": "DOCUMENT",
                ...example
            }
        }
    } else if (formData.headerType === "LOCATION") {

    } else {

    }

    function cleanHtml(html) {
        html = html.replace(/<\/?strong>/g, '*');
        html = html.replace(/<\/?em>/g, '_');
        html = html.replace(/<\/?s>/g, '~');

        html = html.replaceAll("</p><p>", '\n');
        html = html.replaceAll("<p>", '');
        html = html.replaceAll("</p>", '');
        html = html.replace(/<\/?em>/g, '_');
        html = html.replace(/<[^>]+>/g, '');
        return html;
    }
    let bodyJson = null
    let exampleBody = {}
    if (formData.bodyText) {
        if (formData.bodyValues.length > 0) {
            exampleBody = {
                "example": {
                    "body_text": [
                        formData.bodyTags
                    ]
                }
            }
            bodyJson = {
                "type": "BODY",
                "text": cleanHtml(formData.bodyText),
                ...exampleBody
            }

        } else {
            bodyJson = {
                "type": "BODY",
                "text": cleanHtml(formData.bodyText),
            }
        }

    }

    let footerJson = null
    if (formData.footerText) {
        footerJson = {
            "type": "FOOTER",
            "text": formData.footerText
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(
            !formData.templateName ||
            !formData.category ||
            !formData.language ||
            !formData.bodyText
            // (formData.headerType === 'TEXT' && !formData.headerText) ||
            // (formData.buttonType !== 'NONE' && formData.allButtonArray.length === 0)
            // ((formData.headerType === 'IMAGE' || formData.headerType === 'VIDEO' || formData.headerType === 'DOCUMENT' ) && !formData.mediaId)
        );
        
        try {
            if (
                !formData.templateName ||
                !formData.category ||
                !formData.language ||
                !formData.bodyText
                // (formData.headerType === 'TEXT' && !formData.headerText) ||
                // (formData.buttonType !== 'NONE' && formData.allButtonArray.length === 0)
                // ((formData.headerType === 'IMAGE' || formData.headerType === 'VIDEO' || formData.headerType === 'DOCUMENT' ) && !formData.mediaId)
    
            ) {
                showToast('info', 'Please fill in all required fields.');
            } else {
                const data = {
                    clientId: userData?.client?.id,
                    templateName: formData.templateName,
                    templateCategory: formData.category,
                    templateLang: formData.language,
                    headerType: formData.headerType,
                    headerValue: headerJson,
                    bodyValue: bodyJson,
                    footerValue: footerJson,
                    buttonValue: formData.allButtonArray.length > 0 ? {
                        "type": "BUTTONS",
                        "buttons": formData.allButtonArray
                    } : {},
                    mediaUrl: (formData.headerType == "TEXT" || formData.headerType.length == 0) ? "" : formData.templateSampleUrl,
                    mediaId: formData.mediaId,
                }
                const response = await axiosInstance.post(endPoints.template, data)
                if (response.data.status) {
                    
                }
                console.log('data', response.data);
    
            };
        } catch (error) {
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }


    const addHeaderVariable = () => {
        console.log("formData.headerValues.length", formData.headerValues.length);

        if (formData.headerValues.length > 0) {
            return;
        }
        setFormData({
            ...formData,
            headerText: formData.headerText += "{{1}}"
        })

    }
    const addBodyVariable = () => {
        if (formData.bodyValues.length < 10) {
            setFormData({
                ...formData,
                bodyText: formData.bodyText.replace(/(<br>)?<\/p>$/, ` {{${formData.bodyValues.length + 1}}}</p>`)
            });
        }
    };

    const handleInputBodyChange = (e) => {
        setFormData({
            ...formData,
            inputBodyValue: e.target.value,
        });
    };

    const startEditTag = (index) => {
        setFormData({
            ...formData,
            editIndex: index,
            inputBodyValue: formData.bodyTags[index],
        });
    };

    const saveEditTag = (index) => {
        const updatedTags = [...formData.bodyTags];
        updatedTags[index] = formData.inputBodyValue.trim();

        setFormData({
            ...formData,
            bodyTags: updatedTags,
            editIndex: null,
            inputBodyValue: '',
        });
    };

    const handleEditKeyBodyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEditTag(index);
        }
    };

console.log("formData", formData);


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
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Create Template</h2>
                            <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={toggleDrawer}
                            >
                                ✖
                            </button>
                        </div>

                        {/* Form */}
                        {/* <form> */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
                            {/* Template Name */}
                            <div className=''>
                                <label className="block text-sm font-medium mb-1">
                                    Template Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Template Name"
                                    maxLength={512}
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.templateName}
                                    onChange={(e) => setFormData({ ...formData, templateName: e.target.value.replaceAll(' ', '_') })}
                                />
                                <p className='text-[10px] mt-2 font-semibold text-red-600 ml-1'>{formData.templateName.length}/512</p>
                            </div>
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Category<span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >

                                    <option value=''>Select</option>
                                    {
                                        categoryData.map((item, index) => <option key={index} value={item.name}>{item.name}</option>)
                                    }
                                </select>
                            </div>
                            {/* Header Type */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Header Type
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.headerType}
                                    onChange={(e) => setFormData({ ...formData, headerType: e.target.value })}
                                >
                                    {
                                        headerData.map((item, index) => <option key={index} value={item.name}>{item.name}</option>)
                                    }
                                </select>
                            </div>
                            {/* Language */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Select Language<span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                >
                                    <option value=''>Select</option>
                                    {
                                        languageData.map((item, index) => <option key={index} value={item.code}>{item.name}</option>)
                                    }
                                </select>
                            </div>

                            {
                                formData.headerType === 'TEXT' &&
                                <div className='col-span-full'>
                                    <label className="block text-sm font-medium mb-1">
                                        Header Text<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Header Text"
                                        maxLength={60}
                                        className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                        value={formData.headerText}
                                        onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
                                    />
                                    <p className='text-[10px] mt-2 font-semibold  ml-1 flex justify-between'>
                                        <span className='text-red-600'>
                                            {formData.headerText.length}/60
                                            {
                                                formData.headerValues.length > 1 && <span className='text-[10px] font-semibold text-red-600 ml-1'>In Header text only 1 dynamic value is allowed</span>
                                            }
                                        </span>


                                        <span
                                            className={`${formData.headerValues < 1 ? "cursor-pointer" : "cursor-not-allowed text-gray-400"}`}
                                            onClick={addHeaderVariable}

                                        >
                                            Add Variable
                                        </span>
                                    </p>
                                </div>
                            }

                            {
                                (formData.headerType == "IMAGE" || formData.headerType == "VIDEO" || formData.headerType == "DOCUMENT") &&
                                <div className="">
                                    <label className="block text-sm font-medium mb-1">
                                        Upload File<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        className="w-full border rounded px-3 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                                        onChange={handleFileChange}
                                    />

                                    {/* Progress Bar */}
                                    {formData.uploadProgress > 0 && (
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-200 rounded-full">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: `${formData.uploadProgress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{Math.round(formData.uploadProgress)}% Uploading</p>
                                        </div>
                                    )}
                                </div>
                            }
                            {
                                (formData.headerType == "IMAGE" || formData.headerType == "VIDEO" || formData.headerType == "DOCUMENT") &&
                                <div className="">
                                    <button
                                        type="button"
                                        className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        onClick={handleFileUpload}
                                    >
                                        Upload File
                                    </button>
                                </div>
                            }

                            {
                                (formData.headerValues.length > formData.tags.length && formData.headerType === "TEXT") &&
                                <div className="col-span-full">
                                    <div className="flex flex-wrap items-center mt-0">
                                        <label htmlFor="input-label" className="block text-sm mb-1 font-medium">
                                            <span className="text-sm text-red-500 font-medium">* </span>Sample Header Value
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.inputValue}
                                            onChange={(e) => setFormData({ ...formData, inputValue: e.target.value })}
                                            onKeyDown={handleInputKeyDown}
                                            className="border border-gray-400 rounded-md h-8 text-sm p-2 w-full outline-none"
                                            placeholder="Enter Sample Header Value"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            }
                            {
                                formData.tags.map((tag, index) => (
                                    <div key={index} className="bg-gray-200 max-w-max rounded-full px-3 py-0 mr-2 mb-2 flex items-center">
                                        <span>{tag}</span>
                                        <button onClick={() => handleTagRemove(tag)} className="ml-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M10 0c-5.522 0-10 4.477-10 10s4.478 10 10 10 10-4.477 10-10-4.478-10-10-10zm4.95 13.536c.39.39.39 1.023 0 1.414-.391.39-1.024.39-1.415 0l-3.536-3.535-3.535 3.535c-.391.39-1.024.39-1.415 0-.39-.391-.39-1.024 0-1.414l3.535-3.536-3.535-3.535c-.39-.391-.39-1.024 0-1.415.391-.39 1.024-.39 1.415 0l3.536 3.535 3.535-3.535c.391-.39 1.024-.39 1.415 0 .39.391.39 1.024 0 1.415l-3.535 3.536 3.535 3.535z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}


                            <div className='col-span-full'>
                                <label className="block text-sm font-medium mb-1">
                                    Body Text<span className="text-red-500">*</span>
                                </label>
                                <ReactQuill
                                    value={formData.bodyText}
                                    onChange={handleChange}
                                    className={`mt-0"}`}
                                    modules={{
                                        toolbar: [
                                            ['bold', 'italic', 'strike'],
                                        ]
                                    }}
                                    formats={[
                                        'header', 'font', 'size',
                                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                                        'list', 'bullet',
                                        'link', 'image', 'video'
                                    ]}
                                />
                                <p className='text-[10px] mt-2 font-semibold ml-1 flex justify-between'>
                                    <span className='text-red-600'>
                                        {getTextLength(formData.bodyText)}/1024
                                    </span>

                                    <span
                                        className={`${formData.bodyValues.length >= 10 ? "cursor-not-allowed text-gray-400" : "cursor-pointer"}`}
                                        onClick={addBodyVariable}
                                    >
                                        Add Variable
                                    </span>
                                </p>
                            </div>


                            {formData.bodyValues.length > formData.bodyTags.length && (
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium mb-1">
                                        Sample Body Value<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.inputBodyValue}
                                        onChange={handleInputBodyChange}
                                        onKeyDown={handleInputKeyBodyDown}
                                        className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="Enter Sample Body Value"
                                        autoComplete="off"
                                    />
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {formData.bodyTags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-200 rounded-full px-3 py-1 flex items-center"
                                    >
                                        {formData.editIndex === index ? (
                                            <input
                                                type="text"
                                                value={formData.inputBodyValue}
                                                onChange={handleInputBodyChange}
                                                onKeyDown={(e) => handleEditKeyBodyDown(e, index)}
                                                onBlur={() => saveEditTag(index)}
                                                className="max-w-max border rounded px-1 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                                                autoFocus
                                            />
                                        ) : (
                                            <>
                                                <span onDoubleClick={() => startEditTag(index)} className="cursor-pointer">{`{{${index + 1}}} ===> `} </span>
                                                <span
                                                    onDoubleClick={() => startEditTag(index)}
                                                    className="cursor-pointer"
                                                >
                                                    {tag}
                                                </span>
                                                <button
                                                    onClick={() => handleBodyTagRemove(tag)}
                                                    className="ml-2"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 0c-5.522 0-10 4.477-10 10s4.478 10 10 10 10-4.477 10-10-4.478-10-10-10zm4.95 13.536c.39.39.39 1.023 0 1.414-.391.39-1.024.39-1.415 0l-3.536-3.535-3.535 3.535c-.391.39-1.024.39-1.415 0-.39-.391-.39-1.024 0-1.414l3.535-3.536-3.535-3.535c-.39-.391-.39-1.024 0-1.415.391-.39 1.024-.39 1.415 0l3.536 3.535 3.535-3.535c.391-.39 1.024-.39 1.415 0 .39.391.39 1.024 0 1.415l-3.535 3.536 3.535 3.535z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))}

                                {
                                    formData.bodyTags.length > 0 && <p className='text-[10px] mt-2 font-semibold text-red-600 ml-1'>Note. You can edit also on double click</p>
                                }
                            </div>



                            {/* {
                                formData.bodyValues.length > formData.bodyTags.length && <div className='col-span-full'>
                                    <label className="block text-sm font-medium mb-1">
                                        Sample Body Value<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.inputBodyValue}
                                        onChange={(e) => setFormData({ ...formData, inputBodyValue: e.target.value })}
                                        onKeyDown={handleInputKeyBodyDown}
                                        className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="Enter Sample Body Value"
                                        autoComplete='off'
                                    />
                                </div>
                            }
                            {formData.bodyTags.map((tag, index) => (
                                <div key={index} className="bg-gray-200 max-w-max rounded-full px-3 py-0 mr-2 mb-2 mt-2 flex items-center">
                                    <span>{tag}</span>
                                    <button onClick={() => handleBodyTagRemove(tag)} className="ml-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 0c-5.522 0-10 4.477-10 10s4.478 10 10 10 10-4.477 10-10-4.478-10-10-10zm4.95 13.536c.39.39.39 1.023 0 1.414-.391.39-1.024.39-1.415 0l-3.536-3.535-3.535 3.535c-.391.39-1.024.39-1.415 0-.39-.391-.39-1.024 0-1.414l3.535-3.536-3.535-3.535c-.39-.391-.39-1.024 0-1.415.391-.39 1.024-.39 1.415 0l3.536 3.535 3.535-3.535c.391-.39 1.024-.39 1.415 0 .39.391.39 1.024 0 1.415l-3.535 3.536 3.535 3.535z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))} */}

                            <div className='col-span-full'>
                                <label className="block text-sm font-medium mb-1">
                                    Footer Text
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Footer Text"
                                    maxLength={60}
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.footerText}
                                    onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                                />
                                <p className='text-[10px] mt-2 font-semibold text-red-600 ml-1'>{formData.footerText.length}/60</p>
                            </div>


                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Select Button
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.buttonType}
                                    onChange={(e) => setFormData({ ...formData, buttonType: e.target.value })}
                                >
                                    <option value=''>None</option>
                                    {
                                        buttonData.map((item, index) => <option key={index} value={item.code} disabled={item.disabled} className={`${item.disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>{item.name}</option>)
                                    }
                                </select>
                            </div>
                            <div className="">
                                {
                                    formData.buttonType &&
                                    <button
                                        type="button"
                                        className={`mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${formData.buttonNameError.length > 0 ? " cursor-not-allowed" : "cursor-pointer"} `}
                                        onClick={handleButtonAdd}
                                    >
                                        Add Button
                                    </button>
                                }
                            </div>


                            {
                                formData.buttonType === "URL" && <>
                                    {/* <div className='flex gap-2 mt-3'> */}
                                    <div className=''>

                                        <label htmlFor="input-label" className="block text-sm mb-1 font-medium">Button Name<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            autoComplete='off'
                                            value={formData.buttonName}
                                            maxLength={25} id="input-label"
                                            onChange={(e) => setFormData({ ...formData, buttonName: e.target.value || "Visit Website" })}
                                            className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                            placeholder="Enter Template Name" />
                                        <p className='text-[10px] mt-2 font-semibold text-red-600 ml-1'>{formData.buttonName.length}/25 {formData.buttonNameError}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Url Type<span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                            value={formData.urlType || "STATIC"}
                                            onChange={(e) => setFormData({ ...formData, urlType: e.target.value })}
                                        >
                                            {
                                                urlData.map((item, index) => <option key={index} value={item.name} className={`${item.disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>{item.name}</option>)
                                            }
                                        </select>
                                    </div>


                                    <div className='col-span-full'>
                                        <label htmlFor="input-label" className="block text-sm mb-1 font-medium">Website URL<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            autoComplete='off'
                                            value={formData.buttonUrlString}
                                            id="input-label" maxLength={2000}
                                            onChange={(e) => setFormData({ ...formData, buttonUrlString: e.target.value })}
                                            className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                            placeholder={formData.urlType == "STATIC" ? "https://www.example.com" : "https://www.example.com/{{1}}"} />
                                        <p className='text-[10px] mt-2 font-semibold text-red-600 ml-1'>{formData.buttonUrlString.length}/2000</p>
                                    </div>
                                    {
                                        formData.urlType == "DYNAMIC" && formData.buttonUrlString &&
                                        <div className='col-span-full'>
                                            <label htmlFor="input-label" className="block text-sm mb-0 font-medium"><span className='text-sm text-red-500 font-medium'>*</span>Add sample URL</label>
                                            <label htmlFor="input-label" className="block text-xs mb-1 font-medium">To help us review your message template, please add an example of the website URL. Do not use real customer information.</label>
                                            <input
                                                type="text"
                                                autoComplete='off'
                                                value={formData.buttonUrlDynamicString}
                                                id="input-label" maxLength={2000}
                                                onChange={(e) => setFormData({ ...formData, buttonUrlDynamicString: e.target.value })}
                                                className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                placeholder={`Enter full URL for ${formData.buttonUrlString}` + "/{{1}}"} />
                                        </div>
                                    }




                                </>
                            }

                            {
                                formData.buttonType === "PHONE_NUMBER" &&
                                <div className=''>
                                    <label className="block text-sm font-medium mb-1">
                                        Button Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Button Name"
                                        maxLength={25}
                                        className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                        value={formData.buttonName}
                                        onChange={(e) => setFormData({ ...formData, buttonName: e.target.value })}
                                    />
                                    <p className='text-[10px] mt-2 font-semibold text-red-600 ml-1'>{formData.buttonName.length}/25 {formData.buttonNameError}</p>
                                </div>
                            }
                            {
                                formData.buttonType === "PHONE_NUMBER" &&
                                <div className=''>
                                    <label className="block text-sm font-medium mb-1">
                                        Phone Number (9199887766)<span className="text-red-500">*</span> <span className='text-red-500'>India Only</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Phone No"
                                        maxLength={10}
                                        className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                        value={formData.buttonCallString}
                                        onChange={(e) => setFormData({ ...formData, buttonCallString: e.target.value })}
                                    />
                                    <p className='text-[10px] mt-2 font-semibold text-red-600 ml-1'>{formData.buttonCallString.length}/10</p>
                                </div>
                            }
                            {
                                formData.buttonType === "COPY_CODE" &&
                                <div className=''>
                                    <label className="block text-sm font-medium mb-1">
                                        Button Name
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={25}
                                        disabled={true}
                                        className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                        value={formData.btnNameOfferCode}
                                    />
                                </div>
                            }
                            {
                                formData.buttonType === "COPY_CODE" &&
                                <div className=''>
                                    <label className="block text-sm font-medium mb-1">
                                        Offer Code (XXHA25)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Offer Code"
                                        maxLength={15}
                                        className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                        value={formData.buttonOfferCodeString}
                                        onChange={(e) => setFormData({ ...formData, buttonOfferCodeString: e.target.value })}
                                    />
                                    <p className='text-[10px] mt-2 font-semibold text-red-600 ml-1'>{formData.buttonOfferCodeString.length}/15</p>
                                </div>
                            }

                            {
                                formData.allButtonArray.length > 0 &&
                                <div className="col-span-full">
                                    <table className="table-auto w-full bg-white shadow-md rounded-lg ">
                                        <thead>
                                            <tr className="text-left text-sm">
                                                <th className="px-4 py-2 text-center">Action</th>
                                                <th className="px-4 py-2">Type</th>
                                                <th className="px-4 py-2">Button Text</th>
                                                <th className="px-4 py-2">Url Type</th>
                                                <th className="px-4 py-2 text-center">URL/Phone No</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                formData.allButtonArray.map((item, index) =>
                                                    <tr key={index} className="border-b h-max">
                                                        <td className="h-full px-4 py-1 flex justify-center items-center gap-2">
                                                            <FaTrash
                                                                className="cursor-pointer text-sm text-red-500"
                                                                onClick={() => setFormData({ ...formData, allButtonArray: formData.allButtonArray.filter((items, i) => i !== index) })}
                                                            />
                                                            <FaEdit
                                                                className="cursor-pointer text-sm text-green-500"
                                                                onClick={() => {
                                                                    // setFormData({ ...formData, buttonName: item?.text, buttonType: item?.type, allButtonArray: formData.allButtonArray.filter((_, i) => i !== index) });
                                                                    if (item?.type === "URL") {
                                                                        setFormData({ ...formData, buttonUrlString: item?.url, buttonName: item?.text, buttonType: item?.type, urlType: item?.example?.length > 0 ? "DYNAMIC" : "STATIC", allButtonArray: formData.allButtonArray.filter((_, i) => i !== index) });
                                                                    } else if (item?.type === "PHONE_NUMBER") {
                                                                        setFormData({ ...formData, buttonCallString: item?.phone_number?.substring(4), buttonName: item?.text, buttonType: item?.type, allButtonArray: formData.allButtonArray.filter((_, i) => i !== index) });
                                                                    } else if (item?.type === "QUICK_REPLY") {
                                                                        setFormData({ ...formData, buttonOfferCodeString: item?.text, buttonName: item?.text, buttonType: item?.type, allButtonArray: formData.allButtonArray.filter((_, i) => i !== index) });
                                                                    }
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-1 text-sm">{item?.type}</td>
                                                        <td className="px-4 py-1 text-sm">{item?.text}</td>
                                                        <td className="px-4 py-1 text-sm">{(item?.example?.length > 0 && item?.type == "URL") ? "Dynamic" : item?.type == "URL" ? "Static" : "-"}</td>
                                                        <td className="px-4 py-1 text-sm">{(item?.phone_number) || item?.example && item?.example[0] || (item?.url?.substring(0, 25) + '...') || "-"}</td>
                                                    </tr>
                                                )
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            }




                            {/* Submit Button */}
                            {/* <div>
                                <button
                                    type="submit"
                                    className="mt-4 mb-2 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={toggleDrawer}
                                >
                                    Cancel
                                </button>
                            </div> */}
                        </div>


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
                                onClick={handleSubmit}
                            >
                                Create Template
                            </button>
                        </div>
                        {/* </form> */}
                    </div>

                    {/* Preview Container (30% width) */}
                    <div className="w-[25%] bg-gray-100 py-2 px-1 ml-2">
                        <h3 className="font-semibold text-sm mb-2">Template Preview</h3>
                        {
                            formData.headerType === "IMAGE" &&
                            <img
                                src={formData.templateSampleUrl}
                                alt="Header" className="w-full h-[130px] object-cover rounded-t-lg mt-2" />
                        }

                        {
                            formData.headerType === "VIDEO" && <video
                                src={formData?.templateSampleUrl || `/templateMedia/20240516210346404.mp4`}
                                controls
                                className="w-full h-[130px] object-cover rounded-t-lg mt-2"
                                autoPlay={true}
                            />
                        }

                        <article className="text-wrap bg-white p-2 rounded-b-lg">
                            <p className='text-xs font-semibold break'>{formData.headerText.replace(/{{(\d+)}}/g, (_, index) => formData.tags[index - 1] || `{{${index}}}`)}</p>
                            <p className='text-xs break-words' dangerouslySetInnerHTML={{ __html: formData.bodyText.replace(/{{(\d+)}}/g, (_, index) => formData.bodyTags[index - 1] || `{{${index}}}`) }}></p>
                            <p className='text-xs mt-2 text-gray-500 break'>{formData.footerText}</p>
                            <p className='text-[10px] text-end '>9.00 PM</p>
                            <hr />
                            <hr />
                            <div className='px-2'>

                                {
                                    formData.allButtonArray.length > 0 && formData.allButtonArray.map((item, index) => {
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

export default AddTemplate;
