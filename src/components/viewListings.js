import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import placeholder from '@assets/placeholder.jpeg';
import PulseLoader from 'react-spinners/PulseLoader';
import { setDefaults, fromAddress } from "react-geocode";

export default function ViewListings({ loading, listings, onListingClick, school }) {
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();

    const [city, setCity] = useState(null);
    const [state, setState] = useState(null);

    const handleGeocode = (school) => {
        if (school) {
            fromAddress(school)
                .then((response) => {
                    const addressComponents = response.results[0].address_components;
                    const localityComponent = addressComponents.find(component => component.types.includes('locality'));
                    const stateComponent = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
                    
                    if (localityComponent) {
                        setCity(localityComponent.long_name);
                        setState(stateComponent.short_name);
                    } else {
                        console.error("Locality (city) not found in address components");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.error("Address is missing or invalid.");
        }
    };

    useEffect(() => {
        if (school) {
            console.log(`now loading map for ${school}`);
            setDefaults({
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                language: "en",
                region: "es",
            });
            handleGeocode(school);
        }
    }, [school]);

    return (
        <div className='min-h-[calc(100vh-54px)] w-full sm:w-2/5 flex flex-col items-center space-y-6 text-black border-2 border-gray-300'>
            {!isAuthenticated ? (
                <div className='w-full h-10 bg-white flex items-center justify-center'>
                    <p className='font-bold text-red-500'> Please <span onClick={loginWithRedirect} className='underline hover:cursor-pointer hover:text-red-400 transition ease-in-out duration-300'> sign in </span> to join listings. </p>
                </div>
            ) : (isAuthenticated && !user.email_verified) ? (
                <div className='w-full h-10 bg-white flex items-center justify-center text-center'>
                    <p className='font-bold text-red-500 text-base'> ⚠️ ATTENTION ⚠️ <br/> You must verify your email to join listings. </p>
                </div>
            ) : null }
            
            <div className='bg-gray-200 min-h-full w-full flex flex-col space-y-2 items-center justify-start overflow-auto'>
                {loading ? (
                    <div className='h-full w-full flex items-center justify-center bg-white'>
                        <PulseLoader color="#ef4444" />
                    </div>
                ) : (
                    <>
                        <div className='w-full h-10 bg-white flex items-center justify-start px-2 border-b-2 border-gray-300'>
                            <p className='text-sm'> {listings.length} listings in {city}, {state} </p>
                        </div>
                        {listings.map((listing, index) => (
                            <div key={index} onClick={() => onListingClick(listing)} className={`${listing.rooms - listing.joinedListing.length === 0 ? 'hidden' : 'flex'} bg-white relative flex-col h-auto w-full hover:cursor-pointer border-y-2 border-gray-300`}>
                                {/* badge for gender preference */}
                                <div className={`${listing.gender === 'males' ? 'bg-blue-500' : listing.gender === 'females' ? 'bg-pink-500' : 'bg-gray-500'} absolute top-2 right-2 text-white font-bold text-xs w-16 h-4 p-1 rounded-md flex items-center justify-center`}>
                                    <p className=''> {listing.gender} </p>
                                </div>

                                {/* owner badge */}
                                <div className={`${listing.owner === user.nickname ? 'block' : 'hidden'} absolute top-2 left-2 bg-yellow-400 text-white font-bold text-xs w-18 h-4 p-1 rounded-md flex items-center justify-center`}>
                                    <p className=''> ☆OWNER </p>
                                </div>

                                {/* listing images */}
                                <img src={!listing.images[0] ? placeholder.src : listing.images[0]} alt='Listing Image' className='h-40 w-full' />

                                <div className='flex flex-col space-y-1 justify-start text-start px-2 py-1'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex flex-row space-x-1 items-center'>
                                            <h1 className='text-base font-bold'> ${listing.rent}/mo </h1>
                                            <p className='text-xs'> {listing.rooms} bed, {listing.bathrooms} bath </p>
                                        </div>
                                        <p className='text-xs font-bold text-green-500'> {listing.rooms - listing.joinedListing.length} / {listing.rooms} Rooms Open </p>
                                    </div>

                                    <p className='text-xs'> {listing.address} <br/> {listing.city}, {listing.state}, {listing.zipCode} </p>
                                    <p className='text-xs'> Unit #: {listing.homeType === 'apartment' ? listing.unit: 'N/A'} </p>

                                    <div className='flex items-center justify-center pt-4 pb-2'>
                                        {/* if the user is not logged in, hide Join button */}
                                        {isAuthenticated && user.email_verified && listing.owner === user.nickname ? (
                                            <button className='w-16 h-6 outline-none ring-2 ring-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 flex items-center justify-center text-xs font-bold transition ease-in-out duration-300 rounded-md'>
                                                Delete
                                            </button>
                                        ) :
                                        isAuthenticated && user.email_verified && listing.joinedListing.includes(user.nickname) ? (
                                            <button className='w-16 h-6 outline-none ring-2 ring-orange-500 bg-orange-500 text-white hover:bg-white hover:text-orange-500 flex items-center justify-center text-xs font-bold transition ease-in-out duration-300 rounded-md'>
                                                Leave
                                            </button>
                                        ) : 
                                        isAuthenticated && user.email_verified && !listing.joinedListing.includes(user.nickname) ? (
                                            <button className='w-16 h-6 outline-none ring-2 ring-green-500 bg-green-500 text-white hover:bg-white hover:text-green-500 flex items-center justify-center text-xs font-bold transition ease-in-out duration-300 rounded-md'>
                                                Join
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
