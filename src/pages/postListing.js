import { React, useState, useEffect } from  'react';
import Background from '@assets/osuAstonPlaceApartments.jpeg';
import { useAuth0 } from "@auth0/auth0-react";
import ConfettiExplosion from 'react-confetti-explosion';


import axios from 'axios';

export default function postListing() {

    const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

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

    const [posted, setPosted] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);

    const isFormValid = owner !== '' && address !== '' && state !== '' && zipCode !== ''  && city !== '' && homeType !== '' && rooms !== '' && bathrooms !== '' && gender !== '';

    useEffect(() => {
        if (user) {
          setOwner(user.nickname);
        }
      }, [user]);

    const clearForm = () => {
        setAddress('');
        setZipCode('');
        setState('');
        setCity('');
        setHomeType('');
        setRent('');
        setRooms(0);
        setBathrooms(0);
        setGender('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isFormValid || !submitClicked) return; // Prevent invalid submissions (client-side validation)
    
        // Data to send to backend
        const dataForSql = {
            owner,
            address,
            state,
            zipCode,
            city,
            rent,
            homeType,
            rooms,
            bathrooms,
            gender,
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
    

    return (isAuthenticated && !posted) ? (
        <div className="bg-gray-200 flex flex-col justify-center items-center w-full h-screen" 
            style={{ 
                backgroundImage: `url(${Background.src})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
            <form onSubmit={handleSubmit} className="bg-white text-xs sm:text-base rounded-2xl p-8 shadow-2xl text-black text-center w-full sm:w-3/5 md:w-3/5 lg:w-1/3 flex flex-col space-y-3 border-y-8 border-red-500">
                <div className = "text-base sm:text-xl p-4 rounded-2xl font-bold mb-4">
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
                    value = {state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State: "
                    className='ring-2 ring-gray-300 outline-none focus:ring-2 focus:ring-red-600 bg-white rounded-2xl p-4 h-10 w-full'/>

                    <input 
                    value = {zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Zip Code: "
                    className='ring-2 ring-gray-300 outline-none focus:ring-2 focus:ring-red-600 bg-white rounded-2xl p-4 h-10 w-full'/>    
                </div>

                <input 
                value = {city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City: "
                className='ring-2 ring-gray-300 outline-none focus:ring-2 focus:ring-red-600 bg-white rounded-2xl p-4 h-10 w-full'/>

                <input 
                value = {rent}
                onChange={(e) => setRent(e.target.value)}
                placeholder="Monthly Rent: ex: 1200"
                className='ring-2 ring-gray-300 outline-none focus:ring-2 focus:ring-red-600 bg-white rounded-2xl p-4 h-10 w-full'/>

                <div className='w-full bg-white flex flex-col space-y-2'>
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

                <div className='w-full bg-white flex flex-col space-y-2'>
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
                        placeholder='4+'
                        className={`h-full w-1/4 flex text-center items-center justify-center rounded-r-lg md:rounded-r-2xl p-2 outline-none ring-2 ring-red-500 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${rooms > 4 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onChange={(e) => setRooms(e.target.value)}
                        />
                    </div>
                </div> 

                <div className='w-full bg-white flex flex-col space-y-2'>
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
                        placeholder='4+'
                        className={`h-full w-1/4 flex text-center items-center justify-center rounded-r-lg md:rounded-r-2xl p-2 outline-none ring-2 ring-red-500 transition ease-in-out duration-200 text-xs sm:text-sm lg:text-base ${bathrooms > 4 ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onChange={(e) => setBathrooms(e.target.value)}
                        />
                    </div>
                </div> 

                <div className='w-full bg-white flex flex-col space-y-2'>
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
                        className={`h-full w-1/2 flex items-center justify-center rounded-r-lg md:rounded-r-2xl ring-2 ring-red-500 hover:bg-red-600 transition ease-in-out duration-300 text-xs sm:text-sm lg:text-base ${gender === 'both' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setGender('both')}
                        >
                        No Preference
                        </button>
                    </div>
                </div>  

                <div className='flex justify-center pt-6'>
                    <input 
                        type='submit'
                        onClick={() => setSubmitClicked(true)}
                        className={`w-32 text-red-500 py-2 px-4 rounded-2xl transition duration-300 ease-in-out outline-none ring-2 ring-red-500 
                        ${
                            isFormValid ? 'opacity-100 bg-red-500 text-white hover:bg-white hover:text-red-500 hover:cursor-pointer' : 'opacity-50 cursor-not-allowed'
                        }`} 
                        disabled={!isFormValid}
                    />
                </div>    
            </form>
        </div>
    ) 
    : (isAuthenticated && posted) ? (
        <div className='h-[calc(100vh-54px)] w-full bg-gray-200 flex items-center justify-center'>
            <div className='h-3/5 rounded-2xl w-4/5 md:w-3/5 lg:w-2/5 flex flex-col space-y-8 bg-white items-center justify-center border-y-8 border-red-500'>
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
    ) :

    // If user is not authenticated, display this message and button to login
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
    );
}