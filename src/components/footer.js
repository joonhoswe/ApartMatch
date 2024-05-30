import React from "react";
import Image from "next/image";
import Logo from '../assets/logo.png';

export default function Footer() {
    return (
        <div className="bg-red-500 text-white flex flex-col md:flex-row md:space-x-16 lg:space-x-32 max-w-full px-8 md:px-16 py-8 space-y-8 md:space-y-0">
            <div className="flex justify-center md:justify-start">
                <div className="relative w-64 h-24">
                    <Image src={Logo} alt="TutorHive Logo" layout="fill" objectFit="contain" />
                </div>
            </div>
            
            {/* contacts */}
            <div className="flex flex-col space-y-2 pt-3 items-center md:items-start">
                <h1 className="text-2xl"> CONTACT </h1>
                <p> Email: </p>
                <p> Phone: </p>
            </div>

            {/* about */}
            <div className="flex flex-col space-y-2 pt-3 items-center md:items-start">
                <h1 className="text-2xl"> ABOUT </h1>
                <p> Privacy Policy </p>
                <p> Terms of Service </p>
            </div>

            {/* socials */}
            <div className="flex flex-col space-y-2 pt-3 items-center md:items-start">
                <h1 className="text-2xl"> SOCIALS </h1>
                <p> Instagram: </p>
                <p> TikTok </p>
            </div>
        </div>
    );
}
