import React, { useCallback, useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs';
import Loader from '../components/Loader';
import { IoMdCall, IoMdEye } from 'react-icons/io';
import AddTemplate from '../forms/AddTemplate';
import { useSelector } from 'react-redux';
import { endPoints } from '../utils/apiEndPoint';
import { useToast } from '../context/ToastContext';
import axiosInstance from '../utils/axios';
import { debounce } from '../utils/debounce';
import { HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import { MdContentCopy, MdRefresh } from 'react-icons/md';
import { PiArrowBendUpLeft } from 'react-icons/pi';

const ManageTemplate = () => {
    const showToast = useToast()
    const { userData } = useSelector((state) => state.user)

    const [templates, setTemplates] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const handleDelete = async () => {
        try {
            const response = await axiosInstance.delete(endPoints.template + "/" + deleteId)
            if (response.data.status) {
                showToast("success", "Deleted Successfully!");
                setDeleteId(null);
                getData();
            } else {
                showToast("error", response.data.message);
                setDeleteId(null);
            }
        } catch (error) {
            showToast('error', error?.response?.data?.message || 'Something went wrong');
            setDeleteId(null);
        }
    };

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [filterOpen, setFilterOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loader, setLoader] = useState(false)


    // Paginate filtered templates
    const totalPages = Math.ceil(total / itemsPerPage);
    const paginatedTemplates = templates;
    const [templateData, setTemplateData] = useState({});
    const [showTemplate, setShowTemplate] = useState(false);


    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1); // Reset to the first page when changing items per page
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        getData()
    }, [currentPage, itemsPerPage])

    const getData = async () => {
        try {
            setTemplates([])
            setLoader(true)
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('limit', itemsPerPage);
            if (categoryFilter) {
                params.append('templateCategory', categoryFilter);
            }
            const res = await axiosInstance.get(
                endPoints.templateByClient + `/${userData?.client?.id}` + `/?${params.toString()}`
            );
            if (res?.data?.status) {
                setTemplates(res?.data?.data?.templates || [])
                setTotal(res?.data?.data?.pagination?.totalCount || 0)
            }
            setLoader(false)
        } catch (error) {
            console.log('Error Getting Templates', error);
            setLoader(false);
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
            const url = query ? endPoints.templateByClient + `/${userData?.client?.id}` + `/?${query}` : endPoints.templateByClient + `/${userData?.client?.id}`;
            const res = await axiosInstance.get(url);
            if (res?.data?.status) {
                setTemplates(res?.data?.data.templates || []);
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


    const fetchTemplates = async (query) => {
        try {
            setTemplates([]);
            setLoader(true);
            const res = await axiosInstance.get(
                endPoints.templateByClient + `/${userData?.client?.id}` +
                `/?searchQuery=${query}`
            );
            if (res?.data?.status) {
                setTemplates(res?.data?.data?.templates || []);
                setTotal(res?.data?.data?.pagination?.totalCount || 0);
            }
            setLoader(false);
        } catch (error) {
            console.log(error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    };
    const debouncedTemplates = useCallback(debounce(fetchTemplates, 500), []);
    useEffect(() => {
        if (search.trim()) {
            debouncedTemplates(String(search));
        } else {
            setTimeout(() => {
                getData();
            }, 700);
        }
        return () => {
            debouncedTemplates.cancel?.();
        }
    }, [search]);
    function transformString(inputString) {
        inputString = inputString.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        inputString = inputString.replace(/_(.*?)_/g, '<em>$1</em>');
        inputString = inputString.replace(/~(.*?)~/g, '<s>$1</s>');
        inputString = inputString.replace(/\n/g, '<br>');
        return inputString;
    }
    const bodyText = transformString(templateData?.bodyValue?.text || '');

    const [isRotating, setIsRotating] = useState(false);
    const syncTemplate = async () => {
        setIsRotating(true);
        try {
            const res = await axiosInstance.get(endPoints.syncTemplate + `/${userData?.client?.id}`);
            if (res?.data?.status) {
                showToast('success', 'Template Synced Successfully');
                getData();
            }
            setTimeout(() => {
                setIsRotating(false);
            }, 1000);
        } catch (error) {
            console.log(error);
            showToast('error', error?.response?.data?.message || 'Something went wrong');
        }
    }
    return (
        <div className="flex-grow h-screen bg-gray-100 px-6 py-4">
            {/* Header */}
            <header className="flex justify-between items-center mb-2">
                <h1 className="text-xl font-bold">Manage Templates</h1>
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
                        onClick={syncTemplate}
                        className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                        <MdRefresh
                            className={`text-2xl transform transition-transform duration-500 ${isRotating ? 'rotate-360' : ''
                                }`}
                        />
                    </button>
                    <button
                        onClick={() => setOpenForm(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        + Add Template
                    </button>
                </div>
            </div>

            {showTemplate && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white py-4 px-3 rounded-lg shadow-lg w-[360]">
                        <h2 className="text-xl font-bold mb-4">Template Preview</h2>

                        <div className="w-full bg-gray-100 py-2 px-1">
                            {
                                templateData.headerType === "IMAGE" &&
                                <img
                                    src={templateData?.headerValue?.example?.header_handle[0]}
                                    alt="Header" className="w-full h-[130px] border border-gray-300 object-cover rounded-t-lg mt-2" />
                            }

                            {
                                templateData.headerType === "DOCUMENT" &&
                                <div className="relative w-full h-[130px] border border-gray-300 rounded-t-lg mt-2 overflow-hidden">
                                    <iframe
                                        src={templateData?.headerValue?.example?.header_handle[0]}
                                        title="Document Preview"
                                        className="w-full h-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                                        style={{
                                            overflow: 'hidden'
                                        }}
                                    />
                                    <a
                                        href={templateData?.headerValue?.example?.header_handle[0]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 z-10"
                                        title="Open in new tab"
                                    />
                                </div>
                            }
                            {
                                templateData.headerType === "VIDEO" && <video
                                    src={templateData?.headerValue?.example?.header_handle[0]}
                                    controls
                                    className="w-full h-[130px] object-cover rounded-t-lg mt-2"
                                    autoPlay={true}
                                />
                            }

                            <article className="text-wrap bg-white p-2 rounded-b-lg w-72">
                                <p className='text-xs font-semibold break'>{
                                    templateData?.headerValue?.text}
                                </p>
                                <p className='text-xs break-words' dangerouslySetInnerHTML={{ __html: bodyText }}></p>
                                {/* templateData?.headerValue?.text?.replace(/{{(\d+)}}/g, (_, index) => templateData?.headerValue?.example?.header_text[index - 1] || `{{${index}}}`)}</p> */}

                                {/* <p className='text-sm break-words' dangerouslySetInnerHTML={{ __html: bodyText.replace(/{{(\d+)}}/g, (_, index) => templateData?.bodyValue?.example?.body_text[0][index - 1] || `{{${index}}}`) }}></p> */}
                                <p className='text-xs mt-2 text-gray-500 break'>{templateData?.footerValue?.text}</p>
                                <p className='text-xs text-end '>9.00 PM</p>
                                <hr />
                                <hr />
                                <div className='px-2'>

                                    {
                                        templateData?.buttonValue?.buttons?.length > 0 && templateData?.buttonValue?.buttons?.map((item, index) => {
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
                        <div className='flex justify-end mt-2'>
                            <button
                                onClick={() => setShowTemplate(false)}
                                className="bg-red-500 text-end text-white px-4 py-1 rounded"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}
            {deleteId && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white py-4 px-3 rounded-lg shadow-lg w-[360]">
                        <h2 className="text-xs font-bold mb-4">Really want to delete?</h2>
                        <div className='flex justify-end mt-2 gap-x-2'>
                            <button
                                onClick={() => setDeleteId(null)}
                                className="bg-red-500 text-end text-xs text-white px-4 py-1 rounded"
                            >
                                No
                            </button>
                            <button
                                onClick={() => handleDelete()}
                                className="bg-blue-500 text-end text-xs text-white px-4 py-1 rounded"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                                <option value="">All Type</option>
                                <option value="MARKETING">MARKETING</option>
                                <option value="UTILITY">UTILITY</option>
                                <option value="AUTHENTICATION">AUTHENTICATION</option>
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
                openForm && <AddTemplate
                    setOpenForm={setOpenForm}
                    openForm={openForm}
                />
            }

            {/* Consumer Table */}
            <div className="h-[70vh] overflow-y-auto">
                <table className="table-auto w-full  bg-white shadow-md rounded-lg ">
                    <thead>
                        <tr className="bg-[#084DF0] text-white text-left">
                            <th className="px-4 py-2 text-center">Sr No</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">Template Name</th>
                            <th className="px-4 py-2">Language</th>
                            <th className="px-4 py-2 text-center">Status</th>
                            <th className="px-4 py-2 text-center" >Actions</th>
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
                            paginatedTemplates.length > 0 ?
                                paginatedTemplates.map((template, index) => (
                                    <tr key={template.id} className="border-b h-max">
                                        <td className="px-4 py-2 text-center">{index + 1}</td>
                                        <td className="px-4 py-2">{template.templateCategory}</td>
                                        <td className="px-4 py-2">{template.templateName}</td>
                                        <td className="px-4 py-2">{template.templateLang}</td>
                                        <td className="px-4 py-2 text-center">{
                                            template.status === "APPROVED" ?
                                                <span className='p-1 px-1 bg-green-500 text-xs text-white rounded-sm'>Approved</span> :
                                                template.status === "REJECTED" ? <span className='p-1 bg-red-500 text-xs text-white rounded-sm'>Rejected</span> : template.status === "PENDING" ? <span className='p-1 bg-yellow-500 text-xs text-white rounded-sm'>Pending</span> : "Pending"}
                                        </td>
                                        <td className="px-4 py-2 flex justify-center space-x-2">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                onClick={() => {
                                                    setTemplateData(template)
                                                    setShowTemplate(true)
                                                }}
                                            >
                                                <IoMdEye />
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                onClick={() => setDeleteId(template?.templateId)}
                                            >
                                                <BsTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )) : !loader && <tr>
                                    <td colSpan="7" className="text-center">
                                        <div className="flex justify-center items-center h-[60vh]">
                                            <p className='text-md font-medium'>No Templates Found</p>
                                        </div>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
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

export default ManageTemplate
