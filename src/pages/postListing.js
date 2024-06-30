import { React, useState, useEffect } from  'react';
import Background from '@assets/osuAstonPlaceApartments.jpeg';
import { useAuth0 } from "@auth0/auth0-react";
import ConfettiExplosion from 'react-confetti-explosion';
import { TailSpin } from 'react-loader-spinner';
import axios from 'axios';
import Link from 'next/link';
import AWS from 'aws-sdk';

export default function postListing() {

    const { user, isAuthenticated, loginWithRedirect } = useAuth0();

    const [listings, setListings] = useState([]);

    const [owner, setOwner] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [homeType, setHomeType] = useState('');
    const [rent, setRent] = useState('');
    const [rooms, setRooms] = useState(0);
    const [bathrooms, setBathrooms] = useState(0);
    const [gender, setGender] = useState('');
    const [unit, setUnit] = useState('');
    const [joinedListing, setJoinedListing] = useState([]);

    const [posted, setPosted] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);

    const [imageObjects, setImageObjects] = useState([]);

    // let isListingValid = true;
    const [isListingValid, setIsListingValid] = useState(true); // Use state for listing validation


    let images = [];

    // checks to see if the apartment unit # was entered before submitting
    const isUnitValid = homeType === 'apartment' ? unit !== '' : unit === '';

    useEffect(() => {
        fetchListings();
    }, []);

    // checks if there is a duplicate listing present in the database
    useEffect(() => {
        const allFieldsEntered = (homeType === 'apartment' && address && city && state && zipCode && unit) ||
        (homeType === 'house' && address && city && state && zipCode);
    
        if (allFieldsEntered) {
            const trimmedUnit = String(unit).trim();
            let valid = true;
    
            listings.forEach(listing => {
                const trimmedListingUnit = String(listing.unit).trim();
    
                if (
                    listing.address === address && 
                    listing.city === city && 
                    listing.state === state && 
                    listing.zipCode === zipCode && 
                    (homeType === 'apartment' ? trimmedListingUnit === trimmedUnit : true)
                ) {
                    valid = false;
                }
            });
    
            setIsListingValid(valid);
        }
    }, [homeType, unit, address, city, state, zipCode, listings]);
    

    // checks if all required fields are filled in before submitting
    let isFormValid = isListingValid && owner !== '' && address !== '' && state !== '' && zipCode !== ''  && city !== '' && homeType !== '' && isUnitValid && rent !== '' && rooms !== 0 && bathrooms !== 0 && gender !== '' && imageObjects.length > 0;

    // initialize AWS
    useEffect(() => {
        AWS.config.update({
            region: 'us-east-2',
            credentials: new AWS.Credentials(
                process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
                process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
            )
        });
    }, []);

    // set the owner of the listing to the poster by default
    useEffect(() => {
        if (user) {
          setOwner(user.nickname);
          setJoinedListing([user.nickname]); // Ensure the first person joined is owner
        }
      }, [user]);

    // clear form after submission
    const clearForm = () => {
        setAddress('');
        setZipCode('');
        setState('');
        setCity('');
        setHomeType('');
        setUnit('');
        setRent('');
        setRooms(0);
        setBathrooms(0);
        setGender('');
        setJoinedListing([]);
        setImageObjects([]);
        images = [];
    };

    // fetch listings from the database to check for duplicates
    const fetchListings = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/get');
            setListings(response.data);
        }
        catch {
            console.error('Error fetching listings');
        }
    }

    // submit the form to the database along with images to AWS S3 bucket
    const handleSubmit = async (e) => {

        e.preventDefault();
        
        if (!isFormValid || !submitClicked || !isListingValid) return; // Prevent invalid submissions (client-side validation)
        
        // Retrieve the image URLs from AWS S3
        images = (await handleAWS());

        // Data to be sent to the database
        const dataForSql = {
            owner,
            address,
            state,
            zipCode,
            city,
            rent,
            homeType,
            unit,
            rooms,
            bathrooms,
            gender,
            joinedListing,
            images,
        };

        console.log("Submitting form: ", dataForSql);

        try {
            const response = await axios.post('http://localhost:8000/api/post/', dataForSql);
            setPosted(true);
            clearForm();
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        } finally {
            setSubmitClicked(false);
        }
    };

    // append images to the imageObjects array
    const handleFileChange = (event) => {
        setImageObjects([...event.target.files]);
    };

    // upload images to AWS S3 bucket and return URLs to be stored in PostgreSQL
    const handleAWS = async () => {
        const s3 = new AWS.S3();
        let uploadedImages = [];

        for (const image of imageObjects) {
            const params = {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
                Key: image.name,
                Body: image,
                ContentType: image.type,
            };

            try {
                const data = await s3.upload(params).promise();
                uploadedImages.push(data.Location);
                console.log('File uploaded successfully:', data.Location);
            } catch (err) {
                console.error('Error uploading file:', err);
            }
        }

        return uploadedImages;
    };

    // capitalize the first letter of the city to ensure database consistency
    const uploadCity = (city) => {
        let cityString = city.toLowerCase();
        cityString = cityString.charAt(0).toUpperCase() + cityString.slice(1);
        setCity(cityString);
    }

    // list of states to be displayed in the dropdown
    const states = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
        "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
        "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
        "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
        "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
        "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
        "Wisconsin", "Wyoming"
    ];

    return (!isAuthenticated) ? // If user is not authenticated, display this message and button to login
    (
        <div className='h-[calc(100vh-54px)] w-full bg-gray-200 flex items-center justify-center'>
            <div className='h-4/5 rounded-2xl w-4/5 md:w-3/5 lg:w-2/5 flex flex-col space-y-8 bg-white items-center justify-center border-y-8 border-red-500'>
                <p className='text-sm sm:text-base md:text-xl text-black font-bold'> 
                    Log in to post a listing! 
                </p>
            
                <button onClick={() => loginWithRedirect()} className="bg-red-500 text-xs md:text-base w-24 h-10 rounded-md text-white px-2 py-1 transition duration-500 hover:bg-white hover:text-red-500 hover:outline hover:outline-2 hover:red-500">
                    Login
                </button>
            </div>  
      </div>
    ) : (isAuthenticated && !user.email_verified) ?
    (
        <div className='h-[calc(100vh-54px)] w-full bg-gray-200 flex items-center justify-center'>
            <div className='h-3/5 rounded-2xl w-4/5 md:w-3/5 lg:w-1/3 flex flex-col bg-white items-center justify-between border-y-8 border-red-500 p-4 md:p-8'>
                <p className='text-sm sm:text-base md:text-xl text-black font-bold text-center'> 
                    To protect the safety of our students, please verify your email before posting a listing.
                </p>

                <p className='text-xs sm:text-sm md:text-base text-black italic text-center'> 
                    NOTE: If you've already verified your email and are still seeing this message, please log out and log back in.
                </p>

                <Link href='/home' className="bg-red-500 text-xs md:text-base w-24 sm:w-32 h-10 rounded-md text-white px-2 py-1 flex items-center justify-center transition duration-500 hover:bg-white hover:text-red-500 hover:outline hover:outline-2 hover:red-500">
                Return Home
                </Link>
            
            </div>  
      </div>
    ) : (isAuthenticated && !posted) ? (
        <div className="bg-gray-200 flex flex-col justify-center items-center w-full h-auto min-h-[calc(100vh-54px)] px-2 py-8" 
            style={{ 
                backgroundImage: `url(${Background.src})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
            <form onSubmit={handleSubmit} className="bg-white text-xs sm:text-base rounded-2xl px-8 py-2 shadow-2xl text-black text-center w-full sm:w-3/5 md:w-3/5 lg:w-1/3 flex flex-col space-y-3 border-y-8 border-red-500 relative">
                <div className = "text-base sm:text-xl p-4 rounded-2xl font-bold mb-2">
                    Thank you for your interest in posting to ApartMatch! 
                </div>
                
                <p className='text-black font-bold flex justify-start'> 
                    Property Information: 
                </p>

                <input 
                value = {address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street Address: "
                className='ring-2 ring-gray-300 outline-none focus:ring-2 focus:ring-red-600 bg-white rounded-2xl p-4 h-10 w-full'/>

                <div className='flex flex-row space-x-2'>
                    <input 
                    value = {city}
                    onChange={(e) => uploadCity(e.target.value)}
                    placeholder="City: "
                    className='ring-2 ring-gray-300 outline-none focus:ring-2 focus:ring-red-600 bg-white rounded-2xl p-4 h-10 w-full'/>

                    <input 
                    value = {zipCode}
                    onChange={(e) => setZipCode(e.target.value === '' ? '' : parseInt(e.target.value))}
                    onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
                            e.preventDefault();
                        }
                    }}
                    placeholder="Zip Code: "
                    className='ring-2 ring-gray-300 outline-none focus:ring-2 focus:ring-red-600 bg-white rounded-2xl p-4 h-10 w-full'/>    
                </div>

                 <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className='ring-2 ring-gray-300 outline-none focus:ring-2 focus:ring-red-600 bg-white rounded-2xl p-2 h-10 w-full'>
                    <option value=""> Select State </option>
                    {states.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>

                <input 
                value = {rent}
                onChange={(e) => setRent(e.target.value === '' ? '' : parseInt(e.target.value))}
                onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                    }
                }}
                placeholder="Monthly Rent: ex: 1200"
                className='ring-2 ring-gray-300 outline-none focus:ring-2 focus:ring-red-600 bg-white rounded-2xl p-4 h-10 w-full'/>

                <div className='w-full bg-white flex flex-col space-y-1'>
                    <p className='flex justify-start'> Home Type </p>
                    <div className='flex flex-row h-10 w-full'>
                        <button 
                        className={`h-full w-1/2 flex items-center justify-center rounded-l-lg md:rounded-l-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm lg:text-base ${homeType === 'apartment' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setHomeType('apartment')}
                        >
                        Apartment
                        </button>
                        <button 
                        className={`h-full w-1/2 flex items-center justify-center rounded-r-lg md:rounded-r-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm lg:text-base ${homeType === 'house' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setHomeType('house')}
                        >
                        House
                        </button>
                    </div>
                </div>
                
                {/* apartment unit # only if home type is an apartment */}
                <div className={`${homeType === 'apartment' ? 'visible' : 'hidden'} w-full bg-white flex flex-col space-y-1`}>
                    <p className='flex justify-start'> Unit # </p>
                    <input 
                    value = {unit}
                    onChange={(e) => setUnit(e.target.value === '' ? '' : parseInt(e.target.value))}
                    onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                            e.preventDefault();
                        }
                    }}
                    placeholder="ex: 505"
                    className='ring-2 ring-gray-300 outline-none focus:ring-2 focus:ring-red-600 bg-white rounded-2xl p-4 h-10 w-full'/>
                </div>

                {!isListingValid && (
                    <div className="w-full text-sm text-red-500 font-bold">
                        <p>Listing already exists! Please enter a new listing.</p>
                    </div>
                )}


                <div className='w-full bg-white flex flex-col space-y-1'>
                    <p className='flex justify-start'> # of Rooms </p>
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

                        <button 
                        className={`h-full w-1/4 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${rooms === 4 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setRooms(4)}
                        >
                        4
                        </button>
                        <input 
                        onChange={(e) => setRooms(e.target.value === '' ? '' : parseInt(e.target.value))}
                        onKeyDown={(e) => {
                            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                e.preventDefault();
                            }
                        }}
                        placeholder='4+'
                        className={`h-full w-1/4 flex text-center items-center justify-center rounded-r-lg md:rounded-r-2xl p-2 outline-none ring-2 ring-red-500 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${rooms > 4 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        />
                    </div>
                </div> 

                <div className='w-full bg-white flex flex-col space-y-1'>
                    <p className='flex justify-start'> # of Bathrooms </p>
                    <div className='flex flex-row h-10 w-full'>
                        <button 
                        className={`h-full w-1/4 flex items-center justify-center rounded-l-lg md:rounded-l-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${bathrooms === 1 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setBathrooms(1)}
                        >
                        1
                        </button>

                        <button 
                        className={`h-full w-1/4 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${bathrooms === 2 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setBathrooms(2)}
                        >
                        2
                        </button>

                        <button 
                        className={`h-full w-1/4 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${bathrooms === 3 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setBathrooms(3)}
                        >
                        3
                        </button>

                        <button 
                        className={`h-full w-1/4 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${bathrooms === 4 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setBathrooms(4)}
                        >
                        4
                        </button>
                        <input 
                        onChange={(e) => setBathrooms(e.target.value === '' ? '' : parseInt(e.target.value))}
                        onKeyDown={(e) => {
                            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                e.preventDefault();
                            }
                        }}
                        placeholder='4+'
                        className={`h-full w-1/4 flex text-center items-center justify-center rounded-r-lg md:rounded-r-2xl p-2 outline-none ring-2 ring-red-500 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${bathrooms > 4 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        />
                    </div>
                </div> 

                <div className='w-full bg-white flex flex-col space-y-1'>
                    <p className='flex justify-start'> Gender Preferences </p>
                    <div className='flex flex-row h-10 w-full'>
                        <button 
                        className={`h-full w-1/2 flex items-center justify-center rounded-l-lg md:rounded-l-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm lg:text-base ${gender === 'males' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setGender('males')}
                        >
                        Only Males
                        </button>
                        <button 
                        className={`h-full w-1/2 flex items-center justify-center ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm lg:text-base ${gender === 'females' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setGender('females')}
                        >
                        Only Females
                        </button>
                        <button 
                        className={`h-full w-1/2 flex items-center justify-center rounded-r-lg md:rounded-r-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm lg:text-base ${gender === 'co-ed' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setGender('co-ed')}
                        >
                        No Preference
                        </button>
                    </div>
                </div>  

                <div className="">
                    Upload Photos Below<br/>
                    <input type="file" multiple onChange={handleFileChange}/>
                </div>

                <div className='flex justify-center py-6'>
                    <button 
                    type='submit'
                    onClick={() => setSubmitClicked(true)}
                    className={`w-32 text-red-500 py-2 px-4 rounded-2xl transition duration-300 ease-in-out outline-none ring-2 ring-red-500 
                    ${
                        isFormValid ? 'opacity-100 bg-red-500 text-white hover:scale-105 hover:cursor-pointer' : 'opacity-50 cursor-not-allowed'
                    }`} 
                    disabled={!isFormValid}
                    >
                        {submitClicked && !posted ? 
                        <div className='flex items-center justify-center'>
                            <TailSpin color='#ffffff' height={20} width={20}/> 
                        </div> : 
                        <p> Submit </p>}
                    </button>            
                </div>   

            </form>
        </div>
    ) : (isAuthenticated && posted) ? (
        <div className='h-[calc(100vh-54px)] w-full bg-gray-200 flex items-center justify-center'
        style={{ 
            backgroundImage: `url(${Background.src})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div className='h-3/5 rounded-2xl w-4/5 md:w-3/5 lg:w-2/5 flex flex-col space-y-8 bg-white items-center justify-center border-y-8 border-red-500 animate-jump-in animate-duration-700 animate-delay-100'>
                <ConfettiExplosion 
                particleCount={200}
                duration={3000}
                />
                <p className='text-sm sm:text-base md:text-xl text-black font-bold text-center'> 
                    Congratulations! <br/> Your listing has been posted! 
                </p>
            
                <button onClick={() => setPosted(false)} className="bg-red-500 text-xs md:text-base w-32 h-10 rounded-md text-white px-2 py-1 transition duration-500 hover:bg-white hover:text-red-500 hover:outline hover:outline-2 hover:red-500">
                    Post Another
                </button>
            </div>  
        </div>
    ) : <></>
}