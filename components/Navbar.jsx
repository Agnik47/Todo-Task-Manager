'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const getRandomColor = () => {
    const colors = ['bg-green-600', 'bg-pink-600', 'bg-yellow-500', 'bg-purple-600', 'bg-red-600'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-orange-100 via-pink-100 to-pink-100 shadow-sm px-6 md:px-24 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <div className="text-3xl font-extrabold text-gray-900 tracking-wide">
        <Link href="/"><span className="text-blue-600">Todo</span>List</Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-12 text-sm font-medium text-gray-700">
        <Link href="/" className="hover:text-blue-600 transition">Home</Link>
        <Link href="/about" className="hover:text-blue-600 transition">Tasks Done</Link>
        <Link href="/contact" className="hover:text-blue-600 transition">Add Group</Link>

        {user ? (
          <div className="relative flex items-center space-x-3 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {/* DP */}
            <div className={`w-10 h-10 ${getRandomColor()} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            {/* Name */}
            <span className="text-gray-800 font-semibold">{user.name}</span>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-14 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <button className="border border-blue-600 text-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition font-semibold text-sm">
              Login
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-gray-800 focus:outline-none">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col space-y-4 text-sm font-medium text-gray-700 md:hidden transition">
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <button className="border border-blue-600 text-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition font-semibold text-sm w-full text-left">
              Login
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
