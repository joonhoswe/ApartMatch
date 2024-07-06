import React from 'react';

export default function Privacy() {

    return (
        <div className="w-full h-screen overflow-auto bg-white flex flex-col items-start justify-start p-4 py-8 md:px-8 md:py-16 text-black">

            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2"> Privacy Policy </h1>
            <p className='text-sm md:text-base'> 
            At ApartMatch, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, you are prohibited from using or accessing this site.
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2 mt-4"> Information We Collect </h1>

            <h2 className="text-xl md:text-2xl font-bold text-black mb-2 mt-2"> Personal Information </h2>
            <p className='text-sm md:text-base'> 
            When you register on ApartMatch and use our services, we collect personal information that you voluntarily provide to us. This includes: <br/>
            <span className='font-bold text-sm md:text-base'> Username: </span>Collected and securely stored through Auth0 during account creation. <br/>
            <span className='font-bold text-sm md:text-base'> Email: </span>Collected and securely stored through Auth0 during account creation.  <br/>
            <span className='font-bold text-sm md:text-base'> Password: </span>Collected and securely stored through Auth0 during account creation. 
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-black mb-2 mt-4"> Listing Information </h2>
            <p className='text-sm md:text-base'> 
            When you post a home listing on ApartMatch, we collect the following information: <br/>
            <span className='font-bold text-sm md:text-base'> Address: </span>The street address of the property. <br/>
            <span className='font-bold text-sm md:text-base'> Listing Details: </span>Information about the property, such as the number of rooms, rental price, owner&apos;s gender preferences, and other relevant details.  <br/>
            <span className='font-bold text-sm md:text-base'> Images: </span>Photos of the property.
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2 mt-4"> How We Use Your Information </h1>

            <h2 className="text-xl md:text-2xl font-bold text-black mb-2 mt-2"> Personal Information </h2>
            <p className='text-sm md:text-base'> 
            <span className='font-bold text-sm md:text-base'> To Create and Manage Your Account: </span>We use your username, email, and password to create and manage your account through Auth0. <br/>
            <span className='font-bold text-sm md:text-base'> To Connect You With Your Future Roommates: </span>We use your email address to connect you with other users in the same listing for communication and coordination. <br/>
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-black mb-2 mt-4"> Listing Information </h2>
            <p className='text-sm md:text-base'> 
            <span className='font-bold text-sm md:text-base'> To Display Listings: </span>We use the address, listing details, and images you provide to display your listing on ApartMatch. <br/>
            <span className='font-bold text-sm md:text-base'> To Facilitate Matching: </span>We use the information in your listing to help match you with potential roommates or tenants.
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2 mt-4"> Sharing Your Information </h1>

            <h2 className="text-xl md:text-2xl font-bold text-black mb-2 mt-2"> Personal Information </h2>
            <p className='text-sm md:text-base'> 
            We do not sell, trade, or otherwise transfer your personal information to outside parties, except as described in this Privacy Policy or with your consent. We may share your personal information with: <br/>
            <span className='font-bold text-sm md:text-base'> Service Providers: </span>Third-party service providers who assist us in operating our website and conducting our business, such as Auth0 for authentication services.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-black mb-2 mt-4"> Listing Information </h2>
            <p className='text-sm md:text-base'> 
            <span className='font-bold text-sm md:text-base'> Public Listings: </span>The address, details, and images of your listings are publicly displayed on ApartMatch to facilitate the matching process. <br/>
            <span className='font-bold text-sm md:text-base'> Potential Matches: </span>Your email address may be shared with users who are interested in joining your listing to facilitate communication.
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2 mt-4"> Cookies and Tracking Technologies </h1>
            <p className='text-sm md:text-base'> 
            We may use cookies and similar tracking technologies to track activity on our site and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our site.
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2 mt-4"> Data Retention </h1>
            <p className='text-sm md:text-base'> 
            We will retain your personal information for as long as your account is active or as needed to provide you services, comply with our legal obligations, resolve disputes, and enforce our agreements. Listing information will be retained as long as the listing is active on ApartMatch.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-black mb-2 mt-4"> Changes to Privacy Policy </h2>
            <p className='text-sm md:text-base'> 
            We reserve the right to modify our Privacy Policy at any time. Any changes will be effective immediately upon posting on the site. Your continued use of ApartMatch after the posting of revised Privacy Policy constitutes your acceptance of the changes.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-black mb-2 mt-4"> Contact Us </h2>
            <p className='text-sm md:text-base'> 
            If you have any questions or concerns about our Privacy Policy, please contact us at: apartmatchco@gmail.com <br/>
            By using ApartMatch, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>

            <p className="text-sm md:text-base text-gray-400 mt-4"> Last updated: July 05 2024 </p>
        </div>
    );        
}