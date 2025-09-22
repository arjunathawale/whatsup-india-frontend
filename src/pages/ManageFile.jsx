import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { MdEdit } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';
import { FaEye } from 'react-icons/fa';

const ManageFile = () => {
    const showToast = useToast();
    const [files, setFiles] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterOpen, setFilterOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loader, setLoader] = useState(false)
    const filteredFiles = files.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(search.toLowerCase())
        return matchesSearch;
    });

    // Paginate filtered files
    const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedFiles = filteredFiles.slice(startIndex, startIndex + itemsPerPage);



    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1); // Reset to the first page when changing items per page
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setCurrentPage(1);
        setFiles([])
        setLoader(true)
        setTimeout(() => {
            setFiles([
                {
                    "name": "User 1",
                    "whatsappNo": "+911234567890",
                    "firstMessageTime": "2024-07-26 10:00 AM",
                    "lastMessageTime": "2024-07-26 10:15 AM",
                    "subscribed": true
                },
                {
                    "name": "User 2",
                    "whatsappNo": "+919876543210",
                    "firstMessageTime": "2024-07-26 11:00 AM",
                    "lastMessageTime": "2024-07-26 11:30 AM",
                    "subscribed": false
                },
                {
                    "name": "User 3",
                    "whatsappNo": "+915551234567",
                    "firstMessageTime": "2024-07-26 12:00 PM",
                    "lastMessageTime": "2024-07-26 12:45 PM",
                    "subscribed": true
                },
                {
                    "name": "User 4",
                    "whatsappNo": "+911112223333",
                    "firstMessageTime": "2024-07-26 01:00 PM",
                    "lastMessageTime": "2024-07-26 01:20 PM",
                    "subscribed": false
                },
                {
                    "name": "User 5",
                    "whatsappNo": "+914445556666",
                    "firstMessageTime": "2024-07-26 02:00 PM",
                    "lastMessageTime": "2024-07-26 02:50 PM",
                    "subscribed": true
                },
                {
                    "name": "User 6",
                    "whatsappNo": "+917778889999",
                    "firstMessageTime": "2024-07-26 03:00 PM",
                    "lastMessageTime": "2024-07-26 03:10 PM",
                    "subscribed": false
                },
                {
                    "name": "User 7",
                    "whatsappNo": "+911012023030",
                    "firstMessageTime": "2024-07-26 04:00 PM",
                    "lastMessageTime": "2024-07-26 04:35 PM",
                    "subscribed": true
                },
                {
                    "name": "User 8",
                    "whatsappNo": "+914045056060",
                    "firstMessageTime": "2024-07-26 05:00 PM",
                    "lastMessageTime": "2024-07-26 05:25 PM",
                    "subscribed": false
                },
                {
                    "name": "User 9",
                    "whatsappNo": "+917078089090",
                    "firstMessageTime": "2024-07-26 06:00 PM",
                    "lastMessageTime": "2024-07-26 06:40 PM",
                    "subscribed": true
                },
                {
                    "name": "User 10",
                    "whatsappNo": "+911213435656",
                    "firstMessageTime": "2024-07-26 07:00 PM",
                    "lastMessageTime": "2024-07-26 07:15 PM",
                    "subscribed": false
                },
                {
                    "name": "User 11",
                    "whatsappNo": "+919897675454",
                    "firstMessageTime": "2024-07-26 08:00 PM",
                    "lastMessageTime": "2024-07-26 08:30 PM",
                    "subscribed": true
                },
                {
                    "name": "User 12",
                    "whatsappNo": "+915453231010",
                    "firstMessageTime": "2024-07-26 09:00 PM",
                    "lastMessageTime": "2024-07-26 09:45 PM",
                    "subscribed": false
                },
                {
                    "name": "User 13",
                    "whatsappNo": "+911002003000",
                    "firstMessageTime": "2024-07-26 10:00 PM",
                    "lastMessageTime": "2024-07-26 10:20 PM",
                    "subscribed": true
                },
                {
                    "name": "User 14",
                    "whatsappNo": "+914005006000",
                    "firstMessageTime": "2024-07-26 11:00 PM",
                    "lastMessageTime": "2024-07-26 11:50 PM",
                    "subscribed": false
                },
                {
                    "name": "User 15",
                    "whatsappNo": "+917008009000",
                    "firstMessageTime": "2024-07-27 12:00 AM",
                    "lastMessageTime": "2024-07-27 12:10 AM",
                    "subscribed": true
                },
                {
                    "name": "User 16",
                    "whatsappNo": "+911239874560",
                    "firstMessageTime": "2024-07-27 01:00 AM",
                    "lastMessageTime": "2024-07-27 01:35 AM",
                    "subscribed": false
                },
                {
                    "name": "User 17",
                    "whatsappNo": "+914561237890",
                    "firstMessageTime": "2024-07-27 02:00 AM",
                    "lastMessageTime": "2024-07-27 02:25 AM",
                    "subscribed": true
                },
                {
                    "name": "User 18",
                    "whatsappNo": "+917894561230",
                    "firstMessageTime": "2024-07-27 03:00 AM",
                    "lastMessageTime": "2024-07-27 03:40 AM",
                    "subscribed": false
                },
                {
                    "name": "User 19",
                    "whatsappNo": "+911472583690",
                    "firstMessageTime": "2024-07-27 04:00 AM",
                    "lastMessageTime": "2024-07-27 04:15 AM",
                    "subscribed": true
                },
                {
                    "name": "User 20",
                    "whatsappNo": "+919638527410",
                    "firstMessageTime": "2024-07-27 05:00 AM",
                    "lastMessageTime": "2024-07-27 05:30 AM",
                    "subscribed": false
                }
            ])
            setLoader(false)
        }, 1000);
    }, [search])

    const [fileProgess, setFileProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const triggerFileUpload = () => {
        document.getElementById('fileInput').click();
    };
    const handleFileUpload = async (e) => {
        const mimTypeArray = ["image/jpeg", "image/png", "application/pdf", "video/mp4"]
        // const fileData = new FormData();
        setSelectedFile(e.target.files[0]);
        // fileData.append('file', e.target.files[0]);
        console.log(e?.target?.files[0]?.type);
        
        if (!mimTypeArray.includes(e.target.files[0].type)) {
            showToast('error', 'Invalid file type! Only JPEG, PNG, PDF or MP4 files are allowed.');
            return;
        }
        try {
            const fileData = {
                "file": e.target.files[0],
            }
    
            let originalName = e.target.files[0].name,
                type = e.target.files[0].name.split('.')[1],
                fileSize = e.target.files[0].size;
            // const data = await fileUploadAPI('/upload/clientMediaFiles', fileData, setUploadProgress)
            // if (data.status) {
            //     let newName = data.fileName;
            //     const saveData = await createAPI('/manageFiles/create', {
            //         wpClientId: _id,
            //         fileOriginalName: originalName,
            //         fileNewName: newName,
            //         fileType: type,
            //         fileSize: fileSize
            //     })

            //     if (saveData.status) {
            //         setUploadProgress(0)
            //         toast.success("File Uploaded Successfully")
            //         getData()
            //     } else {
            //         toast.error("File Upload Failed")
            //     }
            // } else {
            //     toast.error("File Upload Failed")
            // }
            // await axios.post('/upload-endpoint', fileData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            //     onUploadProgress: (progressEvent) => {
            //         if (progressEvent.total) {
            //             const progress = (progressEvent.loaded / progressEvent.total) * 100;
            //             setFileProgress((prevState) => ({
            //                 ...prevState,
            //                 fileProgress += progress,
            //             }));
            //         }
            //     },
            // });
            showToast('success', 'File uploaded successfully');
        } catch (error) {
            showToast('error', 'Error uploading file');
        }
    };

    return (
        <div className="flex-grow bg-gray-100 px-6 py-4">
            {/* Header */}
            <header className="flex justify-between items-center mb-2">
                <h1 className="text-xl font-bold">Manage Files</h1>
            </header>

            {/* Search Bar and Filter */}
            <div className="mb-4 flex justify-between items-centergap-4">
                <input
                    type="text"
                    placeholder="Search by file"
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
                        onClick={triggerFileUpload}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {'+ Upload File'}
                    </button>
                    <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            {fileProgess > 0 && (
                <div className="mt-2 mb-2 w-full">
                    <div className="bg-gray-200 rounded-full h-1 overflow-hidden">
                        <div
                            className="bg-blue-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${fileProgess}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{selectedFile?.name} {Math.round(fileProgess)}% Uploading</p>
                </div>
            )}

            {filterOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Filter</h2>
                        <div className="mb-4">
                            <label className="block text-sm mb-2">Select Customer</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 w-full py-2"
                            >
                                <option value="">All</option>
                                <option value="Subscribed">Subscribed</option>
                                <option value="Unsubscribed">Unsubscribed</option>
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
                        <div className="flex justify-end">
                            <button
                                onClick={() => setFilterOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setFilterOpen(false)}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="h-[70vh] overflow-y-auto">
                <table className="table-auto w-full bg-white shadow-md rounded-lg ">
                    <thead>
                        <tr className="bg-[#084DF0] text-white text-left">
                            <th className="px-4 py-2 text-center">Sr No</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">File Name</th>
                            <th className="px-4 py-2">Date Time</th>
                            <th className="px-4 py-2">File Size</th>
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
                            paginatedFiles.length > 0 ?
                                paginatedFiles.map((customer, index) => (
                                    <tr key={customer.id} className="border-b h-max">
                                        <td className="px-4 py-2 text-center">{index + 1}</td>
                                        <td className="px-4 py-2">{customer.name}</td>
                                        <td className="px-4 py-2">{customer.whatsappNo}</td>
                                        <td className="px-4 py-2">{customer?.firstMessageTime}</td>
                                        <td className="px-4 py-2">{customer.lastMessageTime}</td>
                                        <td className="px-4 py-2 flex justify-center space-x-2">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-400"
                                                // onClick={{}}
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                // onClick={{}}
                                            >
                                                <BsTrash />
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

export default ManageFile
