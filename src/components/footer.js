import React from "react";
import Image from "next/image";
import Logo from '../assets/logo.png';

export default function Footer() {
    return (
        <div className="bg-red-500 text-white flex flex-col md:flex-row md:space-x-16 lg:space-x-32 min-h-[100px]lg:h-56 w-full px-8 md:px-16 py-8 space-y-8">
            <div className="flex justify-center md:justify-start">
                <div className="relative w-48 h-16 md:w-64 md:h-24">
                    <Image src={Logo} alt="ApartMatch Logo" layout="fill" objectFit="contain" />
                </div>
            </div>
            
            {/* contacts */}
            <div className="flex flex-col space-y-2 items-center md:items-start">
                <h1 className="text-base md:text-2xl"> CONTACT </h1>
                <p className="text-sm md:text-base"> apartmatchco@gmail.com </p>
            </div>

            {/* about */}
            <div className="flex flex-col space-y-2 items-center md:items-start">
                <h1 className="text-base md:text-2xl"> ABOUT </h1>
                <p className="text-sm md:text-base"> Privacy Policy </p>
                <p className="text-sm md:text-base"> Terms of Service </p>
            </div>

            {/* socials */}
            <div className="flex flex-col space-y-2 items-center md:items-start">
                <h1 className="text-base md:text-2xl"> SOCIALS </h1>
                <p className="text-sm md:text-base"> Instagram: </p>
                <p className="text-sm md:text-base"> TikTok </p>
            </div>
        </div>
    );
}
