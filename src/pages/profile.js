import { React, useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Logout from '@components/logout';
import placeholder from '@assets/placeholder.jpeg';
import axios from 'axios';

export default function Profile() {

    const { user, isAuthenticated, isLoading } = useAuth0();
    const [database, setDatabase] = useState([]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try{
          const response = await axios.get('http://localhost:8000/api/get');
          setDatabase(response.data);
          if (user) {
            const userOwnedListings = response.data.filter(listing => listing.owner === user.nickname);
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
      return <div> Loading... </div>;
    } else {
      return isAuthenticated ? (
        <div className='h-full w-full bg-gray-200 flex items-center justify-center text-black p-8'>
  
          <div className='h-full w-[95vw] bg-white rounded-lg p-6 flex flex-col space-y-8'>
  
            <div className='flex items-center justify-between'>
              <div className='flex flex-row space-x-3 w-full items-center'>
                <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                <p> Welcome, {user.nickname} </p>
              </div>
              <Logout />
            </div>
  
            <div>
              <h1 className='text-lg font-bold text-red-500'> Listings </h1>
              <div className='w-full h-0.5 bg-red-500'/>
            </div>

            <div className='flex items-center justify-center flex-wrap'>
              {listings.map((listing, index) => (
                <div key={index} className='flex items-center flex-col space-y-4 h-72 w-72 sm:h-96 sm:w-72 rounded-2xl ring-2 ring-red-500 p-4 m-6 md:m-12'>
                  <img src = {placeholder.src} alt = 'placeholder' className='h-32 w-42'/>

                  <div className='flex flex-col space-y-2 text-start items-center'>
                    <h1 className='text-lg'> ${listing.rent}/mo </h1>
                    <h1 className='text-lg'> {listing.address} </h1>
                    <h1 className='text-lg'> {listing.city}, {listing.state} {listing.zipCode}</h1>
                    <button onClick={() => handleDelete(listing.id)} className='text-red-500 text-lg font-bold'>Delete</button>
                  </div>
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
    
    