import React from "react";

const Toast = ({ type, message, onClose }) => {
    const toastStyles = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        info: "bg-blue-500 text-white",
    };
    const iconStyles = {
        success: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                width="24"
                height="24"
            >
                <path d="M9 19L5 15L9 11L13 15L17 11L21 15L17 19L13 15L9 19Z" />
            </svg>
        ),
        error: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                width="24"
                height="24"
            >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
        ),
        info: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                width="24"
                height="24"
            >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
        ),
    };

    return (
        <div
            className={`fixed top-5 right-5 px-4 py-3 rounded shadow-lg flex items-center gap-3 transition-transform transform ${toastStyles[type]} z-50 pointer-events-auto`}
        >
            <span className="text-white">{iconStyles[type]}</span>
            <p>{message}</p>
            <button
                onClick={onClose}
                className="ml-auto text-xl text-white hover:text-gray-200"
            >
                &times;
            </button>
        </div>
    );
};

export default Toast;
