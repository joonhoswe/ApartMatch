import { React, useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Logout from '@components/logout';
import placeholder from '@assets/placeholder.jpeg';
import axios from 'axios';
import PulseLoader from 'react-spinners/PulseLoader';

export default function Profile() {

    const { user, isAuthenticated } = useAuth0();
    const [database, setDatabase] = useState([]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try{
          const response = await axios.get('http://localhost:8000/api/get');
          setDatabase(response.data);
          if (user) {
            const userOwnedListings = response.data.filter(listing => listing.joinedListing.includes(user.nickname));
            setListings(userOwnedListings);
          }
          setLoading(false); // Set loading to false after the data has been fetched
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

    const handleDelete = async(id) => {
      await axios.delete(`http://localhost:8000/api/delete/${id}`);
      //remove from listings array
      const updatedListings = listings.filter(listing => listing.id !== id);
      setListings(updatedListings);
    }

    if (loading) {
      return (
      <div className='h-screen bg-white w-full flex items-center justify-center'>
          <PulseLoader color='#ef4444' />
      </div>);
    } else {
      return isAuthenticated ? (
        <div className='min-h-[calc(100vh-54px)] h-auto w-full bg-gray-200 flex items-center justify-center text-black p-4 sm:p-8'>
  
          <div className='h-auto min-h-[calc(70vh)] w-[95vw] bg-white rounded-lg p-3 sm:p-6 flex flex-col space-y-8'>
  
            <div className='flex items-center justify-between'>
              <div className='flex flex-row space-x-3 w-full items-center'>
                <img src={user.picture} alt={user.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                <p className='text-xs sm:text-base'> Welcome, {user.nickname} </p>
              </div>
              <Logout />
            </div>
  
            <div>
              <h1 className='text-lg font-bold text-red-500'> Listings </h1>
              <div className='w-full h-0.5 bg-red-500'/>
            </div>

            {listings.length === 0 ?
            <div className='flex items-center justify-center'>
                <p className='text-gray-400 text-sm md:text-lg'> No listings joined or posted yet. </p>
            </div> : 
            <></>}

            <div className='flex gap-4 items-center flex-wrap'>
            {listings.map((listing, index) => (
                <div key={index} className='relative flex flex-col h-56 w-48 rounded-2xl shadow-2xl hover:cursor-pointer hover:scale-110 transition ease-in-out duration-300'>
                    {listing.owner === user.nickname ? (
                      <div className='absolute top-2 left-2 bg-yellow-400 text-white font-bold text-xs w-18 h-4 p-1 rounded-md flex items-center justify-center'> 
                      <p className=''>☆OWNER </p>
                      </div>
                    ):<></>}
                    <img src = {placeholder.src} alt = 'placeholder' className='h-24 w-full rounded-t-2xl'/>
                    <div className='flex flex-col space-y-1 justify-start text-start px-4'>
                        <div className='flex flex-row space-x-1 items-center'>
                          <h1 className='text-sm font-bold'> ${listing.rent}/mo </h1>
                          <p className='text-xs'> {listing.rooms} bed, {listing.bathrooms} bath </p>
                        </div>
                        <p className='text-xs'> {listing.address} </p>
                        <p className='text-xs'> {listing.city}, {listing.state}, {listing.zipCode}</p>
                    </div>
                    <button onClick={() => handleDelete(listing.id)} className='absolute bottom-3 left-1/2 transform -translate-x-1/2 text-red-500 text-xs font-bold transition ease-in-out duration-300 hover:text-gray-400'> Delete </button>
                </div>
            ))}
            </div>
            
  
          </div>
  
        </div>
  
      ) : 
      // this shouldn't be accessed in the first place
      (<div> error </div>);
  }

}
    
    