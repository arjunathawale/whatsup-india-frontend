import React from 'react'
import SideBar from '../components/SideBar'
import HeaderBar from '../components/HeaderBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className={`w-full h-screen overflow-y-auto`}>
                <HeaderBar />
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
