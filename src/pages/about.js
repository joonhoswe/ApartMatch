import React from 'react';
import Apartment from '@assets/osuAstonPlaceApartments.jpeg';

export default function About() {

  return (
    <div className="text-white flex flex-col justify-center items-center overflow-hidden relative w-full min-h-[1000px]" 
    style={{ 
      backgroundImage: `url(${Apartment.src})`, 
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="text-black text-center max-w-md ">
        <div className='bg-white rounded-2xl p-4 text-xl border-y-8 border-gray-600'>
          ApartMatch was founded with a clear mission: 
          to provide college students with a standardized, 
          hassle-free platform for discovering off-campus 
          housing options. As students themselves who have experienced 
          the challenges of finding suitable housing firsthand, 
          the founders created ApartMatch to simplify this 
          process for future generations.
        </div>
        <h1 className ="h-10"></h1>
        <div className="bg-white rounded-2xl p-4 text-xl border-y-8 border-gray-600">
          Our platform streamlines the search for off-campus 
          housing, offering detailed listings with essential 
          information such as rent, availability, and current 
          residents. By clicking on a listing on our interactive 
          map, students can easily access all the necessary 
          details to make informed decisions.
        </div>
        <h1 className ="h-10"></h1>
        <div className="bg-white rounded-2xl p-4 text-xl border-y-8 border-gray-600">
          At ApartMatch, we understand the importance of finding 
          the right living environment during college. Our goal 
          is to make this search as seamless and stress-free as 
          possible, allowing students to focus on their studies 
          and campus life.
        </div>
      </div>
    </div>
  );
}
