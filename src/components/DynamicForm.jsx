import React from 'react';

const DynamicForm = ({ items, column, selectedOptions, setSelectedOptions }) => {
    const handleSelectChange = (index, value, i) => {
        const newSelectedOptions = [...selectedOptions]
        newSelectedOptions[i] = { ACTUAL_VALUE: index, COL_NAME: value }
        setSelectedOptions(newSelectedOptions);
    };

    return (
        <div className="">
            {items.map((item, index) => (
                <div key={index} className="flex items-center mb-4 gap-4">
                    <input
                        type="text"
                        value={item}
                        disabled
                        className="w-full text-center border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <select
                        value={selectedOptions[index]?.COL_NAME}
                        onChange={(e) => handleSelectChange(item, e.target.value, index)}
                        className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none">
                        <option className='w-12 py-3' value={"Select"}>{"Select"}</option>
                        {
                            column.map((column, index) => (
                                <option key={index} className='w-12 py-3' value={column}>{column}</option>
                            ))
                        }
                    </select>
                </div>
            ))}
        </div>
    );
};

export default DynamicForm;