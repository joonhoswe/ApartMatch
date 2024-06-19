import { React, useEffect, useState } from 'react';
import Login from '@components/login';
import { useAuth0 } from "@auth0/auth0-react";
import placeholder from '@assets/placeholder.jpeg';
import axios from 'axios';
import PacmanLoader from 'react-spinners/PacmanLoader';


export default function ViewListings({ onListingClick }){
    const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
    const [database, setDatabase] = useState([]);
    const [listingsLoading, setListingsLoading] = useState(true);
  
    const fetchData = async () => {
      try{
        const response = await axios.get('http://localhost:8000/api/get');
        setDatabase(response.data);
        setListingsLoading(false);
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
  
    useEffect(() => {
      fetchData();
    }, [user]);

    const handleJoin = async(id, user) => {
      try {
        const response = await axios.patch('http://localhost:8000/api/join/', { id, user });
        console.log('Response:', response.data);
        fetchData();
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
        fetchData();
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
        <div className='h-[calc(100vh-54px)] w-full sm:w-2/5 sm:flex flex-col items-center space-y-6 text-black p-2 border-2 border-gray-500'>
            {isAuthenticated ? (
              <></>
            ) 
            : 
            (
            <div className='w-full h-10 bg-white flex items-center justify-center'>
                <p className='font-bold text-red-500'> Please <span onClick={loginWithRedirect} className='underline hover:cursor-pointer hover:text-red-400 transition ease-in-out duration-300'>sign in </span> to join a listing. </p>
            </div>
            )}
            <div className='h-full overflow-scroll w-full flex flex-wrap gap-4 justify-center'>
                {listingsLoading ? 
                  <div className='h-full w-full flex items-center justify-center'>
                    <PacmanLoader color="#ef4444" />
                  </div> 
                : (
                database.map((listing, index) => (
                    <div key={index} onClick={() => onListingClick(listing)} className={`${listing.rooms - listing.joinedListing.length === 0 ? 'hidden' : 'flex'} relative items-center flex-col h-52 w-48 rounded-2xl shadow-2xl hover:cursor-pointer hover:scale-105 transition ease-in-out duration-300`}>
                        <div className={`${listing.gender == 'males' ? 'bg-blue-500' : listing.gender ==='females' ? 'bg-pink-500' : 'bg-gray-500'} absolute top-2 right-2 text-white font-bold text-xs w-16 h-4 p-1 rounded-md flex items-center justify-center`}> 
                          <p className=''> {listing.gender} </p>
                        </div>
                        <div className={`${listing.owner == user.nickname ? 'block' : 'hidden'} absolute top-2 left-2 bg-yellow-400 text-white font-bold text-xs w-18 h-4 p-1 rounded-md flex items-center justify-center`}> 
                          <p className=''>☆OWNER </p>
                        </div>
                        
                        <img src = {placeholder.src} alt = 'placeholder' className='h-24 w-full rounded-t-2xl'/>
                        {/* adjusted inner padding here */}
                        <div className='flex flex-col space-y-1 justify-start text-start px-2'> 
                            <div className='flex flex-row space-x-1 items-center'>
                              <h1 className='text-sm font-bold'> ${listing.rent}/mo </h1>
                              <p className='text-xs'> {listing.rooms} bed, {listing.bathrooms} bath </p>
                            </div>
                            <p className='text-xs font-bold text-green-500'> {listing.rooms - listing.joinedListing.length} / {listing.rooms} Rooms Open </p>
                            <p className='text-xs'> {listing.address} </p>
                            <p className='text-xs'> {listing.city}, {listing.state}, {listing.zipCode}</p>
                            
                            {/* if the user is not logged in, hide Join button */}
                            { isAuthenticated && listing.joinedListing.includes(user.nickname)
                            ? <button onClick={() => {handleLeave(listing.id, user.nickname)}} className='text-red-500 text-xs font-bold transition ease-in-out duration-300 hover:text-gray-400'> 
                              Leave 
                              </button>
                            : isAuthenticated && !listing.joinedListing.includes(user.nickname) ? 
                              <button onClick={()=> handleJoin(listing.id, user.nickname)} className='text-green-500 text-xs font-bold transition ease-in-out duration-300 hover:text-gray-400'> 
                              Join 
                              </button>
                            : <></>}
                        </div>
                    </div>
                ))
              )}
            </div>
        </div>
    );
}