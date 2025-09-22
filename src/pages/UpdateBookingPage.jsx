import React, { useEffect, useRef, useState } from 'react'
import { useToast } from '../context/ToastContext';
import axiosInstance from '../utils/axios';
import { useParams } from 'react-router-dom';
import { decryptData } from '../utils/apiEndPoint';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
const UpdateBookingPage = () => {
    // http://alturl.com/ije7o <========== // short url
    const { token } = useParams();
    const bookingData = decryptData(token);

    const showToast = useToast();
    const [batches, setBatches] = useState([]);
    const dropdownRef = useRef(null);

    const [selectedBatch, setSelectedBatch] = useState(null);
    const [isBatchDropdownOpen, setBatchIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(formatDate(bookingData.bookingDate));
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState([]);
    const today = new Date();
    const dateContainerRef = useRef(null);

    const getDaysInMonth = (date) => {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const days = [];
        for (let i = startOfMonth.getDate(); i <= endOfMonth.getDate(); i++) {
            days.push(new Date(date.getFullYear(), date.getMonth(), i));
        }
        return days;
    };

    useEffect(() => {
        const days = getDaysInMonth(currentMonth);
        setDaysInMonth(days);
    }, [currentMonth]);

    // const handleScroll = () => {
    //     const container = dateContainerRef.current;
    //     if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
    //         const nextMonth = new Date(currentMonth);
    //         nextMonth.setMonth(currentMonth.getMonth() + 1);
    //         setCurrentMonth(nextMonth);
    //     }
    // };

    useEffect(() => {
        if (dateContainerRef.current) {
            const todayIndex = daysInMonth.findIndex(date => formatDate(date) === formatDate(today));
            if (todayIndex !== -1) {
                const todayElement = dateContainerRef.current.children[todayIndex];
                if (todayElement) {
                    todayElement.scrollIntoView({ behavior: "smooth", inline: "center" });
                }
            }
        }
    }, [daysInMonth]);

    function formatDate(dateString) {
        if (!dateString) {
            return '';
        }
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${year}-${month}-${day}`;
    }

    const handleDateClick = (date) => {
        if (!isDisabled(date)) {
            setSelectedDate(formatDate(date));
            setFormData({ ...formData, date: formatDate(date) });
        }
    };

    useEffect(() => {
        getBatchData();
    }, [selectedDate]);

    const getDayName = (date) => {
        return date.toLocaleString('default', { weekday: 'short' });
    };

    const isDisabled = (date) => {
        const dayOfWeek = date.getDay(); // Sunday = 0, Saturday = 6
        // return dayOfWeek === 0 || dayOfWeek === 6; // Disable weekends (Sunday and Saturday)
        return false; // Disable weekends (Sunday and Saturday)
    };
    const [formData, setFormData] = useState({
        name: bookingData.name || "",
        email: bookingData.email || "",
        mobileNo: bookingData.mobileNo || "",
        hospitalId: "",
        batchId: "",
        date: bookingData.date || "",
        bookingNo: bookingData.bookingNo || "",

    });

    const getBatchData = async () => {
        if (selectedDate) {
            try {
                setSelectedBatch(null);
                const response = await axiosInstance.get('/batch/getDropdownData' + `/${bookingData?.hospitalId || "67a454e5e5522551807cad3d"}` + `/${selectedDate}`);
                if (response?.data?.status) {
                    console.log(response?.data?.data);
                    setBatches(response?.data?.data || []);
                    setBatchIsDropdownOpen(true)
                } else {
                    showToast('error', response?.data?.message || 'Something went wrong');
                }
            } catch (error) {
                console.log(error);
                showToast('error', error?.response?.data?.message || 'Something went wrong');
            }
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClick = async () => {

        if (!formData.name || !formData.mobileNo || !formData.hospitalId || !formData.batchId || !formData.date || !formData.bookingNo) {
            showToast('error', 'All fields are required');
            return;
        }
        try {
            setLoading(true);
            const response = await axiosInstance.post('/reschedule-appointment', formData);
            if (response?.data?.status) {
                showToast('success', response?.data?.message || 'Appointment Reschedule Successfully');
            } else {
                showToast('error', response?.data?.message || 'Something went wrong');
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="flex justify-center flex-col items-center min-h-screen px-4">
            <h3 className='text-3xl font-semibold mb-4 text-blue-600'>Book Appointment</h3>
            <div className="relative w-full max-w-sm" ref={dropdownRef}>
                {/* Search Input */}
                <label className="block text-sm">Select Hospital</label>
                <div className="relative mb-2">
                    <input
                        type="text"
                        value={bookingData.hospitalName}
                        disabled
                        className="border border-gray-300 rounded-lg px-4 w-full py-2 outline-none"
                    />
                </div>

                <label className="text-sm">Booking Date</label>
                <div className="text-center mb-4 flex justify-between items-center">
                    <button
                        className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition"
                        onClick={() => {
                            const prevMonth = new Date(currentMonth);
                            prevMonth.setMonth(currentMonth.getMonth() - 1);
                            setCurrentMonth(prevMonth);
                            setBatches([]);
                            setBatchIsDropdownOpen(false);
                        }}
                    >
                        {/* &#8592; Left Arrow */}
                        <FaArrowLeft/>
                    </button>

                    <span className="mx-4 text-lg font-medium">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>

                    <button
                        className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition"
                        onClick={() => {
                            const nextMonth = new Date(currentMonth);
                            nextMonth.setMonth(currentMonth.getMonth() + 1);
                            setCurrentMonth(nextMonth);
                            setBatches([]);
                            setBatchIsDropdownOpen(false);
                        }}
                    >
                        {/* &#8594; Right Arrow */}
                        <FaArrowRight/>
                    </button>
                </div>

                {/* Horizontal Date Picker */}
                <div
                    ref={dateContainerRef}
                    className="flex overflow-x-auto space-x-4 pb-4"
                    // onScroll={handleScroll}
                >
                    {daysInMonth.map((date, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-center w-16 py-2 px-4 rounded-md text-center transition-all duration-300
                ${selectedDate === formatDate(date) ? 'bg-blue-600 text-white' : 'bg-gray-100'}
                ${(isDisabled(date) || formatDate(date) < formatDate(today)) ? 'bg-red-400 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}
              `}
                            onClick={() => {
                                if (!isDisabled(date) && formatDate(date) >= formatDate(today)) {
                                    handleDateClick(date);
                                }
                            }}
                        >
                            <span className="font-medium text-sm">{date.getDate()}</span>
                            <span className="text-xs">{getDayName(date)}</span>
                        </div>
                    ))}
                </div>
                <p className='text-sm mt-2'>Selected Date: {selectedDate}</p>
                <div className="relative w-full max-w-sm mb-2 mt-4">
                    <label className="block text-sm">Select Batch</label>

                    <div
                        className="border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer bg-white"
                        onClick={() => setBatchIsDropdownOpen(!isBatchDropdownOpen)}
                    >
                        {selectedBatch ? selectedBatch.batchName : "Choose a Batch"}
                        <span className="text-gray-500">{isBatchDropdownOpen ? <MdArrowDropUp className='text-xl'/> : <MdArrowDropDown className='text-xl'/>}</span>
                    </div>

                    {/* Dropdown List */}
                    {isBatchDropdownOpen && (
                        <div className="absolute w-full min-h-0 max-h-60 overflow-auto bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                            {batches.map((batch, index) => (
                                <div
                                    key={batch.id + index}
                                    className={`px-4 py-2 hover:bg-gray-200 ${(batch.notAvailable || batch?.availableNo <= 0) ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                                    onClick={() => {
                                        if (!batch.notAvailable) {
                                            if (batch?.availableNo > 0) {
                                                setSelectedBatch(batch);
                                                setFormData({ ...formData, batchId: batch.id });
                                                setBatchIsDropdownOpen(false);
                                            }
                                        }
                                    }}
                                >
                                    {batch.batchName} - ({batch.startTime} - {batch.endTime})
                                    <div className='flex justify-between items-center'>
                                        {batch?.notAvailable ?
                                            <p
                                                className='text-xs text-red-500 mt-1 flex'
                                            >Not Available {batch?.notAvailable}
                                            </p> : batch?.availableNo <= 0 ?
                                                <p className='text-xs text-red-500 mt-1'>Fully Booked</p>
                                                : <p className='text-xs text-green-500 mt-1'>
                                                    Available Spots: {batch?.availableNo}
                                                </p>
                                        }
                                    </div>


                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <label className="block text-sm">Patient Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                    }}
                    placeholder="Enter the Patient Name..."
                    className="border border-gray-300 rounded-lg px-4 w-full py-2 outline-none mb-2"
                />
                <label className="block text-sm">Mobile No</label>
                <input
                    type="text"
                    value={formData.mobileNo}
                    maxLength={10}
                    onChange={(e) => {
                        setFormData({ ...formData, mobileNo: e.target.value });
                    }}
                    placeholder="Enter the Mobile No..."
                    className="border border-gray-300 rounded-lg px-4 w-full py-2 outline-none mb-2"
                />
                <button
                    className="w-full max-w-sm bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex justify-center items-center"
                    disabled={loading}
                    onClick={handleClick}
                >
                    {loading ? (
                        <div className="flex justify-center items-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12" cy="12" r="10"
                                    stroke="white" strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="white"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                                ></path>
                            </svg>
                            <span>Booking...</span>
                        </div>
                    ) : (
                        "Re-Schedule Appointment"
                    )}
                </button>
            </div>
        </div>
    )
}

export default UpdateBookingPage
