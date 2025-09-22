import React, { useState } from 'react'
import { FiBold } from 'react-icons/fi';
import { GoItalic, GoStrikethrough } from 'react-icons/go';
import { useToast } from '../../context/ToastContext';
import { IoIosRemoveCircleOutline } from 'react-icons/io';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axios';
import { endPoints } from '../../utils/apiEndPoint';

const AddButton = ({ botId, isButtonOpen, setIsButtonOpen, data = {}, setCurrentScript, redirectData, getScript }) => {
  const showToast = useToast();
  const toggleDrawer = () => {
    setIsButtonOpen(!isButtonOpen);
    setCurrentScript({});
  };
  const [formData, setFormData] = useState({
    id: data?._id,
    botId: botId,
    messageType: data?.messageType || "BUTTON",
    variableName: data?.variableName || "",
    messageDraft: data?.messageDraft || "",
    redirectId: data?.redirectId || "000000000000000000000000",
    waitTime: (parseInt(data?.waitTime) / 1000) || 0,
    validationType: data?.validationType || "",
    expectedMessage: data?.expectedMessage || "button_reply",
    prevRedirectId: data?.prevRedirectId || "000000000000000000000000",
    listButtonName: data?.listButtonName || "",
    buttonOrListData: data?.buttonOrListData ? data?.buttonOrListData : [
      {
        "id": "",
        "optionName": ""
      }
    ]
  });

  const handleChangeRedirectId = (index, key, value) => {
    const newData = [...formData.buttonOrListData];
    newData[index][key] = value;
    setFormData({
      ...formData,
      buttonOrListData: newData,
    });
  }

  const addButton = () => {
    if (formData.buttonOrListData.length < 3) {
      setFormData({
        ...formData,
        buttonOrListData: [...formData.buttonOrListData, {
          "id": "000000000000000000000000",
          "optionName": ""
        }]
      });
    } else {
      showToast('info', 'You can add only 3 buttons');
    }
  }

  const removeButton = () => {
    if (formData.buttonOrListData.length > 1) {
      const newData = [...formData.buttonOrListData];
      newData.pop();
      setFormData({
        ...formData,
        buttonOrListData: newData,
      });
    } else[
      showToast('info', 'Min 1 button required')
    ]

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.botId ||
        !formData.messageType ||
        !formData.listButtonName ||
        !formData.expectedMessage ||
        formData.buttonOrListData.length === 0
      ) {
        showToast('info', 'Please fill in all required fields.');
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
      console.log('Error in Adding Button Script', error);
      showToast('error', error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handleSingleRemove = (index) => {
    const newData = [...formData.buttonOrListData];
    newData.splice(index, 1);
    setFormData({
      ...formData,
      buttonOrListData: newData,
    });
  }



  return (
    <div>
      {isButtonOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleDrawer}
        ></div>
      )}

      <div
        className={`
                    fixed inset-0 flex items-center justify-center z-50 transition-transform
                    ${isButtonOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
          }`}
      >

        <div className="bg-white w-full max-w-lg mx-4 sm:mx-auto rounded-lg shadow-lg p-6 overflow-y-auto h-[90%]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{Object.keys(data).length ? "Update Button Script" : "Add Button Script"}</h2>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={toggleDrawer}
            >
              ✖
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Message Content */}
            <div className='col-span-full'>
              <label className="block text-sm font-medium mb-1">
                Message Content<span className="text-red-500">*</span>
              </label>
              <textarea
                type="text"
                rows={4}
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
            {/* Wait Time */}
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


            <div className=''>
              <label className="block text-sm font-medium mb-1">
                Button Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Button Name"
                maxLength={24}
                className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                value={formData.listButtonName}
                onChange={(e) => setFormData({ ...formData, listButtonName: e.target.value })}
              />
              <p className='text-[9px] text-red-600 font-semibold ml-1 flex justify-between items-center'>
                {formData.listButtonName.length}/24
              </p>
            </div>

            {/* Options */}
            <div className='col-span-full' >
              {
                formData.buttonOrListData.map((item, index) => (
                  <div className='bg-gray-300 p-2 rounded-md'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2  p-2 rounded-sm bg-gray-100' key={index}>
                      <div className='' >
                        <label className="block text-sm font-medium">
                          Option Name {index + 1}<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Option Name"
                          maxLength={24}
                          className="w-full text-sm border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                          value={formData?.buttonOrListData[index]?.optionName}
                          onChange={(e) => handleChangeRedirectId(index, "optionName", e.target.value)}
                        />
                        <p className='text-[9px] text-red-600 font-semibold ml-1 flex justify-between items-center'>
                          {formData?.buttonOrListData[index]?.optionName.length}/24
                        </p>
                      </div>

                      <div className="">
                        <label className=" text-sm font-medium flex justify-between">
                          Redirect To {index + 1}<span className="text-red-500">
                            {
                              formData?.buttonOrListData.length !== 1 && index !== 0 &&
                              <IoIosRemoveCircleOutline onClick={() => handleSingleRemove(index)} className='h-5 w-5 cursor-pointer' />
                            }
                          </span>
                        </label>

                        <div className="relative">
                          <select
                            className="w-full text-sm border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                            value={formData?.buttonOrListData[index]?.optionName}
                            onChange={(e) => handleChangeRedirectId(index, "id", e.target.value)}
                          >
                            <option value="">
                              {redirectData.filter((item) => item?.id === formData?.buttonOrListData[index]?.id)[0]?.optionName || "Select Option"}
                            </option>
                            {
                              redirectData?.map((items, index) =>
                                <option key={index} value={items?.id}>{index + 1 + ". "}{items?.optionName.substring(0, 20) + (items?.optionName.length > 20 ? "..." : "")}</option>
                              )
                            }
                          </select>
                        </div>


                      </div>
                    </div>
                  </div>

                ))
              }
              <div className='flex justify-end'>
                <IoAddCircleOutline
                  className={`text-blue-500 h-6 w-6
                              ${formData.buttonOrListData.length < 3 ?
                      "text-blue-600 cursor-pointer" :
                      "text-gray-400 cursor-not-allowed"}`}
                  onClick={() => addButton()} />
                <IoIosRemoveCircleOutline
                  className={`cursor-pointer h-6 w-6
                              ${formData.buttonOrListData.length > 1 ?
                      "text-red-600 cursor-pointer" :
                      "text-gray-400 cursor-not-allowed"}`}
                  onClick={() => removeButton()} />
              </div>

            </div>




            {/* Variable */}
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

            {/* Validation */}
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
                  <option value="PINCODE">PINCODE</option>
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
            {Object.keys(data).length ? "Update Button Script" : "Add Button Script"}
          </button>
        </div>

      </div>

    </div>
  )
}

export default AddButton
