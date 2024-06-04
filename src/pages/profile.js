import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Logout from '@components/logout';

export default function Profile() {

  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div> Loading... </div>;
  }

  return isAuthenticated ? (
    <div className='h-[calc(100vh-54px)] w-full bg-gray-200 flex items-center justify-center text-black p-8'>

      <div className='h-[calc(95vh-54px)] w-[95vw] bg-white rounded-lg p-6 flex flex-col space-y-8'>

        <div className='flex items-center justify-between'>
          <div className='flex flex-row space-x-3 w-full items-center'>
            <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full" />
            <p> Welcome, {user.name} </p>
          </div>
          <Logout />
        </div>

        <div className='flex items-center flex-row space-x-10 h-3/5 w-3/5'>
          <div className='h-full w-full rounded-2xl ring-2 ring-red-500 p-4'>
            <h1 className='text-lg'> My Listing </h1>

          </div>
          <div className='h-full w-full rounded-2xl ring-2 ring-red-500 p-4'>
            <h1 className='text-lg'> Joined Listings </h1>

          </div>

        </div>

      </div>

    </div>

  ) : (<div> error </div>);
}