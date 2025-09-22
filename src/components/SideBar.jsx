import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import whatsapp from '../assets/whatsapp.png';
import { FaLink, FaMailBulk, FaTachometerAlt } from 'react-icons/fa';
import { MdMoney, MdPeople, MdPlayLesson, MdSubscriptions } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';
import { FiMessageCircle, FiMessageSquare } from 'react-icons/fi';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { IoCaretDown } from "react-icons/io5";
import { BsSend } from 'react-icons/bs';
import { BiConversation, BiPurchaseTagAlt } from 'react-icons/bi';
import { TbMessageChatbot, TbTemplate, TbUsersGroup } from 'react-icons/tb';
import { useSelector } from 'react-redux';
const menuData = {
  logo: whatsapp,
  brand: "Whatsup India",
  menu: [
    { label: "Dashboard", icon: <FaTachometerAlt />, link: "/" },
    // { label: "Manage Customers", icon: <TbUsersGroup />, link: "/customers" },
    { label: "Manage Templates", icon: <TbTemplate />, link: "/templates" },
    { label: "Generate Media Link", icon: <FaLink />, link: "/manage-files" },
    { label: "Broadcast Message", icon: <BsSend />, link: "/send-message" },
    // { label: "Broadcast Details", icon: <FiMessageCircle />, link: "/broadcast-details" },
    { label: "Manage Chatbots", icon: <TbMessageChatbot />, link: "/chatbots" },
    { label: "Messenger", icon: <BiConversation />, link: "/messenger" }
  ],
  logout: { label: "Logout", icon: <RiLogoutBoxRLine />, link: "/login" }
};

const adminData = {
  logo: whatsapp,
  brand: "Whatsup India",
  menu: [
    { label: "Dashboard", icon: <FaTachometerAlt />, link: "/" },
    { label: "Manage Clients", icon: <MdPeople />, link: "/manage-clients" },
    { label: "Manage Plans", icon: <MdSubscriptions />, link: "/manage-plan" },
    { label: "Manage Subscription", icon: <BiPurchaseTagAlt />, link: "/subscription" },
    { label: "Generate Media Link", icon: <FaLink />, link: "/manage-files" },
  ],
  logout: { label: "Logout", icon: <RiLogoutBoxRLine />, link: "/login" }
}
const SideBar = () => {
  const { role } = useSelector(state => state.user)
  const [menu, setMenu] = useState(role === "ADMIN" ? adminData.menu : menuData.menu);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleSubMenuToggle = (index) => {
    const updatedMenu = [...menu];
    updatedMenu[index].isOpen = !updatedMenu[index].isOpen; // Toggle the submenu open/close
    setMenu(updatedMenu);
    // Set the active menu index if it's a main menu item
    setActiveIndex(index);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-[#084DF0] text-white flex flex-col">
        <div className="flex items-center justify-center h-20 border-b border-blue-700">
          <img
            src={menuData.logo}
            alt="Logo"
            className="h-12 w-12 rounded-sm"
          />
          <span className="ml-2 text-xl font-bold">{menuData.brand}</span>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-1 mt-4 px-2">
            {menu.map((item, index) => (
              <li key={index}>
                {/* Check if item has a submenu */}
                <div>
                  {item.subMenu ? (
                    // Button for submenu items
                    <button
                      className={`flex items-center px-4 py-2 w-full text-left hover:bg-white hover:text-black rounded ${activeIndex === index ? 'bg-white text-black' : ''}`}
                      onClick={() => handleSubMenuToggle(index)} // Toggle submenu
                    >
                      <span className="material-icons">{item.icon}</span>
                      <span className="ml-3">{item.label}</span>
                      <span className={`ml-auto transform transition-transform duration-300 ${item.isOpen ? 'rotate-180' : ''}`}>
                        <span className="material-icons"><IoCaretDown /></span>
                      </span>
                    </button>
                  ) : (
                    // Direct Link for items without submenus
                    <NavLink
                      to={item.link}
                      className={`flex items-center px-4 py-2 w-full text-left hover:bg-white hover:text-black rounded ${activeIndex === index ? 'bg-white text-black' : ''}`}
                      onClick={() => setActiveIndex(index)} // Set active item on click
                    >
                      <span className="material-icons">{item.icon}</span>
                      <span className="ml-3">{item.label}</span>
                    </NavLink>
                  )}
                  {item.subMenu && item.isOpen && (
                    <ul className="ml-8 mt-2 space-y-1 transition-all duration-300 ease-in-out">
                      {item.subMenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink to={subItem.link} className="flex items-center gap-2 px-4 py-2 hover:bg-white hover:text-black rounded">
                            <span className="material-icons">{subItem.icon}</span>
                            {subItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
        <NavLink onClick={handleLogout} className="flex items-center justify-center px-4 py-2 mt-auto hover:bg-white hover:text-black">
          <span className="material-icons">{menuData.logout.icon}</span>
          <span className="ml-1">{menuData.logout.label}</span>
        </NavLink>
      </aside>
    </div>
  );
};

export default SideBar;
