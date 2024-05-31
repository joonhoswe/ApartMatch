import React, { useState } from 'react';
import Apartment from '../assets/apartment.png';

export default function Home() {
  const [school, setSchool] = useState('');

  const infoCards = [
    { 
        heading: '❌ Facebook housing groups are inefficient', 
        description: 'Say goodbye to sifting through outdated and irrelevant Facebook posts. ApartMatch offers real-time listings, ensuring you always see the most current and available housing options.' 
    },
    { 
      heading: '✅ See openings for apartments in real time', 
      description: 'Stay up-to-date with real-time availability. Instantly view and join partially filled apartments, making it easier and faster to save money while finding your ideal living situation.' 
    },
    { 
        heading: '🔒 Only students with .edu emails are allowed', 
        description: 'Safety and trust are our priorities. Only users with valid .edu email addresses can join, guaranteeing that you are matched with verified college students from your own institution.' 
    },
];

  return (
    <div className="flex flex-col items-center w-full h-screen text-white font-bold">
      <div 
        className='h-3/5 w-full flex flex-col space-y-4 justify-between items-center py-20' 
        style={{ 
          backgroundImage: `url(${Apartment.src})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className='text-md sm:text-3xl md:text-4xl flex flex-col space-y-1 sm:space-y-3 md:space-y-6 items-center'>
          <h1> No more Facebook threads. </h1>
          <h1> Instantly <span className='text-red-500 underline'> match</span> into apartments. </h1>
        </div>

        <div className='flex justify-end bg-white h-10 md:h-12 w-3/4 md:w-1/2 rounded-lg md:rounded-2xl'>
          <input 
            className={`h-full w-5/6 rounded-l-lg md:rounded-l-2xl px-4 text-black outline-none text-xs sm:text-sm lg:text-base ${school === '' ? 'text-gray-400' : ''}`} 
            placeholder="Ex: Carnegie Mellon University"
          />
          <button onClick={(e) => setSchool(e.target.value)} className='bg-red-500 h-full w-1/4 rounded-r-lg md:rounded-r-2xl hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm lg:text-base'> Find Homes! </button>
        </div>
      </div>

      <div className='bg-gray-200 h-4/5 w-full flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-12 items-center justify-center py-10'>
        {infoCards.map((card, index) => (
          <div key={index} className='bg-white text-black sm:h-2/3 md:h-4/5 w-3/4 md:w-1/4 rounded-2xl flex flex-col items-center space-y-4 p-2 md:p-6 shadow-2xl'>
            <h1 className='text-sm md:text-xl lg:text-2xl'> {card.heading} </h1>
            <p className='text-xs md:text-sm lg:text-base'> {card.description} </p>
          </div>
        ))}
      </div>
    </div>
  );
}
