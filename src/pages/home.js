import React, { useState } from 'react';
import Apartment from '../assets/apartment.png';

export default function Home() {
  const [school, setSchool] = useState('');

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
        <div className='text-4xl flex flex-col space-y-6'>
          <h1> No more Facebook threads. </h1>
          <h1> Start quickly <span className='text-red-500'> matching </span> into apartments. </h1>
        </div>

        <div className='flex justify-end bg-white h-12 w-1/2 rounded-2xl'>
          <input 
            className={`h-full w-5/6 rounded-l-2xl px-4 text-black outline-none ${school === '' ? 'text-gray-400' : ''}`} 
            placeholder="Ex: Carnegie Mellon University"
          />
          <button onClick={(e) => setSchool(e.target.value)} className='bg-red-500 h-full w-1/4 rounded-r-2xl hover:bg-red-600 transition ease-in-out duration-300'> Find Homes! </button>
        </div>
      </div>

      <div className='bg-gray-200 h-4/5 w-full flex items-center justify-center'>
        <div className='w-5/6 h-5/6 rounded-3xl bg-white'>
          
        </div>

      </div>
    </div>
  );
}
