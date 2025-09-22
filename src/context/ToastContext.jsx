import React, { createContext, useState, useContext } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        show: false,
        type: "",
        message: "",
    });

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            {toast.show && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast({ show: false, type: "", message: "" })}
                />
            )}
        </ToastContext.Provider>
    );
};
