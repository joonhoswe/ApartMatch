import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import placeholder from '@assets/placeholder.jpeg';
import axios from 'axios';

export default function ListingPopup({ listing }) {
    const { user, isAuthenticated } = useAuth0();

    const handleJoin = async(id, user) => {
        try {
          const response = await axios.patch('http://localhost:8000/api/join/', { id, user });
          console.log('Response:', response.data);

        } catch (error) {
          if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
          } else if (error.request) {
            console.error('Error request data:', error.request);
          } else {
            console.error('Error message:', error.message);
          }
          console.error('Error config:', error.config);
        }
      }

    const handleLeave = async(id, user) => {
        try {
          const response = await axios.patch('http://localhost:8000/api/leave/',{id,user});
          console.log('Response:',response.data);

        } catch (error){
          if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
          } else if (error.request) {
            console.error('Error request data:', error.request);
          } else {
            console.error('Error message:', error.message);
          }
          console.error('Error config:', error.config);
        }
      }

    return (
        <div className='z-50 w-full bg-white text-black rounded-lg flex flex-col items-center justify-between p-4'>
            <img src={placeholder.src} alt='placeholder' className='h-50 w-full mb-2' />

            <div className='flex flex-col space-y-1 justify-start text-start w-full px-4'>
                <div className='flex flex-row space-x-1 items-center'>
                    <h1 className='text-base font-bold'>${listing.rent}/mo</h1>
                    <p className='text-sm'>{listing.rooms} bed, {listing.bathrooms} bath</p>
                </div>
                <p className='text-sm font-bold text-green-500'>{listing.rooms - listing.joinedListing.length} / {listing.rooms} Rooms Open</p>
                <p className='text-xs'>{listing.address}</p>
                <p className='text-xs'>{listing.city}, {listing.state}, {listing.zipCode}</p>
            </div>

            {
                isAuthenticated && listing.joinedListing.includes(user.nickname) ? 
                <button onClick={() => {handleLeave(listing.id, user.nickname)}} className='w-16 h-6 outline-none ring-2 ring-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 text-sm font-bold transition ease-in-out duration-300 rounded-lg'> 
                    Leave 
                </button>
                : isAuthenticated && !listing.joinedListing.includes(user.nickname) ? 
                <button onClick={() => handleJoin(listing.id, user.nickname)} className='w-16 h-6 outline-none ring-2 ring-green-500 bg-green-500 text-white hover:bg-white hover:text-green-500 text-sm font-bold transition ease-in-out duration-300 rounded-lg'>
                    Join
                </button>
                : <></>
            }

        </div>
    );
}
