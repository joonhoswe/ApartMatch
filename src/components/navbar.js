import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react"; 
import { motion, AnimatePresence } from 'framer-motion';
import { Fade as Hamburger } from 'hamburger-react';
import Login from '@components/login';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@assets/logo.png';
import notLoggedIn from '@assets/notLoggedIn.png';

export default function Navbar() {
  const [isOpen, setOpen] = useState(false);

  const { isAuthenticated } = useAuth0();

  const toggleMenu = () => {
    setOpen(!isOpen);
  };

  const navLinks = [
    //{ title: "About", path:"/about"},
    { title: "Post a Listing", path: "/postListing" },
    { title: "Contact Us", path: "/contact" },
    { title: "Advertise", path: "/advertise" },
  ];

  const sidebarVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "100%" }
  };

  return (
    <div className="flex items-center justify-between w-full h-14 sticky top-0 z-50 text-white bg-red-500 backdrop-filter backdrop-blur-lg">
      {/* dekstop navbar */}
      <div className='items-center justify-between w-full h-14 px-4 hidden md:flex'>
        
        <div className="flex items-center justify-center space-x-6">
            <Link href = '/home' className='transition duration-300 ease-in-out hover:scale-110 hover:cursor-pointer'>
                <Image src={Logo} alt="ApartMatch Logo" width={128} height={32} />
            </Link>
          
            {navLinks.map((link) => (
              <Link key={link.title} href = {link.path} className="font-bold transition duration-300 ease-in-out hover:text-gray-400"> 
                {link.title}
              </Link>
            ))}
        </div>

        <div className='flex flex-row space-x-2'>
          <Login />

          {/* profile pic or default for not signed in */}
          {
            isAuthenticated ? (
              <></>
            ) : (
              <Image src={notLoggedIn} alt='Not Logged In' className='w-6 h-6' />
            )
          }
        </div>

      </div>

      {/* mobile navbar */}
      <div className='flex items-center justify-between w-full h-14 md:hidden'>

        <Link href = '/home' className='pl-2'>
            <Image src={Logo} alt="ApartMatch Logo" width={128} height={32} />
        </Link>
        {/* Mobile NavBar Icon */}
        <div className='flex flex-row space-x-0.5 items-center justify-center'>
          <Login />
          <Hamburger rounded size={24} duration={0.4} distance='lg' hideOutline={false} onToggle={toggleMenu} />
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ duration: 0.4 }}
              className="z-20 absolute top-full right-0 h-40 w-2/5 sm:w-1/3 rounded-b-lg text-sm sm:text-base text-white bg-red-500 bg-opacity-100 flex flex-col justify-center items-center"
            >
              {/* Website Section Links */}
              <div className='flex flex-col space-y-6 items-center justify-center '>
                {navLinks.map((link) => (
                  <a href={link.path}>
                    <button key={link.title} className="font-bold">
                      {link.title}
                    </button>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence> 
      </div>
    </div>
  );
};
