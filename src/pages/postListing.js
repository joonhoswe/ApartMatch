import React from  'react';
import logo from '@assets/logo.png'

export default function postListing() {
    return(
        <div className="text-white bg-gray-200 flex flex-col justify-center items-center overflow-hidden relative w-full min-h-[800px]" >
            <div className="text-black text-center max-w-md ">
                <div className = "text-xl">
                    Thank you for your interest in posting your listing on ApartMatch! 
                    Fill out the information below to apply. 
                </div>
                <div className ="h-8"></div>
                <div className='bg-white font-bold rounded-2xl p-4 border-y-8 border-gray-600'>
                    Personal information:
                </div>
                <div className ="h-3"></div>
                <div className='bg-white rounded-2xl p-4 border-gray-600'>
                    <input placeholder="Full name: "/>
                    <input placeholder=".edu Email Address: "/>
                </div>
                <div className ="h-3"></div>
                <div className='bg-white rounded-2xl p-4 border-gray-600'>
                    <input placeholder="Phone number: "/>
                    <input placeholder="Gender: "/>
                </div>
                <div className="h-8"></div>
                <div className='bg-white font-bold rounded-2xl p-4 border-y-8 border-gray-600'>
                    Information of Listing:
                </div>
                <div className="h-3"></div>
                <div className='bg-white rounded-2xl p-4 border-gray-600'>
                    <input placeholder="Street Address: "/>
                    <input placeholder="City: "/>
                </div>
                <div className="h-3"></div>
                <div className='bg-white rounded-2xl p-4 border-gray-600'>
                    <input placeholder="State: "/>
                    <input placeholder="Zip code: "/>
                </div>
                <div className="h-3"></div>
                <div className='bg-white rounded-2xl p-4 border-gray-600'>
                    <input className = "w-full" placeholder="How many more people do you have room for?"/>
                </div>
            </div>
        </div>
    );
}