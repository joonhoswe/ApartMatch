import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import placeholder from '@assets/placeholder.jpeg';
import axios from 'axios';

export default function ListingPopup({ listing, refreshListing }) {
    const { user, isAuthenticated } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState(false);

    const handleJoin = async (id, user) => {
        try {
            await axios.patch('http://localhost:8000/api/join/', { id, user });
            await refreshListing(); // Re-fetch listings after join
        } catch (error) {
            console.error('Error joining listing:', error);
        }
    };

    const handleLeave = async (id, user) => {
        try {
            await axios.patch('http://localhost:8000/api/leave/', { id, user });
            await refreshListing(); // Re-fetch listings after leave
        } catch (error) {
            console.error('Error leaving listing:', error);
        }
    };

    return (
        <div className='z-50 h-full w-full bg-white text-black rounded-lg flex flex-col items-center justify-between p-2'>
            <div className='h-3/5 w-3/5 mb-2'>
                <img src={placeholder.src} alt='placeholder' className='h-full w-full object-cover' />
            </div>

            <div className='flex flex-col space-y-1 justify-start text-start w-full px-4 mb-4'>
                <div className='flex flex-row space-x-1 items-center'>
                    <h1 className='text-base font-bold'>${listing.rent}/mo</h1>
                    <p className='text-sm'>{listing.rooms} bed, {listing.bathrooms} bath</p>
                </div>
                <p className='text-xs font-bold text-green-500'>{listing.rooms - listing.joinedListing.length} / {listing.rooms} Rooms Open</p>
                <p className='text-xs'>{listing.address}</p>
                <p className='text-xs'>{listing.city}, {listing.state}, {listing.zipCode}</p>
            </div>

            {
                isAuthenticated && listing.joinedListing.includes(user.nickname) ? 
                <div className=' h-12 flex flex-col space-y-2 items-center justify-center'>
                    <p className={`text-xs font-bold text-red-500 ${confirm ? 'block' : 'hidden'}`}> Are you sure you want to leave this listing? </p>
                    <div className={`flex flex-row space-x-8 ${confirm ? 'block' : 'hidden'}`}>
                        <button onClick={() => {handleLeave(listing.id, user.nickname); setConfirm(false)}} className='w-16 h-6 outline-none ring-2 ring-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 text-sm font-bold transition ease-in-out duration-300 rounded-lg'> 
                            Confirm 
                        </button>
                        <button onClick={() => setConfirm(false)} className='w-16 h-6 outline-none ring-2 ring-gray-500 bg-gray-500 text-white hover:bg-white hover:text-gray-500 text-sm font-bold transition ease-in-out duration-300 rounded-lg'> 
                            Cancel 
                        </button>
                    </div>
                    <button onClick={() => setConfirm(true)} className={`w-16 h-6 outline-none ring-2 ring-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 text-sm font-bold transition ease-in-out duration-300 rounded-lg ${confirm ? 'hidden' : 'block'}`}> 
                        Leave 
                    </button>
                </div>
                : isAuthenticated && !listing.joinedListing.includes(user.nickname) ? 
                <div className=' h-12 flex flex-col space-y-2 items-center justify-center'>
                    <p className={`text-xs font-bold text-green-500 ${confirm ? 'block' : 'hidden'}`}> Join this listing? </p>
                    <div className={`flex flex-row space-x-8 ${confirm ? 'block' : 'hidden'}`}>
                        <button onClick={() => {handleJoin(listing.id, user.nickname); setConfirm(false)}} className='w-16 h-6 outline-none ring-2 ring-green-500 bg-green-500 text-white hover:bg-white hover:text-green-500 text-sm font-bold transition ease-in-out duration-300 rounded-lg'> 
                            Confirm 
                        </button>
                        <button onClick={() => setConfirm(false)} className='w-16 h-6 outline-none ring-2 ring-gray-500 bg-gray-500 text-white hover:bg-white hover:text-gray-500 text-sm font-bold transition ease-in-out duration-300 rounded-lg'> 
                            Cancel 
                        </button>
                    </div>
                    <button onClick={() => setConfirm(true)} className={`w-16 h-6 outline-none ring-2 ring-green-500 bg-green-500 text-white hover:bg-white hover:text-green-500 text-sm font-bold transition ease-in-out duration-300 rounded-lg ${confirm ? 'hidden' : 'block'}`}> 
                        Join 
                    </button>
                </div>
                : <></>
            }
        </div>
    );
}
