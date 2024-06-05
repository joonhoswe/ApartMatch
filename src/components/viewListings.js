import { React, useEffect, useState } from 'react';
import Login from '@components/login';
import { useAuth0 } from "@auth0/auth0-react";
import placeholder from '@assets/placeholder.jpeg';
import axios from 'axios';


export default function ViewListings(){
    const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
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
        <div className='h-full w-full md:w-3/4 md:flex flex-col items-center space-y-6 text-black p-2 border-2 border-gray-500'>
            {isAuthenticated ? ( 
              <></>
            ) : ( 
            <div className='w-full h-10 bg-white flex items-center justify-center'>
                <p className='font-bold text-red-500'> Please <span onClick={loginWithRedirect} className='underline hover:cursor-pointer hover:text-red-400 transition ease-in-out duration-300'>sign in </span> to join a listing. </p>
            </div>   
            )}
            <div className='h-full w-full overflow-y-scroll grid grid-cols-1 lg:grid-cols-2 gap-12 p-4 items-center justify-items-center'>
                    {database.map((listing, index) => (
                        <div key={index} className='flex items-center flex-col h-36 w-48 rounded-2xl shadow-2xl hover:cursor-pointer hover:scale-105 transition ease-in-out duration-300'>
                            <img src = {placeholder.src} alt = 'placeholder' className='h-16 w-24'/>
                            <div className='flex flex-col space-y-1 justify-center items-start'>
                                <div className='flex flex-row space-x-1 items-center justify-center'>
                                <h1 className='text-sm font-bold'> ${listing.rent}/mo </h1>
                                <p className='text-xs'> {listing.rooms} bed {listing.bathrooms} bath </p>
                                </div>
                                <p className='text-xs'> {listing.address} </p>
                                <p className='text-xs'> {listing.city}, {listing.state} {listing.zipCode}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}