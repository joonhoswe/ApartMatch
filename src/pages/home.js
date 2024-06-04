import React, { useState } from 'react';
import Router from 'next/router';
import Apartment from '@assets/home.png';

export default function Home() {
  const [school, setSchool] = useState('');
  const router = Router;

  const infoCards = [
    { 
      heading: '❌ Facebook housing groups are inefficient', 
      description: 'Say goodbye to sifting through outdated, irrelevant, and scam-filled Facebook posts. ApartMatch shows only listings by other students with extra rooms looking to be filled, enabling students to swiftly match into rooms.' 
    },
    { 
      heading: '✅ See openings for apartments in real time', 
      description: 'Stay up-to-date with real-time availability. Instantly view and join partially filled apartments, making it easier and faster to save money while finding your ideal living situation. Apartmatch\'s matches automatically close once filled.' 
    },
    { 
      heading: '🔒 Only students with .edu emails are allowed', 
      description: 'Safety and trust are our priorities. That\'s why only users with valid .edu email addresses can join and post, guaranteeing that you\'re matched with verified college students from your own school.' 
    },
  ];

  const handleFindHomes = () => {
    if (school.trim() !== '') {
      router.push(`/schoolmap?school=${encodeURIComponent(school)}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen text-white font-bold">
      <div 
        className='h-screen w-full flex flex-col space-y-4 justify-between items-center py-12' 
        style={{ 
          backgroundImage: `url(${Apartment.src})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className='text-md sm:text-3xl md:text-4xl flex flex-col space-y-1 sm:space-y-3 md:space-y-6 items-center'>
          <h1> 🐌 No more Facebook threads. </h1>
          <h1> 🔥 Instantly <span className='text-red-500 underline'> match</span> into apartments. </h1>
        </div>

        <div className='flex bg-white h-10 md:h-12 w-3/4 md:w-1/2 rounded-lg md:rounded-2xl'>
          <input 
            className={`h-full w-5/6 rounded-l-lg md:rounded-l-2xl px-4 text-black outline-none text-xs sm:text-sm lg:text-base`} 
            placeholder="Ex: Carnegie Mellon University"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Return') {
                handleFindHomes();
              }
            }}
          />
          <button 
            onClick={handleFindHomes} 
            className='bg-red-500 h-full w-1/4 flex items-center justify-center rounded-r-lg md:rounded-r-2xl hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm lg:text-base'
          >
            Find Homes!
          </button>
        </div>
      </div>

      <div className='bg-gray-200 h-screen w-full flex flex-col md:flex-row space-y-12 md:space-y-0 md:space-x-6 lg:space-x-12 items-center justify-center py-10'>
        {infoCards.map((card, index) => (
          <div key={index} className='bg-white text-black h-64 md:h-80 w-64 md:w-80 rounded-2xl flex flex-col items-center space-y-4 p-4 md:p-6 shadow-2xl'>
            <h1 className='text-sm md:text-xl lg:text-2xl'> {card.heading} </h1>
            <p className='text-xs md:text-sm lg:text-base font-normal'> {card.description} </p>
          </div>
        ))}
      </div>
    </div>
  );
}
