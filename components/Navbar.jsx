// Navbar Component
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
    const colors = ['from-blue-500 to-indigo-600', 'from-pink-500 to-purple-600', 'from-green-500 to-teal-600'];
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
    <nav className="bg-white shadow-sm px-6 md:px-8 lg:px-12 bg-gradient-to-r from-orange-100 via-pink-100 to-pink-100 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <motion.div 
        className="text-2xl font-bold text-gray-900 tracking-wide font-handwriting"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Link href="/" className='text-3xl'><span className="text-blue-600 text-4xl mr-2">Task</span>Flow</Link>
      </motion.div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <Link href="/about" className="hover:text-blue-600 transition-colors">Tasks Done</Link>
        <Link href="/add-group" className="hover:text-blue-600 transition-colors">Add Group</Link>

        {user ? (
          <div className="relative">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className={`bg-gradient-to-r ${getRandomColor()} w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-800 font-medium">{user.name.split(' ')[0]}</span>
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <motion.div 
                className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <motion.button 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity font-medium"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-2xl text-gray-800 focus:outline-none"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <motion.div 
          className="md:hidden fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 pt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link href="/" className="text-xl font-medium text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/about" className="text-xl font-medium text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>Tasks Done</Link>
          <Link href="/add-group" className="text-xl font-medium text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>Add Group</Link>
          
          {user ? (
            <div className="mt-8 flex flex-col items-center">
              <div className={`bg-gradient-to-r ${getRandomColor()} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <p className="text-gray-800 font-medium mb-4">{user.name}</p>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center text-lg text-gray-800 hover:text-blue-600"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium text-lg">
                Login
              </button>
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;