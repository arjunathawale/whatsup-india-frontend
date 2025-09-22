import React from 'react'
import comments from '../assets/comments.png'
import team from '../assets/team.png'
import template from '../assets/template.png'
import mail from '../assets/mail.png'
import delivered from '../assets/delivered.png'
import seen from '../assets/seen.png'
import BarChart from '../components/BarChart';
const Dashboard = () => {
    const data = [
        40, 60, 80, 50, 100, 20, 30, 70, 90, 45, 85, 65, 55, 35, 75, 95, 25, 15, 105, 50, 80, 60, 40, 70, 30, 20, 50, 75, 85, 65, 95,
    ];

    const categories = Array.from({ length: 31 }, (_, i) => `${i + 1} Jan 2025`)
    return (
        <div className="flex-grow bg-gray-100 px-6 py-4">
            <header className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </header>
            <div className="mb-4 flex justify-between items-centergap-4">
                <div className="w-44 h-20 bg-blue-500 rounded-lg flex items-center justify-between text-white relative cursor-pointer">
                    <div className='ml-4'>
                        <div className="text-xl font-bold">1580849</div>
                        <div className="text-lg font-semibold">Messages</div>
                    </div>
                    <div className="absolute bottom-[-30] right-2 overflow-hidden transform transition duration-300 hover:scale-110">
                        <img
                            src={comments}
                            alt="icon"
                            className="w-12 h-12 opacity-50 hover:opacity-100"
                            style={{ clipPath: 'inset(0 0 -50% 0)' }}
                        />
                    </div>
                </div>
                <div className="w-44 h-20 bg-[#B8FC7F] rounded-lg flex items-center justify-between text-white relative cursor-pointer">
                    <div className='ml-4'>
                        <div className="text-xl font-bold">7829</div>
                        <div className="text-lg font-semibold">User</div>
                    </div>
                    <div className="absolute bottom-[-30] right-2 overflow-hidden transform transition duration-300 hover:scale-110">
                        <img
                            src={team}
                            alt="icon"
                            className="w-12 h-12 opacity-50 hover:opacity-100"
                            style={{ clipPath: 'inset(0 0 -50% 0)' }}
                        />
                    </div>
                </div>
                <div className="w-44 h-20 bg-[#E66AFF] rounded-lg flex items-center justify-between text-white relative cursor-pointer">
                    <div className='ml-4'>
                        <div className="text-xl font-bold">246</div>
                        <div className="text-lg font-semibold">Template</div>
                    </div>
                    <div className="absolute bottom-[-30] right-2 overflow-hidden transform transition duration-300 hover:scale-110">
                        <img
                            src={template}
                            alt="icon"
                            className="w-12 h-12 opacity-50 hover:opacity-100"
                            style={{ clipPath: 'inset(0 0 -50% 0)' }}
                        />
                    </div>
                </div>
                <div className="w-44 h-20 bg-[#88D498] rounded-lg flex items-center justify-between text-white relative cursor-pointer">
                    <div className='ml-4'>
                        <div className="text-xl font-bold">1568988</div>
                        <div className="text-lg font-semibold">Send</div>
                    </div>
                    <div className="absolute bottom-[-30] right-2 overflow-hidden transform transition duration-300 hover:scale-110">
                        <img
                            src={mail}
                            alt="icon"
                            className="w-12 h-12 opacity-50 hover:opacity-100"
                            style={{ clipPath: 'inset(0 0 -50% 0)' }}
                        />
                    </div>
                </div>
                <div className="w-44 h-20 bg-[#FD2E2E] rounded-lg flex items-center justify-between text-white relative cursor-pointer">
                    <div className='ml-4'>
                        <div className="text-xl font-bold">1293034</div>
                        <div className="text-lg font-semibold">Delivered</div>
                    </div>
                    <div className="absolute bottom-[-30] right-2 overflow-hidden transform transition duration-300 hover:scale-110">
                        <img
                            src={delivered}
                            alt="icon"
                            className="w-12 h-12 opacity-50 hover:opacity-100"
                            style={{ clipPath: 'inset(0 0 -50% 0)' }}
                        />
                    </div>
                </div>
                <div className="w-44 h-20 bg-[#FBAFAF] rounded-lg flex items-center justify-between text-white relative cursor-pointer">
                    <div className='ml-4'>
                        <div className="text-xl font-bold">358400</div>
                        <div className="text-lg font-semibold">Read</div>
                    </div>
                    <div className="absolute bottom-[-30] right-2 overflow-hidden transform transition duration-300 hover:scale-110">
                        <img
                            src={seen}
                            alt="icon"
                            className="w-12 h-12 opacity-50 hover:opacity-100"
                            style={{ clipPath: 'inset(0 0 -50% 0)' }}
                        />
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <BarChart data={data} categories={categories} title={'Daily Message Count'} xaxisTitle={'Days'} yaxisTitle={'Messages'} />
            </div>
        </div>
    )
}

export default Dashboard
