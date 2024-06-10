import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import ViewListings from '@components/viewListings';
import { IoIosSearch } from "react-icons/io";
import {
    setDefaults,
    fromAddress,
    fromLatLng,
    fromPlaceId,
    setLocationType,
    geocode,
    RequestType,
  } from "react-geocode";

export default function SchoolMap() {
    const router = useRouter();
    const { school } = router.query;
    const [searchInput, setSearchInput] = useState(school || '');

    const [houseType, setHouseType] = useState('');
    const [priceRange, setPriceRange] = useState(['', '']);
    const [rooms, setRooms] = useState(0);
    const [commute, setCommute] = useState('');
    const [genderType, setGenderType] = useState('');

    const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
    const [mapSet, setMapSet] = useState(false);

    // When new school is searched, update the map center
    const handleFindHomes = () => {
        if (searchInput.trim() !== '') {
        router.push(`/schoolmap?school=${encodeURIComponent(searchInput)}`);
        setMapSet(false);
        handleGeocode(searchInput);
        }
    };

    // Geocode the address to get the latitude and longitude
    const handleGeocode = (address) => {
        fromAddress(address)
        .then((response) => {
            const { lat, lng } = response.results[0].geometry.location;
            setMapCenter({ lat, lng });
            setMapSet(true);
            console.log(lat, lng);
            
        })
        .catch((error) => {
            console.error(error);
        });
    };

    // Initialize the map with the search input (school name or address)
    const initialize = (searchInput) => {
        if (searchInput) {
            console.log(`Loading map for ${searchInput}`);
            setDefaults({
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                language: "en", 
                region: "es", 
            });
        }
        handleGeocode(searchInput);
    };

    //const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const marker = new AdvancedMarkerElement({
        Map,
        position: { lat: 37.4239163, lng: -122.0947209 },
    });

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} onLoad={() => initialize(searchInput)}>
        <div className='flex flex-row h-[calc(100vh-54px)] w-full bg-white'>
            {/* container with filters */}
            <div className='h-full w-1/3 hidden md:flex flex-col space-y-6 text-black p-4 border-2 border-gray-500'>
                <div className='relative w-full'>
                    {/* search bar */}
                    <input
                    className={`h-10 md:h-12 w-full rounded-lg md:rounded-2xl px-4 pr-10 text-black outline-none ring-2 ring-red-500 text-xs sm:text-sm lg:text-base ${searchInput === '' ? 'text-gray-400' : ''}`}
                    placeholder="Ex: Carnegie Mellon University"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'Return') {
                        handleFindHomes();
                        }
                    }}
                    />
                    {/* search icon */}
                    <IoIosSearch
                    onClick={handleFindHomes}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-red-500 hover:cursor-pointer'
                    />
                </div>

                {/* price range selection */}
                <div className='flex flex-col space-y-2'>
                    <p> Price Range </p>
                    <div className='flex flex-row h-10 w-full'>
                    <input
                        className={`h-full w-1/2 rounded-l-lg md:rounded-l-2xl px-4 text-black outline-none ring-2 ring-red-500 text-xs sm:text-sm lg:text-base ${priceRange[0] === 0 ? 'text-gray-400' : ''}`}
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    />
                    <input
                        className={`h-full w-1/2 rounded-r-lg md:rounded-r-2xl px-4 text-black outline-none ring-2 ring-red-500 text-xs sm:text-sm lg:text-base ${priceRange[1] === 1000000 ? 'text-gray-400' : ''}`}
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    />
                    </div>
                </div>

                {/* home type selection */}
                <div className='flex flex-col space-y-2'>
                    <p> Home Type </p>
                    <div className='flex flex-row h-10 w-full'>
                    <button
                        className={`h-full w-1/2 flex items-center justify-center rounded-l-lg md:rounded-l-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm ${houseType === 'apartment' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setHouseType('apartment')}
                    >
                        Apartment
                    </button>
                    <button
                        className={`h-full w-1/2 flex items-center justify-center rounded-r-lg md:rounded-r-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm ${houseType === 'house' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setHouseType('house')}
                    >
                        House
                    </button>
                    </div>
                </div>

                {/* gender type selection */}
                <div className='flex flex-col space-y-2'>
                    <p> Gender Preferences </p>
                    <div className='flex flex-row h-10 w-full'>
                    <button
                        className={`h-full w-1/2 flex items-center justify-center rounded-l-lg md:rounded-l-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm lg:text-base ${genderType === 'males' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setGenderType('males')}
                    >
                        M
                    </button>
                    <button
                        className={`h-full w-1/2 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm lg:text-base ${genderType === 'females' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setGenderType('females')}
                    >
                        F
                    </button>
                    <button
                        className={`h-full w-1/2 flex items-center justify-center rounded-r-lg md:rounded-r-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm lg:text-base ${genderType === 'both' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setGenderType('both')}
                    >
                        Co-Ed
                    </button>
                    </div>
                </div>

                {/* rooms available selection */}
                <div className='flex flex-col space-y-2'>
                    <p> # of Rooms Left </p>
                    <div className='flex flex-row h-10 w-full'>
                        <button 
                        className={`h-full w-1/4 flex items-center justify-center rounded-l-lg md:rounded-l-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${rooms === 1 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setRooms(1)}
                        >
                        1
                        </button>

                        <button 
                        className={`h-full w-1/4 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${rooms === 2 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setRooms(2)}
                        >
                        2
                        </button>

                        <button 
                        className={`h-full w-1/4 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${rooms === 3 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setRooms(3)}
                        >
                        3
                        </button>
                        <input 
                        placeholder='3+'
                        className={`h-full w-1/4 flex text-center items-center justify-center rounded-r-lg md:rounded-r-2xl p-2 outline-none ring-2 ring-red-500 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${rooms > 4 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onChange={(e) => setRooms(e.target.value)}
                        />
                    </div>
                </div>

                {/* commute time range selection */}
                <div className='flex flex-col space-y-2'>
                    <p> Commute Time </p>
                    <div className='flex flex-row h-10 w-full'>
                    <input
                        className={`h-full w-1/2 rounded-l-lg md:rounded-l-2xl px-4 text-black outline-none ring-2 ring-red-500 text-xs sm:text-sm lg:text-base ${commute[0] === 0 ? 'text-gray-400' : ''}`}
                        placeholder="Min"
                        value={commute[0]}
                        onChange={(e) => setCommute([parseInt(e.target.value), commute[1]])}
                    />
                    <input
                        className={`h-full w-1/2 rounded-r-lg md:rounded-r-2xl px-4 text-black outline-none ring-2 ring-red-500 text-xs sm:text-sm lg:text-base ${commute[1] === 1000000 ? 'text-gray-400' : ''}`}
                        placeholder="Max"
                        value={commute[1]}
                        onChange={(e) => setCommute([commute[0], parseInt(e.target.value)])}
                    />
                    </div>
                </div>
            </div>

            {/* embedded google map */}
            <div style={{ width: '100%', height: '100%' }} className='hidden md:flex'>
            {mapSet && (
            <Map
                mapContainerStyle={{ width: '100%', height: '100%' }}
                defaultCenter={mapCenter}
                defaultZoom={16}
            />
            )}

            </div>

            <ViewListings/>

        </div>
        </APIProvider>
    );
}
