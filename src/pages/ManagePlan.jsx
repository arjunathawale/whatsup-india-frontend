import React, { useCallback, useEffect, useState } from 'react'
import AddPlan from '../forms/AddPlan';
import { MdEdit } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import axiosInstance from '../utils/axios';
import { debounce } from '../utils/debounce';
import { endPoints } from '../utils/apiEndPoint';

const ManagePlan = () => {
    const showToast = useToast()
    const [plans, setPlans] = useState([]);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [planType, setPlanType] = useState('');
    const [currencyType, setCurrencyType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [filterOpen, setFilterOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loader, setLoader] = useState(false)

    // Paginate filtered plans
    const totalPages = Math.ceil(total / itemsPerPage);
    const paginatedPlans = plans
    const [planData, setPlanData] = useState({});



    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1); // Reset to the first page when changing items per page
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

 


    const getData = async () => {
        try {
            setPlans([])
            setLoader(true)
            const res = await axiosInstance.get(`/plan/?page=${currentPage}&limit=${itemsPerPage}`)
            if (res?.data?.status) {
                setPlans(res?.data?.data?.plans || [])
                setTotal(res?.data?.data?.pagination?.totalCount || 0)
            }
            setLoader(false)
        } catch (error) {
            console.log(error);

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
            if (statusFilter) {
                params.append('isActive', statusFilter === 'false' ? false : true);
            }
            if (planType) {
                params.append('planType', planType);
            }
            if (currencyType) {
                params.append('currency', currencyType);
            }
            const query = params.toString();
            const url = query ? `/plan/?${query}` : '/plan/';
            const res = await axiosInstance.get(url);
            if (res?.data?.status) {
                setPlans(res?.data?.data.plans || []);
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
    };
    

    const fetchPlans = async (query) => {
        try {
            setPlans([]);
            setLoader(true);
            const res = await axiosInstance.get(endPoints.plan + `/?searchQuery=${query}`);
            if (res?.data?.status) {
                setPlans(res?.data?.data?.plans || []);
            }
            setLoader(false);
        } catch (error) {
            console.log(error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    };
    const debouncedFetchPlans = useCallback(debounce(fetchPlans, 500), []);

    useEffect(() => {
        if (search.trim()) {
            debouncedFetchPlans(String(search));
        } else {
            getData();
        }
    }, [search]);

    useEffect(() => {
        getData()
        return () => {
            
        }
    }, [currentPage, itemsPerPage])

    const handleDelete = async (id) => {
        try {
            if (id) {
                const response = await axiosInstance.delete(endPoints.plan + "/" + id)
                if (response.data.status) {
                    showToast("success", "Deleted Successfully!");
                } else {
                    showToast("error", response.data.message);
                }
            } 
            getData();
        } catch (error) {
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="flex-grow h-screen bg-gray-100 px-6 py-4">
            {/* Header */}
            <header className="flex justify-between items-center mb-2">
                <h1 className="text-xl font-bold">Manage Plans</h1>
            </header>

            {/* Search Bar and Filter */}
            <div className="mb-4 flex justify-between items-centergap-4">
                <input
                    type="text"
                    placeholder="Search by Name"
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
                        + Add Plan
                    </button>
                </div>

            </div>

            {filterOpen && (
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
                            <label className="block text-sm mb-2">Select Plan Type</label>
                            <select
                                value={planType}
                                onChange={(e) => setPlanType(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 w-full py-2"
                            >
                                <option value="">All Type</option>
                                <option value="FREE_TRIAL">Free Trial</option>
                                <option value="MONTHLY">Monthly</option>
                                <option value="QUARTERLY">Quarterly</option>
                                <option value="YEARLY">Yearly</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm mb-2">Select Currency</label>
                            <select
                                value={currencyType}
                                onChange={(e) => setCurrencyType(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 w-full py-2"
                            >
                                <option value="">All Type</option>
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
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
                                        setPlanType("");
                                        setCurrencyType("");
                                        setStatusFilter("");
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
                openForm && <AddPlan
                    setOpenForm={setOpenForm}
                    openForm={openForm}
                    planData={planData}
                    setPlanData={setPlanData}
                    getData={getData}
                />
            }

            {/* Plan Table */}
            <div className="max-h-[80vh] min-h-[70vh] overflow-y-auto">
                <table className="table-auto w-full bg-white shadow-md rounded-lg ">
                    <thead>
                        <tr className="bg-[#084DF0] text-white text-left">
                            <th className="px-4 py-2 text-center">Sr No</th>
                            <th className="px-4 py-2">Currency</th>
                            <th className="px-4 py-2">Plan Type</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Desc</th>
                            {/* <th className="px-4 py-2">Agent Limit</th> */}
                            <th className="px-4 py-2">Bulk Limit</th>
                            <th className="px-4 py-2">External API</th>
                            <th className="px-4 py-2">Chat Bot</th>
                            <th className="px-4 py-2 text-center">Status</th>
                            <th className="px-4 py-2 text-center" >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loader && (
                            <tr>
                                <td colSpan="10" className="text-center">
                                    <div className="flex justify-center items-center h-[60vh] w-full">
                                        <Loader />
                                    </div>
                                </td>
                            </tr>
                        )}
                        {
                            paginatedPlans.length > 0 ?
                                paginatedPlans.map((plan, index) => (
                                    <tr key={plan.id} className="border-b h-max">
                                        <td className="px-4 py-2 text-center">{index + 1}</td>
                                        <td className="px-4 py-2">{plan.currency}</td>
                                        <td className="px-4 py-2">{plan.planType}</td>
                                        <td className="px-4 py-2">{plan.price}</td>
                                        <td className="px-4 py-2">{plan.name}</td>
                                        <td className="px-4 py-2">{plan?.description?.substring(0, 15)}...</td>
                                        <td className="px-4 py-2">{plan.bulkLimit}</td>
                                        <td className="px-4 py-2 text-center">{
                                            plan.externalMessageSendAPI ? <span className='p-1 px-1 bg-green-500 text-xs text-white rounded-sm'>Yes</span> :
                                                <span className='p-1 bg-red-500 text-xs text-white rounded-sm'>No</span>}
                                        </td>
                                        <td className="px-4 py-2 text-center">{
                                            plan.chatBotFeature ? <span className='p-1 px-1 bg-green-500 text-xs text-white rounded-sm'>Yes</span> :
                                                <span className='p-1 bg-red-500 text-xs text-white rounded-sm'>No</span>}
                                        </td>

                                        <td className="px-4 py-2 text-center">{
                                            plan.isActive ? <span className='p-1 px-1 bg-green-500 text-xs text-white rounded-sm'>Active</span> : <span className='p-1 bg-red-500 text-xs text-white rounded-sm'>In Active</span>}
                                        </td>
                                        <td className="px-4 py-2 flex justify-center space-x-2">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                onClick={() => {
                                                    setPlanData(plan)
                                                    setOpenForm(true)
                                                }}
                                            >
                                                <MdEdit />
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                onClick={() => handleDelete(plan.id)}
                                            >
                                                <BsTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )) : !loader && <tr>
                                    <td colSpan="10" className="text-center">
                                        <div className="flex justify-center items-center h-[60vh]">
                                            <p className='text-md font-medium'>No Plans Found</p>
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

export default ManagePlan
