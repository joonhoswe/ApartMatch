import { React, useState } from "react";
import emailjs from '@emailjs/browser';
import Background from '@assets/interior.jpeg';
import ConfettiExplosion from 'react-confetti-explosion';
import Link from 'next/link';
import { TailSpin } from 'react-loader-spinner';

const Contact = () => {

  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false); 
  const [sent, setSent] = useState(false);

  const isFormValid = email != '' && subject != '' && name != '' && message != '';

  const sendMessage = (e) => {
    e.preventDefault();
    const templateParams = {
        name: name,
        email: email,
        subject: subject,
        message: message
    };
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
          setSent(true);
          setSubmitClicked(false);
          setEmail('');
          setSubject('');
          setName('');
          setMessage('');
        },
        function (error) {
          alert("Error:", error);
          console.log("FAILED...", error);
        }
      );
  };
  return (!sent) ? (
    <div>
      <form onSubmit={sendMessage} className="bg-gray-200 text-black flex flex-col space-y-2 items-center justify-center h-[calc(100vh-54px)] w-full "
      style={{ 
        backgroundImage: `url(${Background.src})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="bg-white text-xs sm:text-base rounded-2xl p-8 shadow-2xl text-black text-center w-full sm:w-3/5 md:w-3/5 lg:w-1/3 flex flex-col space-y-5 border-y-8 border-red-500">
            <p className="text-2xl font-bold mb-4">
            Questions or Concerns?
            </p>

            <div className="flex flex-col space-y-1 text-start">
                <p className=""> Name </p>
                <input
                value={name}
                className="outline-none ring-2 ring-gray-200 focus:ring-red-500 rounded-2xl p-2"
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                />
            </div>
            
            <div className="flex flex-col space-y-1 text-start">
                <p className=""> Email </p>
                <input
                value={email}
                className="outline-none ring-2 ring-gray-200 focus:ring-red-500 rounded-2xl p-2"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@gmail.com"
                required
                />
            </div>

            <div className="flex flex-col space-y-1 text-start">
                <p className=""> Subject </p>
                <input
                value={subject}
                className="outline-none ring-2 ring-gray-200 focus:ring-red-500 rounded-2xl p-2"
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Help Posting a Listing"
                required
                />
            </div>

            <div className="flex flex-col space-y-1 text-start">
                <p className=""> Message </p>
                <textarea
                value={message}
                className="outline-none ring-2 ring-gray-200 focus:ring-red-500 rounded-2xl p-2"
                onChange={(e) => setMessage(e.target.value)}
                cols="25"
                rows="7"
                required
                placeholder="Hi..."
                />
            </div>

            <div className='flex justify-center pt-6'>
                <button 
                type='submit'
                onClick={() => setSubmitClicked(true)}
                className={`w-32 text-red-500 py-2 px-4 rounded-2xl transition duration-300 ease-in-out outline-none ring-2 ring-red-500 
                ${
                    isFormValid ? 'opacity-100 bg-red-500 text-white hover:scale-105 hover:cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`} 
                disabled={!isFormValid}
                >
                {
                submitClicked && !sent ? 
                <div className='flex items-center justify-center'>
                    <TailSpin color='#ffffff' height={20} width={20}/> 
                </div> : 
                <p> Submit</p>
                }

                </button>
            </div>    
            
            </div>
      </form>
    </div>
  ) : (
    <div className='h-[calc(100vh-54px)] w-full bg-gray-200 flex items-center justify-center'
    style={{ 
        backgroundImage: `url(${Background.src})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className='h-3/5 rounded-2xl w-5/6 sm:w-3/5 lg:w-2/5 flex flex-col bg-white items-center justify-between py-8 px-2 border-y-8 border-red-500'>
            <ConfettiExplosion 
            particleCount={200}
            duration={3000}
            />
            <p className='text-sm sm:text-base md:text-xl text-black font-bold text-center'> 
                Message sent! <br/> Our team will be in touch shortly. 
            </p>
        
            <Link href='/home' className="bg-red-500 text-xs md:text-base w-24 sm:w-32 h-10 rounded-md text-white px-2 py-1 flex items-center justify-center transition duration-500 hover:bg-white hover:text-red-500 hover:outline hover:outline-2 hover:red-500">
                Return Home
            </Link>
        </div>  
    </div>
    
    );
};

export default Contact;
