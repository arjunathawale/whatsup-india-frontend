import React from 'react'
import profileIcon from '../assets/profile.png'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
const HeaderBar = () => {
    const { userData } = useSelector((state) => state.user)
    return (
        <div className='flex items-center justify-between px-4 h-12 border-b bg-gray-100'>
            <p className='text-xl font-semibold'>
                Good Morning, {userData?.fullname}
            </p>
            <NavLink to="/profile">
                <img src={profileIcon} alt="" className='h-10 w-10 cursor-pointer' />
            </NavLink>

        </div>
    )
}

export default HeaderBar
