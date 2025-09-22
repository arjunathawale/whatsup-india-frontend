import React, { useCallback, useEffect, useState } from 'react'
import AddClient from '../forms/AddClient';
import { MdEdit } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';
import { GoGear } from 'react-icons/go';
import AddCrendential from '../forms/AddCrendential';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axios';
import { useToast } from '../context/ToastContext';
import { endPoints } from '../utils/apiEndPoint';
import { debounce } from '../utils/debounce';

const ManageClient = () => {
    const showToast = useToast()
    const [consumers, setConsumers] = useState([]);
    const handleDelete = async (id) => {
        try {
            setLoader(true)
            const res = await axiosInstance.delete(endPoints.deleteClient + `/${id}`)
            if (res?.data?.status) {
                showToast("success", "Deleted Successfully!");
                getData();
            }
            setLoader(false)
        } catch (error) {
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    };
    console.log(consumers);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [dateFilterOpen, setDateFilterOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [clientData, setClientData] = useState({});
    const [loader, setLoader] = useState(false)
    const totalPages = Math.ceil(total / itemsPerPage);
    // const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedConsumers = consumers;
    const [openCrendentialForm, setOpenCrendentialForm] = useState(false);
    const [clientCredentialData, setClientCredentialData] = useState({});

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    useEffect(() => {
        getData()
    }, [currentPage, itemsPerPage])

    const getData = async () => {
        try {
            setConsumers([])
            setLoader(true)
            const res = await axiosInstance.get(`/client/?isActive=true&page=${currentPage}&limit=${itemsPerPage}`)
            if (res?.data?.status) {
                setConsumers(res?.data?.data?.clients || [])
                setTotal(res?.data?.data?.pagination?.totalCount || 0)
            }
            setLoader(false)
        } catch (error) {
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }

    const onFilterApply = async () => {
        try {
            setLoader(true)
            let query = ''
            if (startDate && endDate) {
                query = `?startDate=${startDate}&endDate=${endDate}`
                if (statusFilter) {
                    query += `&isActive=${statusFilter === 'false' ? false : true}`
                }
            } else {
                if (statusFilter) {
                    query = `?isActive=${statusFilter === 'false' ? false : true}`
                }
            }
            const res = await axiosInstance.get('/client/' + query)
            if (res?.data?.status) {
                setConsumers(res?.data?.data.clients || [])
                setTotal(res?.data?.data?.pagination?.totalCount || 0)
            }
            setLoader(false)
            setDateFilterOpen(false)
        } catch (error) {
            showToast('error', error?.response?.data?.message || 'Something went wrong');
            setDateFilterOpen(false)
        }
    }

    const fetchConsumers = async (query) => {
        try {
            setConsumers([]);
            setLoader(true);
            const res = await axiosInstance.get(`/client/?isActive=true&searchQuery=${query}`);
            if (res?.data?.status) {
                setConsumers(res?.data?.data?.clients || []);
            }
            setLoader(false);
        } catch (error) {
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    };
    const debouncedFetchConsumers = useCallback(debounce(fetchConsumers, 500), []);

    useEffect(() => {
        if (search.trim()) {
            debouncedFetchConsumers(String(search));
        } else {
            getData();
        }
    }, [search]);

    const updateClient = async (clientId, status) => {
        try {
            if (clientId) {
                const response = await axiosInstance.put(endPoints.updateClient + "/" + clientId, {
                    isActive: status
                })
                if (response.data.status) {
                    showToast("success", "Status Updated successfully!");
                } else {
                    showToast("error", response.data.message);
                }
            }
            getData();
        } catch (error) {
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }

    }
    return (
        <div className="flex-grow bg-gray-100 px-6 py-4 h-screen">
            {/* Header */}
            <header className="flex justify-between items-center mb-2">
                <h1 className="text-xl font-bold">Manage Clients</h1>
            </header>

            <div className="mb-4 flex justify-between items-centergap-4">
                <input
                    type="text"
                    placeholder="Search by Fullname, Email, Mobile"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md outline-none"
                />
                {/* Filter box */}
                <div className='flex gap-3'>
                    <button
                        onClick={() => setDateFilterOpen(true)}
                        className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                        🔍 Apply Filter
                    </button>
                    <button
                        onClick={() => setOpenForm(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        + Add Client
                    </button>
                </div>

            </div>

            {dateFilterOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Filter</h2>
                        <div className="mb-4">
                            <label className="block text-sm mb-2">Select Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 w-full py-2"
                            >
                                <option value="">All Status</option>
                                <option value="true">Active</option>
                                <option value="false">In-Active</option>
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
                                        setStatusFilter("");
                                        // setDateFilterOpen(false);
                                        // getData();
                                    }}
                                    className="bg-red-500 text-white px-4 py-1 rounded mr-2"
                                >
                                    Clear
                                </button>
                            </div>
                            <div>

                                <button
                                    onClick={() => setDateFilterOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-1 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => onFilterApply()}
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
                openForm && <AddClient
                    setIsOpen={setOpenForm}
                    isOpen={openForm}
                    clientData={clientData}
                    setClientData={setClientData}
                    getData={getData}
                />
            }
            {
                openCrendentialForm && <AddCrendential
                    setOpenCrendentialForm={setOpenCrendentialForm}
                    openCrendentialForm={openCrendentialForm}
                    clientCredentialData={clientCredentialData}
                    setClientCredentialData={setClientCredentialData}
                    getData={getData}
                />

            }

            {/* Consumer Table */}
            <div className="max-h-[80vh] min-h-[72vh] overflow-y-auto">
                <table className="table-auto w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-[#084DF0] text-white text-left">
                            <th className="px-4 py-2 text-center">Sr No</th>
                            <th className="px-4 py-2">Full Name</th>
                            <th className="px-4 py-2">Mobile No</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Address</th>
                            <th className="px-4 py-2 text-center">Status</th>
                            <th className="px-4 py-2 text-center" >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loader && (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <div className="flex justify-center items-center h-[60vh]">
                                        <Loader />
                                    </div>
                                </td>
                            </tr>
                        )}
                        {
                            paginatedConsumers.length > 0 ?
                                paginatedConsumers.map((consumer, index) => (
                                    <tr key={consumer.userId} className="border-b">
                                        <td className="px-4 py-2 text-center">{index + 1}</td>
                                        <td className="px-4 py-2">{consumer?.clientName}</td>
                                        <td className="px-4 py-2">{consumer?.user?.mobileNo}</td>
                                        <td className="px-4 py-2">{consumer?.user?.email}</td>
                                        <td className="px-4 py-2">{consumer.address}</td>
                                        <td className="px-2 py-2">
                                            <div
                                                className="relative flex justify-center items-center"
                                                onClick={() => updateClient(consumer?.id, !consumer?.user?.isActive)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id="disable-user-toggle"
                                                    className="sr-only"
                                                    checked={consumer?.user?.isActive}
                                                />
                                                <div
                                                    className={`block w-10 h-6 rounded-full cursor-pointer transition ${consumer?.user?.isActive ? "bg-blue-500" : "bg-gray-300"
                                                        }`}
                                                ></div>
                                                <div
                                                    className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition ${consumer?.user?.isActive ? "transform translate-x-10" : "transform translate-x-7"
                                                        }`}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 flex justify-center space-x-2">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                onClick={() => {
                                                    setClientData(consumer)
                                                    setOpenForm(true)
                                                }}
                                            >
                                                <MdEdit />
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                onClick={() => handleDelete(consumer.id)}
                                            >
                                                <BsTrash />
                                            </button>
                                            <button
                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400"
                                                onClick={() => {
                                                    setClientCredentialData({ clientId: consumer.id, ...consumer?.clientMetaConfigs } || {})
                                                    setOpenCrendentialForm(true)
                                                }}
                                            >
                                                <GoGear />
                                            </button>
                                        </td>
                                    </tr>
                                )) : !loader && <tr>
                                    <td colSpan="7" className="text-center">
                                        <div className="flex justify-center items-center h-[60vh]">
                                            <p className='text-md font-medium'>No Clients Found</p>
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
                <div className="flex items-center gap-4">
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
                        {[...Array(totalPages)].map((_, index) => (
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
                        ))}
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

export default ManageClient
