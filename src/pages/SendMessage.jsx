import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader';
import SendMessageForm from '../forms/SendMessageForm';
import { endPoints } from '../utils/apiEndPoint';
import { useSelector } from 'react-redux';
import { useToast } from '../context/ToastContext';
import axiosInstance from '../utils/axios';
import BroadcastDetail from '../forms/BroadcastDetail';

const SendMessage = () => {
    const showToast = useToast()
    const { userData } = useSelector((state) => state.user)
    const [broadcasts, setBroadcasts] = useState([]);
    const [broadcastDetails, setBroadcastDetails] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [filterOpen, setFilterOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [loader, setLoader] = useState(false)

    const totalPages = Math.ceil(total / itemsPerPage);
    const paginatedBroadcasts = broadcasts

    const [openDetails, setOpenDetails] = useState(false);

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        getData();
    }, [currentPage, itemsPerPage]);

    const getData = async () => {
        try {
            setBroadcasts([])
            setLoader(true)
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('limit', itemsPerPage);
            if (categoryFilter) {
                params.append('templateCategory', categoryFilter);
            }
            const res = await axiosInstance.get(
                endPoints.broadcast + `/${userData?.client?.id}` + `/?${params.toString()}`
            );
            if (res?.data?.status) {
                setBroadcasts(res?.data?.data?.broadcasts || [])
                setTotal(res?.data?.data?.pagination?.totalCount || 0)
            }
            setLoader(false)
        } catch (error) {
            console.log('Error Getting Templates', error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${day} ${month}, ${year} ${hours}:${minutes} ${ampm}`;
    }

    const getDetails = async (id) => {
        try {
            const res = await axiosInstance.get(endPoints.getBroadcastDetails + `/${id}`);
            if (res?.data?.status) {
                // showToast('success', res?.data?.message || 'Broadcast details fetched successfully');
                setBroadcastDetails(res?.data?.data || []);
                setOpenDetails(true);
            }
        } catch (error) {
            console.log('Error Getting Broadcast Details', error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }

    const onFilterApply = async () => {
        try {
            setLoader(true);
            const params = new URLSearchParams();
            if (startDate && endDate) {
                params.append('startDate', startDate);
                params.append('endDate', endDate);
            }
            if (categoryFilter) {
                params.append('templateCategory', categoryFilter);
            }
            const query = params.toString();
            const url = query ? endPoints.broadcast + `/${userData?.client?.id}` + `/?${query}` : endPoints.broadcast + `/${userData?.client?.id}`;
            const res = await axiosInstance.get(url);
            if (res?.data?.status) {
                setBroadcasts(res?.data?.data.broadcasts || []);
                setTotal(res?.data?.data?.pagination?.totalCount || 0);
            }

            setLoader(false);
            setFilterOpen(false);
        } catch (error) {
            console.error(error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
            setLoader(false);
            setFilterOpen(false);
        }
    }
    return (
        <div className="flex-grow h-screen bg-gray-100 px-6 py-4">
            {/* Header */}
            <header className="flex justify-between items-center mb-2">
                <h1 className="text-xl font-bold">Broadcast</h1>
            </header>

            {/* Search Bar and Filter */}
            <div className="mb-4 flex justify-between items-centergap-4">
                <input
                    type="text"
                    placeholder="Search by name or mobile no"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md outline-none"
                />
                {/* Filter box */}

                <div className='flex gap-3'>
                    <button
                        onClick={() => setFilterOpen(true)}
                        className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                        🔍 Apply Filter
                    </button>
                    <button
                        onClick={() => setOpenForm(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        + Send Message
                    </button>
                </div>

            </div>

            {filterOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Filter</h2>
                        <div className="mb-4">
                            <label className="block text-sm mb-2">Select Category</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 w-full py-2"
                            >
                                <option value="">All</option>
                                <option value="MARKETING">Marketing</option>
                                <option value="UTILITY">Utility</option>
                                <option value="AUTHENTICATION">Authentication</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm mb-2">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full cursor-pointer"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm mb-2">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                            />
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <button
                                    onClick={() => {
                                        setStartDate("");
                                        setEndDate("");
                                        setCategoryFilter("");
                                    }}
                                    className="bg-red-500 text-white px-4 py-1 rounded mr-2"
                                >
                                    Clear
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() => setFilterOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-1 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onFilterApply}
                                    className="bg-blue-500 text-white px-4 py-1 rounded"
                                >
                                    Apply
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            {
                openForm && <SendMessageForm
                    setOpenForm={setOpenForm}
                    openForm={openForm}
                    getData={getData}
                />
            }

            {
                openDetails && <BroadcastDetail
                    setOpenDetails={setOpenDetails}
                    openDetails={openDetails}
                    broadcastDetails={broadcastDetails}
                    setBroadcastDetails={setBroadcastDetails}
                />
            }
            <div className="h-[70vh] overflow-y-auto">
                <table className="table-auto w-full bg-white shadow-md rounded-lg ">
                    <thead>
                        <tr className="bg-[#084DF0] text-white text-left">
                            <th className="px-4 py-2 text-center">Sr No</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Broad Cast Name</th>
                            <th className="px-4 py-2">Template Name</th>
                            <th className="px-4 py-2 text-center">Category</th>
                            <th className="px-4 py-2 text-center">Language</th>
                            {/* <th className="px-4 py-2 text-center">Status</th> */}
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loader && (
                            <tr>
                                <td colSpan="10" className="text-center">
                                    <div className="flex justify-center items-center h-[60vh] w-auto">
                                        <Loader />
                                    </div>
                                </td>
                            </tr>
                        )}
                        {
                            paginatedBroadcasts.length > 0 ?
                                paginatedBroadcasts.map((broadcast, index) => (
                                    <tr key={broadcast.id + String(index)} className="border-b h-max">
                                        <td className="px-4 py-2 text-center">{index + 1}</td>
                                        <td className="px-4 py-2">{formatDate(broadcast.createdAt)}</td>
                                        <td className="px-4 py-2">{broadcast.broadcastName}</td>
                                        <td className="px-4 py-2">{broadcast.templateName}</td>
                                        <td className="px-4 py-2 text-center">{broadcast?.templateCategory}</td>
                                        <td className="px-4 py-2 text-center">{broadcast.templateLang}</td>
                                        {/* <td className="px-4 py-2 text-center">{
                                            broadcast.currentStatus === "COMPLETED" ? <span className='p-1 px-2 bg-green-500 text-xs text-white rounded-lg'>Completed</span> :
                                                broadcast.currentStatus === "PROCESSING" ? <span className='p-1 px-2 bg-blue-500 text-xs text-white rounded-lg'>Processing</span> :
                                                    <span className='p-1 px-2 bg-yellow-500 text-xs text-white rounded-lg'>Pending</span>
                                        }
                                        </td> */}
                                        <td className="px-2 py-2 text-center sm:px-4"> {/* Added sm:px-4 for larger screens */}
                                            <button // Changed to a <button> for better semantics and accessibility
                                                className="p-1 px-2 bg-blue-500 text-xs text-white rounded-lg cursor-pointer sm:px-4" // Added sm:px-4 for larger screens
                                                onClick={() => getDetails(broadcast?.id)}
                                            >
                                                <span className="hidden sm:inline">View Details</span> {/* Show "View Details" on larger screens */}
                                                <span className="sm:hidden">Details</span> {/* Show "Details" (or an icon) on smaller screens */}
                                            </button>
                                        </td>
                                    </tr>
                                )) : !loader && <tr>
                                    <td colSpan="10" className="text-center">
                                        <div className="flex justify-center items-center h-[60vh]">
                                            <p className='text-md font-medium'>No Data Found</p>
                                        </div>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-0">
                {/* Page Info */}
                <div>
                    <span className="text-md">
                        Page {totalPages <= 0 ? 0 : currentPage} of {totalPages}
                    </span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-4 mt-2">
                    {/* Items Per Page Dropdown */}

                    {/* Pagination Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-2 py-1 bg-gray-500 cursor-pointer text-white rounded-l hover:bg-blue-600 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, index) => {
                            const distanceFromCurrent = Math.abs(index + 1 - currentPage);
                            const showButton =
                                distanceFromCurrent <= 2 || totalPages <= 5;

                            return (
                                showButton && (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-1 ${currentPage === index + 1
                                            ? 'bg-gray-500 text-white'
                                            : 'bg-white text-blue-600'
                                            } border`}
                                    >
                                        {index + 1}
                                    </button>
                                )
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-2 py-1 bg-gray-500 cursor-pointer text-white rounded-r hover:bg-blue-600 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(e.target.value)}
                        className="border border-gray-300 outline-none rounded px-2 py-1"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

        </div>

    )
}

export default SendMessage
