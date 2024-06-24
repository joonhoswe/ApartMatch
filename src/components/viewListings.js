import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import placeholder from '@assets/placeholder.jpeg';
import PacmanLoader from 'react-spinners/PacmanLoader';

export default function ViewListings({ loading, listings, onListingClick, city, state }) {
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();
    console.log(city, state);

    return (
        <div className='min-h-[calc(100vh-54px)] w-full sm:w-2/5 flex flex-col items-center space-y-6 text-black border-2 border-gray-500'>
            {!isAuthenticated ? (
                <div className='w-full h-10 bg-white flex items-center justify-center'>
                    <p className='font-bold text-red-500'> Please <span onClick={loginWithRedirect} className='underline hover:cursor-pointer hover:text-red-400 transition ease-in-out duration-300'> sign in </span> to join listings. </p>
                </div>
            ) : (isAuthenticated && !user.email_verified) ? (
                <div className='w-full h-10 bg-white flex items-center justify-center text-center'>
                    <p className='font-bold text-red-500 text-base'> ⚠️ ATTENTION ⚠️ <br/> You must verify your email to join listings. </p>
                </div>
            ) : <div className='w-full h-2 bg-white flex items-center justify-start pt-4'>
                    <p className=''> {listings.length} listings found in {city}, {state} </p>
                </div>
            } 
            <div className='bg-gray-200 min-h-full w-full flex flex-col space-y-2 items-center justify-start py-6 overflow-auto'>
                {loading ? (
                    <div className='h-full w-full flex items-center justify-center bg-white'>
                        <PacmanLoader color="#ef4444" />
                    </div>
                ) : (
                    listings.map((listing, index) => (
                        <div key={index} onClick={() => onListingClick(listing)} className={`${listing.rooms - listing.joinedListing.length === 0 ? 'hidden' : 'flex'} bg-white relative flex-col h-auto w-full hover:cursor-pointer`}>
                            {/* badge for gender preference */}
                            <div className={`${listing.gender == 'males' ? 'bg-blue-500' : listing.gender === 'females' ? 'bg-pink-500' : 'bg-gray-500'} absolute top-2 right-2 text-white font-bold text-xs w-16 h-4 p-1 rounded-md flex items-center justify-center`}>
                                <p className=''> {listing.gender} </p>
                            </div>

                            {/* owner badge */}
                            <div className={`${listing.owner == user.nickname ? 'block' : 'hidden'} absolute top-2 left-2 bg-yellow-400 text-white font-bold text-xs w-18 h-4 p-1 rounded-md flex items-center justify-center`}>
                                <p className=''>☆OWNER </p>
                            </div>

                            {/* listing images */}
                            <img src={!listing.imageUrl ? placeholder.src : listing.imageUrl} alt='placeholder' className='h-24 w-full' />

                            <div className='flex flex-col space-y-1 justify-start text-start px-2 py-4'>
                                <div className='flex flex-row space-x-1 items-center'>
                                    <h1 className='text-sm font-bold'> ${listing.rent}/mo </h1>
                                    <p className='text-xs'> {listing.rooms} bed, {listing.bathrooms} bath </p>
                                </div>
                                <p className='text-xs font-bold text-green-500'> {listing.rooms - listing.joinedListing.length} / {listing.rooms} Rooms Open </p>
                                <p className='text-xs'> {listing.address} <br/> {listing.city}, {listing.state}, {listing.zipCode} </p>

                                <div className='flex items-center justify-center'>
                                {/* if the user is not logged in, hide Join button */}
                                {isAuthenticated && user.email_verified && listing.owner === user.nickname ? (
                                    <button className='mt-2 w-12 h-4 outline-none ring-2 ring-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 flex items-center justify-center text-xs font-bold transition ease-in-out duration-300 rounded-md'>
                                        Delete
                                    </button>
                                ) :
                                isAuthenticated && user.email_verified && listing.joinedListing.includes(user.nickname) ? (
                                    <button className='mt-2 w-12 h-4 outline-none ring-2 ring-orange-500 bg-orange-500 text-white hover:bg-white hover:text-orange-500 flex items-center justify-center text-xs font-bold transition ease-in-out duration-300 rounded-md'>
                                        Leave
                                    </button>
                                ) : 
                                isAuthenticated && user.email_verified && !listing.joinedListing.includes(user.nickname) ? (
                                    <button className='mt-2 w-12 h-4 outline-none ring-2 ring-green-500 bg-green-500 text-white hover:bg-white hover:text-green-500 flex items-center justify-center text-xs font-bold transition ease-in-out duration-300 rounded-md'>
                                        Join
                                    </button>
                                ) : null}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
