import { React, useEffect, useState } from 'react';
import Login from '@components/login';
import { useAuth0 } from "@auth0/auth0-react";
import placeholder from '@assets/placeholder.jpeg';
import axios from 'axios';


export default function ViewListings(){
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [database, setDatabase] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try{
            const response = await axios.get('http://localhost:8000/api/get');
            setDatabase(response.data);
          } catch(error){
            console.error('Error fetching Data:', error);
            if (error.response) {
              //http status code isn't desired
              console.error('Response data:', error.response.data);
              console.error('Response status:', error.response.status);
              console.error('Response headers:', error.response.headers);
            } else if (error.request) {
              // no response was received from request
              console.error('Request data:', error.request);
            } else {
              // Something happened in setting up the request that triggered an error
              console.error('Error message:', error.message);
            }
          }
        };
        fetchData();
    }, [user]);
    return (
        <div className='h-full w-1/2 md:flex flex-col items-center space-y-6 text-black p-4 border-2 border-gray-500'>
            {isAuthenticated ? ( 
                <p>Click on a listing for more information.</p> 
            ) : ( 
                <span><Login/> to join a listing!</span>
            )}
            <div className='overflow-y-scroll'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-14'>
                    {database.map((listing, index) => (
                        <div key={index} className='flex items-center flex-col space-y-4 h-60 w-40 sm:h-96 sm:w-72 rounded-2xl ring-2 ring-red-500 p-4 m-6 md:m-12'>
                            <img src = {placeholder.src} alt = 'placeholder' className='h-24 w-36'/>
                            <div className='flex flex-col space-y-2 text-start items-center'>
                                <h1 className='text-lg'> ${listing.rent}/mo </h1>
                                <h1 className='text-lg'> {listing.address} </h1>
                                <h1 className='text-lg'> {listing.city}, {listing.state} {listing.zipCode}</h1>
                                <h1 className='text-lg'> {listing.rooms} bed, {listing.bathrooms} bath </h1>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}