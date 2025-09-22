import React, { useEffect, useRef, useState } from "react";
import { FiBold } from "react-icons/fi";
import { GoItalic, GoStrikethrough } from "react-icons/go";
// import { Mention } from "primereact/mention";
import { MentionsInput, Mention } from "react-mentions";
import { JsonView } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { useToast } from "../../context/ToastContext";
import axiosInstance from "../../utils/axios";
import axios from "axios";
import { endPoints } from "../../utils/apiEndPoint";
const AddAPIScript = ({ botId, isAPIOpen, setIsAPIOpen, data = {}, setCurrentScript, getScript }) => {
  const showToast = useToast()
  const [activeSubTypeTab, setActiveSubTypeTab] = useState('TEXT');
  const toggleDrawer = () => {
    setIsAPIOpen(!isAPIOpen);
    setCurrentScript({});
  };

  
  const [formData, setFormData] = useState({
    id: data?._id,
    botId: botId,
    messageType: data?.messageType || "API_DATA",
    messageSubType: activeSubTypeTab,
    variableName: data?.variableName || "",
    messageDraft: data?.messageDraft || "",
    redirectId: data?.redirectId || "000000000000000000000000",
    waitTime: Number(data?.waitTime) || 0,
    validationType: data?.validationType || "",
    expectedMessage: data?.expectedMessage || "",
    prevRedirectId: data?.prevRedirectId || "000000000000000000000000",
    listButtonName: data?.listButtonName || "",
    apiUrl: data?.apiUrl || "",
    method: data?.method || "GET",
    headerParams: data?.headerParams ? data?.headerParams : {},
    bodyParams: data?.bodyParams ? JSON.stringify(data?.bodyParams) : "{}",
    sampleDataKey: data?.sampleDataKey ? JSON.stringify(data?.sampleDataKey) : JSON.stringify({
      id: "",
      name: "",
      data: "",
      desc: "",
      fileUrl: "",
    }, null, 2)
  });

  const handleSubmitqqq = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    toggleDrawer();
  };
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [trigger, setTrigger] = useState("");
  const textareaRef = useRef(null);
  const suggestionRef = useRef(null);
  const [mentionData, setMentionData] = useState([]);
  // Sample people data

  // Handle input change
  const handleChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    setFormData({ ...formData, messageDraft: inputValue });
    // Check for @ or # triggers
    const lastWord = inputValue.split(" ").pop();
    if (lastWord.startsWith("@") || lastWord.startsWith("#")) {
      const searchValue = lastWord.slice(1).toLowerCase();
      setTrigger(lastWord[0]);
      setSuggestions(
        mentionData.filter((person) => person.toLowerCase().includes(searchValue))
      );
    } else {
      setSuggestions([]);
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion) => {
    const words = value.split(" ");
    words.pop();
    const updatedValue = `${words.join(" ")} ${trigger}${suggestion.replace(
      /\s+/g,
      "_"
    )}# `;
    setValue(updatedValue);
    setSuggestions([]);

    // Focus back on textarea and move the cursor to the end
    textareaRef.current.focus();
    setTimeout(() => {
      textareaRef.current.setSelectionRange(
        updatedValue.length,
        updatedValue.length
      );
    }, 0);
  };

  // Handle clicks outside of the suggestion box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [jsonValue, setJsonValue] = useState('');
  const [error, setError] = useState(null);
  const [error2, setError2] = useState(null);
  const [error3, setError3] = useState(null);

  // Handle JSON changes
  const hitAPI = async (method = "GET", apiUrl) => {
    try {
      if (!apiUrl) {
        showToast("info", "Please provide API URL!");
        return;
      }
      const response = await axios[method.toLowerCase()](apiUrl, JSON.parse(formData.bodyParams))
      console.log('response', response.data);
      
      const data = response?.data?.data;
      let suggestion = [];
      Object.keys(response?.data).forEach((key) => {
        suggestion.push(key)
      })
      Object.keys(data[0]).forEach((key) => {
        suggestion.push(key)
      })
      setMentionData(suggestion)
      setJsonValue(JSON.stringify(response.data, null, 2));
    } catch (error) {
      showToast("error", error.message);
    }
  }
  const handleFormatJson = () => {
    try {
      const formattedJson = JSON.stringify(JSON.parse(jsonValue), null, 2);
      setJsonValue(formattedJson);
      setError(null);
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  const handleChangeSampleKey = (key, value) => {
    setFormData({
      ...formData,
      sampleDataKey: {
        ...formData.sampleDataKey,
        [key]: value,
      },
    })
  }
  const handleJsonChange = (e) => {
    const inputValue = e.target.value;
    setJsonValue(inputValue);
    try {
      // Validate JSON
      JSON.parse(inputValue);
      setError(null);
    } catch (err) {
      setError("Invalid JSON format");
    }
  };
  const handleBodyParamsJsonChange = (e) => {
    const inputValue = e.target.value;
    setFormData({
      ...formData,
      bodyParams: inputValue
    });
    try {
      JSON.parse(inputValue);
      setError2(null);
    } catch (err) {
      setError2("Invalid JSON format");
    }
  };
  const handleSampleKeyJsonChange = (e) => {
    const inputValue = e.target.value;
    setFormData({
      ...formData,
      sampleDataKey: inputValue
    });
    try {
      JSON.parse(inputValue);
      setError3(null);
    } catch (err) {
      setError3("Invalid JSON format");
    }
  };
  const variables = [
    'NAME',
    'MOBILE_NO',
    'EMAIL',
    "SELECTED_CITY",
    "DEPARTMENT",
    "DESIGNATION",
    "SELECTED_COUNTRY",
    "SELECTED_STATE",
    "SELECTED_DISTRICT",
    "SELECTED_TALUK",
    "SELECTED_VILLAGE",
    "SELECTED_PINCODE",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.botId ||
        !formData.messageType ||
        !formData.messageSubType ||
        !formData.expectedMessage
      ) {
        showToast('info', 'Please fill in all required fields.');
      }
      const response = await axiosInstance.post(endPoints.script, {
        ...formData,
        bodyParams: JSON.parse(formData.bodyParams),
        sampleDataKey: JSON.parse(formData.sampleDataKey),
        headerParams: formData.headerParams,

      });
      if (response?.data?.status) {
        showToast('success', 'Added Successfully!');
      } else {
        showToast('error', response.data.message);
      }
      getScript();
      toggleDrawer();
    } catch (error) {
      console.log('Error in Adding Button Script', error);
      showToast('error', error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      {isAPIOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleDrawer}
        ></div>
      )}

      <div
        className={`
                    fixed inset-0 flex items-center justify-center z-50 transition-transform
                    ${isAPIOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 pointer-events-none"
          }`}
      >
        <div className="bg-white w-full max-w-lg mx-4 sm:mx-auto rounded-lg shadow-lg p-6 overflow-y-auto h-[80%]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">
              {Object.keys(data).length
                ? "Update Text Script"
                : "Add Text Script"}
            </h2>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={toggleDrawer}
            >
              ✖
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* API Endpoint */}
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-1">
                API Endpoint<span className="text-red-500"></span>
              </label>
              <input
                type="text"
                placeholder="Enter your API Endpoint URL"
                className="w-full text-sm border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                value={formData.apiUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    apiUrl: e.target.value.replaceAll(" ", "_"),
                  })
                }
              />
              <p className="text-[9px] mt-1 font-semibold text-red-600 ml-1">
                URL
              </p>
            </div>
            {/* Body Payload */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Payload:
              </label>
              <textarea
                value={formData.bodyParams || ""}
                onChange={handleBodyParamsJsonChange}
                // disabled={true}
                rows={4}
                className="w-full border border-gray-300 rounded p-2 font-mono text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="JSON Response..."
              ></textarea>

              {/* Error Message */}
              {error2 && <p className="text-red-500 text-sm mt-2">{error2}</p>}
            </div>
            {/* Method */}
            <div className="">
              <label className="block text-sm font-medium mb-1">
                Select Method<span className="text-red-500">*</span>
              </label>

              <select
                className="w-full text-sm border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                value={formData?.method || "GET"}
                onChange={(e) =>
                  setFormData({ ...formData, method: e.target.value })
                }
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            {/* Request API Button */}
            <div className="">
              <label className="block text-sm font-medium mb-1">
                Request API<span className="text-red-500">*</span>
              </label>

              <button
                onClick={() => hitAPI(formData.method, formData.apiUrl)}
                className="bg-blue-500 w-full text-sm text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Hit API
              </button>
            </div>
            {/* Response Data */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Data:
              </label>

              <textarea
                value={jsonValue}
                // onChange={handleJsonChange}
                disabled={true}
                rows={8}
                className="w-full border border-gray-300 rounded p-2 font-mono text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="JSON Response..."
              ></textarea>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Sample Data */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Map for Future use <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.sampleDataKey || ""}
                onChange={handleSampleKeyJsonChange}
                // disabled={true}
                rows={6}
                className="w-full  border border-gray-300 rounded p-2 font-mono text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="JSON Response..."
              ></textarea>

              {/* Error Message */}
              {error3 && <p className="text-red-500 text-sm mt-2">{error3}</p>}
            </div>
            {/* Map Sample Data DropDown*/}
            {/* <div className='col-span-full' >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Map Data:
              </label>
              {
                Object.keys(formData?.sampleDataKey).map((item, index) => (
                  <div className='bg-gray-300 p-2 rounded-md' key={index}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2  p-2 rounded-sm bg-gray-100' key={index}>
                      <div className='' >
                        <label className="block text-sm font-medium">
                          {item}<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder=""
                          maxLength={24}
                          disabled={true}
                          className="w-full text-sm border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                          value={item}
                        // onChange={(e) => handleChangeSampleKey(item, e.target.value)}
                        />
                      </div>

                      <div className="">
                        <label className=" text-sm font-medium flex justify-between">
                          {item}<span className="text-red-500">
                          </span>
                        </label>

                        <div className="relative">
                          <select
                            className="w-full text-sm border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                            value={formData?.sampleDataKey[item]}
                            onChange={(e) => handleChangeSampleKey(item, e.target.value)}
                          >
                            <option value="">Select</option>
                            {
                              mentionData.map((suggestion, index) => {
                                return (
                                  <option key={index} value={suggestion}>
                                    {suggestion}
                                  </option>
                                )
                              }
                              )
                            }
                          </select>
                        </div>


                      </div>
                    </div>
                  </div>

                ))
              }
            </div> */}
            {/* Message Content */}
            <div className="col-span-full flex justify-center border-b border-gray-300">
              {['TEXT', 'LIST', 'DOCUMENT'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTypeTab(tab)}
                  className={`px-4 py-2 text-sm font-medium ${activeSubTypeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500 hover:text-blue-500'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {
              activeSubTypeTab === 'LIST' && (
                <div className="col-span-full">
                  <label className="block text-sm font-medium mb-1">
                    List Button Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="List Button Title"
                    maxLength={24}
                    className="w-full border rounded px-3 py-2 text-sm  focus:ring-1 focus:ring-blue-500 outline-none"
                    value={formData.listButtonName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        listButtonName: e.target.value,
                      })
                    }
                  />
                  <p className="text-[9px] mt-1 font-semibold text-red-600 ml-1">
                    {formData.listButtonName.length}/24
                  </p>
                </div>
              )
            }
            <div className="col-span-full relative">
              <label className="block text-sm font-medium mb-1">
                Message Content<span className="text-red-500">*</span>
              </label>
              <textarea
                ref={textareaRef}
                value={formData.messageDraft}
                onChange={handleChange}
                placeholder="You can write your message here and with # can add dynamic values"
                className="w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                rows="4"
              />
              {suggestions.length > 0 && (
                <div
                  ref={suggestionRef}
                  className="absolute bg-white border rounded shadow-md mt-1 max-h-40 overflow-y-auto min-w-[150px] max-w-[300px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-100 whitespace-nowrap"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[9px] font-semibold ml-1 flex justify-between items-center">
                <p className=" text-red-600">
                  {formData.messageDraft.length}/4096
                </p>
                <p className="flex gap-1">
                  <FiBold className="h-3 w-4 cursor-pointer" />
                  <GoStrikethrough className="h-3 w-4 cursor-pointer" />
                  <GoItalic className="h-3 w-4 cursor-pointer" />
                </p>
              </p>
            </div>
            {/* Wait time */}
            <div className="">
              <label className="block text-sm font-medium mb-1">
                Wait Time<span className="text-red-500">*</span>
              </label>

              <select
                className="w-full text-sm border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                value={formData?.waitTime || "0"}
                onChange={(e) =>
                  setFormData({ ...formData, waitTime: Number(e.target.value) })
                }
              >
                <option value="0">0 Sec</option>
                <option value="1">1 Sec</option>
                <option value="2">2 Sec</option>
                <option value="3">3 Sec</option>
                <option value="4">4 Sec</option>
                <option value="5">5 Sec</option>
              </select>
              <p className="text-[9px] mt-1 font-semibold text-red-600 ml-1">
                If grater than 0 sec then auto redirect to next message
              </p>
            </div>
            <div className="">
              <label className="block text-sm font-medium mb-1">
                Redirect To<span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  className="w-full border text-sm rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                  value={formData?.redirectId}
                  onChange={(e) =>
                    setFormData({ ...formData, redirectId: e.target.value })
                  }
                >
                  {/* <option value="">Select</option> */}
                  <option value="1">1 Redirect</option>
                  <option value="2">2 Redirect</option>
                  <option value="3">3 Redirect</option>
                  <option value="4">4 Redirect</option>
                  <option value="5">5 Redirect</option>
                </select>

                {/* <input
                                    type="text"
                                    className="absolute top-0 left-0 w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-gray-400"
                                    placeholder="Search..."
                                    onChange={(e) => {
                                        // Implement search logic here
                                        // Filter options based on e.target.value
                                    }}
                                /> */}
              </div>

              <p className="text-[9px] mt-1 font-semibold text-red-600 ml-1">
                Where to redirect
              </p>
            </div>
            <div className="">
              <label className="block text-sm font-medium mb-1">
                Variabke Key<span className="text-red-500"></span>
              </label>
              <input
                type="text"
                placeholder="Key for Store user input"
                className="w-full uppercase border rounded px-3 text-sm py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                value={formData.variableName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    variableName: e.target.value.replaceAll(" ", "_"),
                  })
                }
              />
              <p className="text-[9px] mt-1 font-semibold text-red-600 ml-1">
                Key for store user input
              </p>
            </div>
            <div className="">
              <label className="block text-sm font-medium mb-1">
                Validation Type
              </label>
              <div className="relative">
                <select
                  className="w-full border text-sm rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                  value={formData?.validationType || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, validationType: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="NAME">NAME</option>
                  <option value="EMAIL">EMAIL</option>
                  <option value="ADDRESS">ADDRESS</option>
                  <option value="PICCODE">PICCODE</option>
                  <option value="MOBILE_NO">MOBILE_NO</option>
                  <option value="NUMBER">NUMBER</option>
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
            {Object.keys(data).length
              ? "Update Text Script"
              : "Add Text Script"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAPIScript;
