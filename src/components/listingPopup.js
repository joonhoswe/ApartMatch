import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import placeholder from '@assets/placeholder.jpeg';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import AWS from 'aws-sdk';

export default function ListingPopup({ allListings, listing, refreshListing, changePopupActive, changeUserListing }) {
    const { user, isAuthenticated } = useAuth0();
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState(false);

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

    const handleDelete = async(id) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8000/api/delete/${id}`);
            const information = {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
                Key: listing.imageUrl.split('/').pop(),
            }
            console.log(information.Key);
            if(information.Key.length!=0){
                await s3.deleteObject(information).promise();
            }
            const updatedListings = allListings.filter(listing => listing.id !== id);
            await changeUserListing(updatedListings);
            await changePopupActive(false);
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
        setLoading(false);
        setConfirm(false);
      }

    return (
        <div className='z-50 h-full w-full bg-white text-black rounded-lg flex flex-col items-center justify-between' >
            <div className='h-3/5 w-full mb-2'>
                {/*change photo*/}
                <img src={!listing.imageUrl ? placeholder.src : listing.imageUrl} alt='placeholder' className='h-full w-full' />
            </div>

            <div className='flex flex-col space-y-1 justify-start text-start w-full px-4 mb-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex flex-row space-x-1 items-center'>
                        <h1 className='text-lg font-bold'>${listing.rent}/mo</h1>
                        <p className='text-base'>{listing.rooms} bed, {listing.bathrooms} bath</p>
                    </div>
                    <p className='text-base font-bold text-green-500'> {listing.rooms - listing.joinedListing.length} / {listing.rooms} Rooms Open </p>
                </div>

                <p className='text-sm'>{listing.address} <br/> {listing.city}, {listing.state}, {listing.zipCode}</p>
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
                    {confirm && <p className= 'text-sm font-bold text-red-500'> Leave this listing? </p> }

                    {/* confirm button if user pressed an action button */}
                    {confirm ? (
                    <div className='flex flex-row space-x-8'>
                        <button onClick={() => setConfirm(false)} className='text-gray-500 text-sm font-bold'> 
                                Cancel 
                        </button>
                        <button onClick={() => handleLeave(listing.id, user.nickname)} className='flex items-center justify-center w-20 h-6 outline-none ring-2 ring-red-500 bg-red-500 text-white text-sm font-bold hover:scale-105 transition ease-in-out duration-300 rounded-lg'> 
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
