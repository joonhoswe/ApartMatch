import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import ViewListings from '@components/viewListings';
import { IoIosSearch } from "react-icons/io";
import { setDefaults, fromAddress } from "react-geocode";
import axios from 'axios';
import Popup from '@components/listingPopup';
import PulseLoader from 'react-spinners/PulseLoader';

const CustomPin = ({ text }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
            width: '50px',
            height: '25px',
            backgroundColor: '#ef4444',
            borderRadius: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '15px'
        }}>
            ${text}
        </div>
        <div style={{
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid #ef4444',
        }} />
    </div>
);
export default function SchoolMap() {
    const router = useRouter();
    const { school } = router.query;
    let schoolCity = null;

    const [searchInput, setSearchInput] = useState(school || '');
    const [priceRange, setPriceRange] = useState([, ]);
    const [homeType, setHomeType] = useState('');
    const [gender, setGender] = useState('');
    const [rooms, setRooms] = useState(0);
    const [bathrooms, setBathrooms] = useState(0);
    const [commute, setCommute] = useState([, ]);

    const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
    const [mapSet, setMapSet] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [allListings, setAllListings] = useState([]); // All listings from API

    const [popupActive, setPopupActive] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const handlePopupActiveChange = (active) => {
        setPopupActive(active);
    };

    const handleMarkerClick = (marker) => {
        setPopupActive(true);
        setSelectedMarker(marker);
    }

    const handleListingClick = (listing) => {
        setPopupActive(true);
        setSelectedMarker(listing);
    }

    const handleFindHomes = () => {
        if (searchInput.trim() !== '') {
            router.push(`/schoolmap?school=${encodeURIComponent(searchInput)}`);
            setMapSet(false);
            handleGeocode(searchInput);
        }
    };

    const handleGeocode = (address) => {
        if (address) {
            fromAddress(address)
                .then((response) => {
                    const { lat, lng } = response.results[0].geometry.location;
                    setMapCenter({ lat, lng });
                    console.log(response.results[0]);
                    console.log(response.results[0].address_components[2].long_name)
                    schoolCity = (response.results[0].address_components[2].long_name);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.error("Address is missing or invalid.");
        }
    };

    const initialize = (searchInput) => {
        if (searchInput) {
            console.log(`Loading map for ${searchInput}`);
            setDefaults({
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                language: "en",
                region: "es",
            });
            handleGeocode(searchInput);
        }
    };

    const fetchListings = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/get');
            // Filter listings by city   
            const listings = response.data.filter(listing => listing.city === schoolCity);
            // store same city listings in allListings to keep track of all listings to filter from
            setAllListings(listings);

            const markerPromises = listings.map((listing) => {
                if (listing.rooms - listing.joinedListing.length !== 0) {
                    return fromAddress(listing.address)
                        .then((response) => {
                            const { lat, lng } = response.results[0].geometry.location;
                            return { ...listing, position: { lat, lng } };  // Include all original listing data
                        })
                        .catch((error) => {
                            console.error(`Error geocoding address ${listing.address}:`, error);
                            return null;
                        });
                } else {
                    return Promise.resolve(null);
                }
            });

            const resolvedMarkers = await Promise.all(markerPromises);
            setMarkers(resolvedMarkers.filter(marker => marker !== null));
            setFilteredListings(listings); // Initial full list
            setMapSet(true);

            // Update Popup's availability by updating selectedMarker if it's currently active
            if (popupActive && selectedMarker) {
                const updatedMarker = listings.find(listing => listing.id === selectedMarker.id);
                if (updatedMarker) {
                    setSelectedMarker(updatedMarker);
                }
            }
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    };

    const fetchFilteredListings = async () => {
        try {
            setMapSet(false);

            // left out commute time filtering for now
            const validListings = allListings.filter(listing =>
                (!priceRange[0] || listing.rent >= priceRange[0]) &&
                (!priceRange[1] || listing.rent <= priceRange[1]) &&
                (!homeType || listing.homeType === homeType) &&
                (!gender || listing.gender === gender) &&
                (!rooms || listing.rooms - listing.joinedListing.length === rooms) &&
                (!bathrooms || listing.bathrooms === bathrooms)
            );

            const markerPromises = validListings.map((listing) => {
                if (listing.rooms - listing.joinedListing.length !== 0) {
                    return fromAddress(listing.address)
                        .then((response) => {
                            const { lat, lng } = response.results[0].geometry.location;
                            return { ...listing, position: { lat, lng } };  // Include all original listing data
                        })
                        .catch((error) => {
                            console.error(`Error geocoding address ${listing.address}:`, error);
                            return null;
                        });
                } else {
                    return Promise.resolve(null);
                }
            });

            const resolvedMarkers = await Promise.all(markerPromises);
            setMarkers(resolvedMarkers.filter(marker => marker !== null));
            setFilteredListings(validListings); // Update filtered listings
            setMapSet(true);

        } catch (error) {
            console.error('Error fetching filtered listings:', error);
        }
    };

    const applyFilters = () => {
        console.log("applying")
        fetchFilteredListings();
    }

    // whenever school changes, update search input and fetch listings
    useEffect(() => {
        if (school) {
            setSearchInput(school);
            initialize(school);
            fetchListings();
        }
        // moved fetchListings up from here
    }, [school]);

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <div className='flex flex-row h-[calc(100vh-54px)] w-full bg-white'>
                <div className='h-full w-1/3 hidden sm:flex flex-col space-y-6 text-black p-4 border-2 border-gray-500'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-bold'> University </p>
                        <div className='relative w-full'>
                            <input
                                className={`h-10 md:h-12 w-full rounded-lg md:rounded-2xl px-4 pr-10 text-black outline-none ring-2 ring-red-500 text-xs lg:text-base ${searchInput === '' ? 'text-gray-400' : ''}`}
                                placeholder="Ex: Carnegie Mellon University"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === 'Return') {
                                        handleFindHomes();
                                    }
                                }}
                            />
                            <IoIosSearch
                                onClick={handleFindHomes}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-red-500 hover:cursor-pointer'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-bold'> Price Range </p>
                        <div className='flex flex-row h-10 w-full'>
                            <input
                                className={`h-full w-1/2 rounded-l-lg md:rounded-l-2xl px-4 text-black outline-none ring-2 ring-red-500 text-xs md:text-sm ${priceRange[0] === 0 ? 'text-gray-400' : ''}`}
                                placeholder="Min"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([e.target.value === '' ? '' : parseInt(e.target.value), priceRange[1]])}
                                onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            <input
                                className={`h-full w-1/2 rounded-r-lg md:rounded-r-2xl px-4 text-black outline-none ring-2 ring-red-500 text-xs md:text-sm ${priceRange[1] === 1000000 ? 'text-gray-400' : ''}`}
                                placeholder="Max"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], e.target.value === '' ? '' : parseInt(e.target.value)])}
                                onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-bold'> Home Type </p>
                        <div className='flex flex-row h-10 w-full'>
                            <button
                                className={`h-full w-1/2 flex items-center justify-center rounded-l-lg md:rounded-l-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm ${homeType === 'apartment' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                onClick={() => setHomeType(homeType === 'apartment' ? '' : 'apartment')}
                            >
                                Apartment
                            </button>
                            <button
                                className={`h-full w-1/2 flex items-center justify-center rounded-r-lg md:rounded-r-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm ${homeType === 'house' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                onClick={() => setHomeType(homeType === 'house' ? '' : 'house')}
                            >
                                House
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-bold'> Gender Preferences </p>
                        <div className='flex flex-row h-10 w-full'>
                            <button
                                className={`h-full w-1/2 flex items-center justify-center rounded-l-lg md:rounded-l-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs md:text-sm ${gender === 'males' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                onClick={() => setGender(gender === 'males' ? '' : 'males')}
                            >
                                M
                            </button>
                            <button
                                className={`h-full w-1/2 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs md:text-sm ${gender === 'females' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                onClick={() => setGender(gender === 'females' ? '' : 'females')}
                            >
                                F
                            </button>
                            <button
                                className={`h-full w-1/2 flex items-center justify-center rounded-r-lg md:rounded-r-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs md:text-sm ${gender === 'both' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                onClick={() => setGender(gender === 'both' ? '' : 'both')}
                            >
                                Co-Ed
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-bold'> # of Rooms Left </p>
                        <div className='flex flex-row h-10 w-full'>
                            <button
                                className={`h-full w-1/4 flex items-center justify-center rounded-l-lg md:rounded-l-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs md:text-sm ${rooms === 1 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                onClick={() => setRooms(rooms === 1 ? 0 : 1)}
                            >
                                1
                            </button>

                            <button
                                className={`h-full w-1/4 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs md:text-sm ${rooms === 2 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                onClick={() => setRooms(rooms === 2 ? 0 : 2)}
                            >
                                2
                            </button>

                            <button
                                className={`h-full w-1/4 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs md:text-sm ${rooms === 3 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                onClick={() => setRooms(rooms === 3 ? 0 : 3)}
                            >
                                3
                            </button>
                            <input
                                placeholder='3+'
                                className={`h-full w-1/4 flex text-center items-center justify-center rounded-r-lg md:rounded-r-2xl p-2 outline-none ring-2 ring-red-500 transition ease-in-out duration-200 text-xs md:text-sm ${rooms > 3 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                value={rooms > 3 ? rooms : ''}
                                onChange={(e) => setRooms(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-bold'> # of Bathrooms </p>
                        <div className='flex flex-row h-10 w-full'>
                            <button
                                className={`h-full w-1/4 flex items-center justify-center rounded-l-lg md:rounded-l-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs md:text-sm ${bathrooms === 1 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                onClick={() => setBathrooms(bathrooms === 1 ? 0 : 1)}
                            >
                                1
                            </button>

                            <button
                                className={`h-full w-1/4 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs md:text-sm ${bathrooms === 2 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                onClick={() => setBathrooms(bathrooms === 2 ? 0 : 2)}
                            >
                                2
                            </button>

                            <button
                                className={`h-full w-1/4 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs md:text-sm ${bathrooms === 3 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                onClick={() => setBathrooms(bathrooms === 3 ? 0 : 3)}
                            >
                                3
                            </button>
                            <input
                                placeholder='3+'
                                className={`h-full w-1/4 flex text-center items-center justify-center rounded-r-lg md:rounded-r-2xl p-2 outline-none ring-2 ring-red-500 transition ease-in-out duration-200 text-xs md:text-sm ${bathrooms > 3 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                value={bathrooms > 3 ? bathrooms : ''}
                                onChange={(e) => setBathrooms(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-bold'> Commute Time </p>
                        <div className='flex flex-row h-10 w-full'>
                            <input
                                className={`h-full w-1/2 rounded-l-lg md:rounded-l-2xl px-4 text-black outline-none ring-2 ring-red-500 text-xs md:text-sm ${commute[0] === 0 ? 'text-gray-400' : ''}`}
                                placeholder="Min"
                                value={commute[0]}
                                onChange={(e) => setPriceRange([commute[0], e.target.value === '' ? '' : parseInt(e.target.value)])}
                                onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            <input
                                className={`h-full w-1/2 rounded-r-lg md:rounded-r-2xl px-4 text-black outline-none ring-2 ring-red-500 text-xs md:text-sm ${commute[1] === 1000000 ? 'text-gray-400' : ''}`}
                                placeholder="Max"
                                value={commute[1]}
                                onChange={(e) => setPriceRange([e.target.value === '' ? '' : parseInt(e.target.value), commute[1]])}
                                onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-center'>
                        <button onClick={applyFilters} className='w-32 h-8 bg-red-500 outline-none text-white p-2 rounded-lg flex items-center justify-center hover:scale-110 transition ease-in-out duration-300'>
                            Apply Filters
                        </button>
                    </div>
                </div>

                <div style={{ width: '100%', height: '100%' }} className='hidden sm:flex relative'>
                    {!mapSet ? (
                        <div className='h-full w-full flex items-center justify-center'>
                            <PulseLoader color='#ef4444' />
                        </div>
                    ) : (
                        <Map
                            mapId='e1a96cb574a64c5a'
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            defaultCenter={mapCenter}
                            defaultZoom={16}
                        >
                            {markers.map((marker, index) => (
                                <AdvancedMarker key={index} position={marker.position} title={marker.address} onClick={() => handleMarkerClick(marker)}>
                                    <CustomPin text={marker.rent} />
                                </AdvancedMarker>
                            ))}

                            {popupActive && selectedMarker && (
                                <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 px-4'>
                                    <div className='relative bg-white p-4 rounded-lg shadow-lg'>
                                        {/* future: move button to listing component and pass popupActive */}
                                        <button
                                            onClick={() => setPopupActive(false)}
                                            className='absolute top-2 right-2 h-6 w-6 rounded-lg outline-none ring-2 ring-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 transition duration-300 ease-in-out font-bold'
                                        >
                                            x
                                        </button>
                                        <Popup listing={selectedMarker} refreshListing={fetchListings} changePopupActive={handlePopupActiveChange}/>
                                    </div>
                                </div>
                            )}
                        </Map>
                    )}
                </div>

                <ViewListings loading={!mapSet} listings={filteredListings} onListingClick={handleListingClick} />
            </div>
        </APIProvider>
    );
}
