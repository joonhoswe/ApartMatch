import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import placeholder from '@assets/placeholder.jpeg';

export default function ListingPopup({ listing }) {
    const { user, isAuthenticated, isLoading } = useAuth0();

    return (
        <div className='z-50 w-full bg-white text-black rounded-md flex flex-col items-center p-4'>
            <img src={placeholder.src} alt='placeholder' className='h-32 w-full mb-2' />
            <div className='flex flex-col space-y-1 justify-start text-start w-full px-4'>
                <div className='flex flex-row space-x-1 items-center'>
                    <h1 className='text-sm font-bold'>${listing.rent}/mo</h1>
                    <p className='text-xs'>{listing.rooms} bed, {listing.bathrooms} bath</p>
                </div>
                <p className='text-xs font-bold text-green-500'>{listing.rooms - listing.joinedListing.length} / {listing.rooms} Rooms Open</p>
                <p className='text-xs'>{listing.address}</p>
                <p className='text-xs'>{listing.city}, {listing.state}, {listing.zipCode}</p>
                {isAuthenticated && listing.joinedListing.includes(user.nickname)
                    ? <p className='text-gray-400 text-xs font-bold text-center'>Already Joined</p>
                    : isAuthenticated && !listing.joinedListing.includes(user.nickname) ? <button onClick={() => handleJoin(listing.id, user.nickname)} className='text-red-500 text-xs font-bold transition ease-in-out duration-300 hover:text-gray-400'>Join</button>
                    : <></>}
            </div>
        </div>
    );
}
