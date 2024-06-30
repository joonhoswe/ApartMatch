import React, { act, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import placeholder from '@assets/placeholder.jpeg';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import AWS from 'aws-sdk';
import taken from '@assets/taken.png';
import available from '@assets/available.png';

export default function ListingPopup({ allListings, listing, refreshListing, changePopupActive, changeUserListing }) {
    const { user, isAuthenticated } = useAuth0();
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const s3 = new AWS.S3({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        region: 'us-east-2',
    });

    const handleJoin = async (id, user) => {
        setLoading(true);
        try {
            await axios.patch('http://localhost:8000/api/join/', { id, user });
            await refreshListing(); // Re-fetch listings after join
            await changePopupActive(false);
        } catch (error) {
            console.error('Error joining listing:', error);
        }
        setLoading(false);
        setConfirm(false);
    };

    const handleLeave = async (id, user) => {
        setLoading(true);
        try {
            await axios.patch('http://localhost:8000/api/leave/', { id, user });
            await refreshListing(); // Re-fetch listings after leave
            await changePopupActive(false);
        } catch (error) {
            console.error('Error leaving listing:', error);
        }
        setLoading(false);
        setConfirm(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            // Find the listing to be deleted using the provided id
            const listing = allListings.find(listing => listing.id === id);
            if (!listing) {
                throw new Error("Listing not found");
            }
    
            // Delete the listing from the database
            await axios.delete(`http://localhost:8000/api/delete/${id}`);
    
            // Delete images from AWS S3
            for (const imageUrl of listing.images) {
                const imageKey = imageUrl.split('/').pop();
                if (imageKey.length !== 0) {
                    const information = {
                        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
                        Key: imageKey,
                    };
                    await s3.deleteObject(information).promise();
                }
            }
    
            // Update the local state to remove the deleted listing
            const updatedListings = allListings.filter(listing => listing.id !== id);

            // Update the user's listings if called from Profile to re-render the listings joined by the user
            if (changeUserListing) {
                await changeUserListing(updatedListings);
            }
            else{
                await refreshListing(updatedListings);
            }

            await changePopupActive(false);
        } catch (error) {
            console.error('Error deleting listing:', error);
        } finally {
            setLoading(false);
            setConfirm(false);
        }
    };

    const handlePrev = () => {
        if (activeImage === 0) {
            setActiveImage(listing.images.length - 1);
        }
        else setActiveImage(activeImage - 1);
    };

    const handleNext = () => {
        if (activeImage === listing.images.length - 1) {
            setActiveImage(0);
        }
        else setActiveImage(activeImage + 1);
    };

    return (
        <div className='z-50 relative h-full w-full bg-white text-black rounded-lg flex flex-col items-center justify-between' >
            
            <button
                onClick={() => changePopupActive(false)}
                className='z-50 absolute top-0 right-0 h-8 w-8 rounded-lg outline-none ring-2 ring-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 transition duration-300 ease-in-out font-bold'
            >
                x
            </button>
            <div className='h-3/5 w-full mb-2 relative'>
                <button onClick={handlePrev} className='z-10 absolute top-1/2 left-4 h-6 w-6 md:h-9 md:w-9 rounded-full bg-white text-black flex items-center justify-center text-base md:text-2xl font-bold shadow-2xl hover:bg-red-500 transition ease-in-out duration-300'> 〈  </button>
                
                <img src={!listing.images[activeImage] ? placeholder.src : listing.images[activeImage]} alt='Listing Image' className='h-96 w-160' />

                <button onClick={handleNext} className='z-10 absolute top-1/2 right-4 h-6 w-6 md:h-9 md:w-9 rounded-full bg-white text-black flex items-center justify-center text-base md:text-2xl font-bold shadow-2xl hover:bg-red-500 transition ease-in-out duration-300'> 〉  </button>
            
                <div className='z-50 absolute bottom-2 left-1/2 flex flex-row space-x-2 items-center justify-center'>
                    { listing.images.map((exp, index) => (
                        <div key={index} className={`rounded-full h-2 w-2 ${activeImage === index ? 'bg-red-500' : 'bg-white'}`}/>
                    ))}
                </div>
            </div>

            <div className='flex flex-col space-y-1 justify-start text-start w-full px-4 mb-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex flex-row space-x-1 items-center'>
                        <h1 className='text-lg font-bold'>${listing.rent}/mo</h1>
                        <p className='text-base'>{listing.rooms} bed, {listing.bathrooms} bath</p>
                    </div>

                    <div className='flex flex-row space-x-1 items-center'>
                        {Array.from({ length: listing.rooms - listing.joinedListing.length }).map((_, index) => (
                            <div key={index} className='flex flex-row space-x-1 items-center'>
                                <img src={available.src} alt='available' className="w-3 h-6" />
                            </div>
                        ))}
                        {listing.joinedListing.map((user, index) => (
                            <div key={index} className='flex flex-row space-x-1 items-center'>
                                <img src={taken.src} alt='taken' className="w-3 h-6" />
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className='flex justify-between'>
                    <p className='text-sm items-center'> {listing.address} <br/> {listing.city}, {listing.state}, {listing.zipCode} </p>
                    <div className='flex flex-col text-right'>
                        <p className='text-base font-bold text-green-500'> {listing.rooms - listing.joinedListing.length} / {listing.rooms} Rooms Open </p>
                        <p className={`${listing.gender === 'males' ? 'text-blue-500' : listing.gender === 'females' ? 'text-pink-500' : 'text-gray-500'} font-bold text-base`}> {listing.gender} </p>
                    </div>
                </div>
                <div className='flex items-center justify-between'>
                    <p className='text-sm'> Unit #: {listing.homeType === 'apartment' ? listing.unit: 'N/A' } </p>
                </div>

            </div>

            {   
            // ** possible to combine all 3 and use conditional rendering **
                isAuthenticated && user.email_verified && listing.owner === user.nickname ? 
                <div className=' h-12 flex flex-col space-y-2 items-center justify-center'>
                    {/* confirmation text if the user pressed an action button */}
                    {confirm && <p className= 'text-sm font-bold text-red-500'> Delete this listing? </p> }

                    {/* confirm button if user pressed an action button */}
                    {confirm ? (
                    <div className='flex flex-row space-x-8'>
                        <button onClick={() => setConfirm(false)} className='text-gray-500 text-sm font-bold'> 
                                Cancel 
                        </button>
                        <button onClick={() => handleDelete(listing.id)} className='flex items-center justify-center w-20 h-6 outline-none ring-2 ring-red-500 bg-red-500 text-white text-sm font-bold hover:scale-105 transition ease-in-out duration-300 rounded-lg'> 
                            {loading ? <TailSpin color='#ffffff' height={15} width={15} /> : 'Confirm'}
                        </button>
                    </div>
                    ) :
                    // button to join, leave, or delete listing
                    <button onClick={() => setConfirm(true)} className='w-16 h-6 outline-none ring-2 ring-red-500 bg-red-500 text-white text-sm font-bold hover:scale-105 transition ease-in-out duration-300 rounded-lg'> 
                        Delete 
                    </button>
                    }
                </div> :

                isAuthenticated && user.email_verified && listing.joinedListing.includes(user.nickname) ? 
                <div className=' h-12 flex flex-col space-y-2 items-center justify-center'>
                    {/* confirmation text if the user pressed an action button */}
                    {confirm && <p className= 'text-sm font-bold text-orange-500'> Leave this listing? </p> }

                    {/* confirm button if user pressed an action button */}
                    {confirm ? (
                    <div className='flex flex-row space-x-8'>
                        <button onClick={() => setConfirm(false)} className='text-gray-500 text-sm font-bold'> 
                                Cancel 
                        </button>
                        <button onClick={() => handleLeave(listing.id, user.nickname)} className='flex items-center justify-center w-20 h-6 outline-none ring-2 ring-orange-500 bg-orange-500 text-white text-sm font-bold hover:scale-105 transition ease-in-out duration-300 rounded-lg'> 
                            {loading ? <TailSpin color='#ffffff' height={15} width={15} /> : 'Confirm'}
                        </button>
                    </div>
                    ) :
                    // button to join, leave, or delete listing
                    <button onClick={() => setConfirm(true)} className='w-16 h-6 outline-none ring-2 ring-orange-500 bg-orange-500 text-white text-sm font-bold hover:scale-105 transition ease-in-out duration-300 rounded-lg'> 
                        Leave 
                    </button>
                    }
                </div>: 

                isAuthenticated && user.email_verified && !listing.joinedListing.includes(user.nickname) ? 
                <div className=' h-12 flex flex-col space-y-2 items-center justify-center'>
                    {/* confirmation text if the user pressed an action button */}
                    {confirm && <p className= 'text-sm font-bold text-green-500'> Join this listing? </p> }

                    {/* confirm button if user pressed an action button */}
                    {confirm ? (
                    <div className='flex flex-row space-x-8'>
                        <button onClick={() => setConfirm(false)} className='text-gray-500 text-sm font-bold'> 
                                Cancel 
                        </button>
                        <button onClick={() => handleJoin(listing.id, user.nickname)} className='flex items-center justify-center w-20 h-6 outline-none ring-2 ring-green-500 bg-green-500 text-white text-sm font-bold hover:scale-105 transition ease-in-out duration-300 rounded-lg'> 
                            {loading ? <TailSpin color='#ffffff' height={15} width={15} /> : 'Confirm'}
                        </button>
                    </div>
                    ) :
                    // button to join, leave, or delete listing
                    <button onClick={() => setConfirm(true)} className='w-16 h-6 outline-none ring-2 ring-green-500 bg-green-500 text-white text-sm font-bold hover:scale-105 transition ease-in-out duration-300 rounded-lg'> 
                        Join 
                    </button>
                    }
                </div>
                : <></>
            }
        </div>
    );
}
