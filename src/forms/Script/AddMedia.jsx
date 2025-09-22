import React, { useRef, useState } from 'react'
import { FiBold } from 'react-icons/fi';
import { GoItalic, GoStrikethrough } from 'react-icons/go';
import { useToast } from '../../context/ToastContext';
import { endPoints } from '../../utils/apiEndPoint';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios';

const AddMedia = ({ botId, mediaType, isMediaOpen, setIsMediaOpen, data = {}, setCurrentScript, redirectData, getScript }) => {
  const showToast = useToast();
  const { userData } = useSelector((state) => state.user)
  // const fileInputRef = useRef(null);
  const toggleDrawer = () => {
    setIsMediaOpen(!isMediaOpen);
    setCurrentScript({});
  };
  const [formData, setFormData] = useState({
    id: data?._id,
    botId: botId,
    messageType: data?.mediaType || mediaType,
    mediaType: data?.mediaType || mediaType,
    variableName: data?.variableName || "",
    messageDraft: data?.messageDraft || "",
    mediaUrl: data?.mediaUrl || "",
    redirectId: data?.redirectId || "000000000000000000000000",
    waitTime: (parseInt(data?.waitTime) / 1000) || 0,
    validationType: data?.validationType || "",
    expectedMessage: data?.expectedMessage || data?.mediaType?.toLowerCase(),
    prevRedirectId: data?.prevRedirectId || "000000000000000000000000",
    mediaUrl: data?.mediaUrl || "",

    uploadProgress: 0,
    file: null,
  });

  const getAcceptedFileTypes = (type) => {
    switch (type) {
      case "IMAGE":
        return "image/jpeg, image/png";
      case "VIDEO":
        return "video/mp4";
      case "DOCUMENT":
        return "application/pdf";
      default:
        return "*/*";
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(endPoints.script, formData);
      if (response.data.status) {
        showToast('success', 'Added Successfully!');
      } else {
        showToast('error', response.data.message)
      }
    } catch (error) {
      console.log('Error in Add Media Script: ', error);
      showToast('error', error?.response?.data?.message || 'Something went wrong');
    }
    console.log("Form Data:", formData)
    getScript();
    toggleDrawer();
  };

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
        endPoints.uploadScriptMedia + `/${userData?.client?.id}`,
        fileData,
        {
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
        }
      );
      if (response.data.status) {
        showToast('success', 'File uploaded successfully');
        setFormData({ ...formData, mediaUrl: response.data.data.mediaUrl, file: null, uploadProgress: 0 });
        // if (fileInputRef.current) {
        //   fileInputRef.current.value = '';
        // }
      } else {
        showToast('error', response.data.message);
        setFormData({ ...formData, mediaUrl: '', file: null, uploadProgress: 0 });
      }
    } catch (error) {
      console.log('Error in Upload Media File: ', error);
      showToast('error', error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      {isMediaOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleDrawer}
        ></div>
      )}

      <div
        className={`
                    fixed inset-0 flex items-center justify-center z-50 transition-transform
                    ${isMediaOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
          }`}
      >

        <div className="bg-white w-full max-w-lg mx-4 sm:mx-auto rounded-lg shadow-lg p-6 overflow-y-auto h-[80%]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold capitalize">{Object.keys(data).length > 1 ? `Update ${data?.mediaType?.toLowerCase()} script` : `Add ${data?.mediaType?.toLowerCase()} script`}</h2>
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
                Caption Content<span className="text-red-500">*</span>
              </label>
              <textarea
                type="text"
                rows={4}
                maxLength={1024}
                placeholder="Type something"
                className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                value={formData.messageDraft}
                onChange={(e) => setFormData({ ...formData, messageDraft: e.target.value })}
              />
              <p className='text-[9px] font-semibold ml-1 flex justify-between items-center'>
                <p className=' text-red-600'>
                  {formData.messageDraft.length}/1024
                </p>
                <p className='flex gap-1'>
                  <FiBold className='h-3 w-4 cursor-pointer' />
                  <GoStrikethrough className='h-3 w-4 cursor-pointer' />
                  <GoItalic className='h-3 w-4 cursor-pointer' />
                </p>
              </p>
            </div>

            {
              formData?.mediaUrl && (
                <div className='col-span-full'>
                  <label htmlFor="media-lable">Old Media File</label>
                  {
                    formData?.mediaType === 'IMAGE' && (
                      <img
                        className="w-full h-40 object-contain border border-gray-300 p-2" src={formData?.mediaUrl} alt="" />
                    )
                  }
                  {
                    formData?.mediaType === 'VIDEO' && (
                      <video
                        className="w-full h-40 object-contain border border-gray-300 p-2" src={formData?.mediaUrl} alt="" />
                    )
                  }
                  {
                    formData?.mediaType === 'DOCUMENT' && (
                      <iframe
                        className="w-full h-40 object-contain border border-gray-300 p-2" src={formData?.mediaUrl} alt="" />
                    )
                  }
                </div>
              )
            }

            <div className="">
              <label className="block text-sm font-medium mb-1">
                Upload File<span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                // ref={fileInputRef}
                accept={getAcceptedFileTypes(formData?.mediaType)}
                className="w-full border rounded px-3 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                onChange={handleFileChange}
              />
              {/* Progress Bar */}
              {formData.uploadProgress > 0 && formData.uploadProgress < 100 && (
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
            <div className="">
              <button
                type="button"
                className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleFileUpload}
              >
                Upload File
              </button>
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
                </select> */}

              {/* <input
                                    type="text"
                                    className="absolute top-0 left-0 w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-gray-400"
                                    placeholder="Search..."
                                    onChange={(e) => {
                                        // Implement search logic here
                                        // Filter options based on e.target.value
                                    }}
                                /> */}
              {/* </div> */}

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
                  {/* <option value="PAN">PAN</option> */}
                  {/* <option value="GST">GST</option> */}
                </select>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 capitalize rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            {Object.keys(data).length > 1 ? `Update ${data?.mediaType?.toLowerCase()} script` : `Add ${data?.mediaType?.toLowerCase()} script`}
          </button>
        </div>

      </div>

    </div >
  )
}

export default AddMedia
