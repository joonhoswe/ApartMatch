import { React, useRef, useState } from "react";
import emailjs from '@emailjs/browser';
import Background from '@assets/interior.jpeg';

const Contact = () => {

  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const formValid = email != '' && subject != '' && name != '' && message != '';

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
          alert("Message sent successfully!");
        },
        function (error) {
          alert("Error:", error);
          console.log("FAILED...", error);
        }
      );
  };
  return (
    <div>
      <form onSubmit={sendMessage} className="bg-gray-200 text-black flex flex-col space-y-2 items-center justify-center h-screen w-full "
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
                className="outline-none ring-2 ring-gray-200 focus:ring-red-500 rounded-2xl p-2"
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                />
            </div>
            
            <div className="flex flex-col space-y-1 text-start">
                <p className=""> Email </p>
                <input
                className="outline-none ring-2 ring-gray-200 focus:ring-red-500 rounded-2xl p-2"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@gmail.com"
                required
                />
            </div>

            <div className="flex flex-col space-y-1 text-start">
                <p className=""> Subject </p>
                <input
                className="outline-none ring-2 ring-gray-200 focus:ring-red-500 rounded-2xl p-2"
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Help Posting a Listing"
                required
                />
            </div>

            <div className="flex flex-col space-y-1 text-start">
                <p className=""> Message </p>
                <textarea
                className="outline-none ring-2 ring-gray-200 focus:ring-red-500 rounded-2xl p-2"
                onChange={(e) => setMessage(e.target.value)}
                cols="25"
                rows="7"
                required
                placeholder="Hi..."
                />
            </div>

            <div className='flex justify-center pt-6'>
                <input 
                    type='submit'
                    className={`w-32 text-red-500 py-2 px-4 rounded-2xl transition duration-300 ease-in-out outline-none ring-2 ring-red-500 
                    ${
                        formValid ? 'opacity-100 bg-red-500 text-white hover:bg-white hover:text-red-500 hover:cursor-pointer' : 'opacity-50 cursor-not-allowed'
                    }`} 
                    disabled={!formValid}
                />
            </div>    
            
            </div>
      </form>
    </div>
  );
};

export default Contact;
