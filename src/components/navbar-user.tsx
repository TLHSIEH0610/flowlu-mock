"use client";
import { useState } from "react";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaSlidersH,
  FaExchangeAlt,
} from "react-icons/fa";
import { User } from "@prisma/client";

export default function UserIcon({ user }: { user: User }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-cyan-500 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg font-semibold focus:outline-none"
      >
        {user.name.toUpperCase()[0]}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-blue-600 text-white rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-blue-500">
            <div className="text-lg font-semibold">{user.name}</div>
            <div className="text-sm text-gray-200">{user.email}</div>
          </div>
          <ul className="py-2 text-sm">
            <li className="hover:bg-blue-700 px-4 py-2 flex items-center gap-2 cursor-pointer">
              <FaUserCircle />
              My Profile
            </li>
            <li className="hover:bg-blue-700 px-4 py-2 flex items-center gap-2 cursor-pointer">
              <FaSlidersH />
              Personalization
            </li>
            <li className="hover:bg-blue-700 px-4 py-2 flex items-center gap-2 cursor-pointer">
              <FaExchangeAlt />
              My Accounts
            </li>
            <li className="hover:bg-blue-700 px-4 py-2 flex items-center gap-2 cursor-pointer">
              <FaSignOutAlt />
              Log Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
