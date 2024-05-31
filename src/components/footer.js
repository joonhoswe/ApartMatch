import React from "react";
import Image from "next/image";
import Logo from '@assets/logo.png';

export default function Footer() {
    return (
        <div className="bg-red-500 text-white flex flex-row space-x-6 md:space-x-16 lg:space-x-32 w-full h-[60vh] md:h-52 min-h-full px-8 md:px-16 py-8">
            <div className="flex items-center justify-center">
                <div className="relative w-36 h-8 md:w-64 md:h-12">
                    <Image src={Logo} alt="ApartMatch Logo" layout="fill" objectFit="contain"/>
                </div>
            </div>
            
            {/* contacts */}
            <div className="flex flex-col space-y-2 justify-center items-center text-xs md:text-base">
                <h1 className="text-sm md:text-2xl"> CONTACT </h1>
                <p> apartmatchco@gmail.com </p>
                <p> xxx-xxx-xxxx </p>
            </div>

            {/* about */}
            <div className="flex flex-col space-y-2 justify-center items-center text-xs md:text-base">
                <h1 className="text-sm md:text-2xl"> ABOUT </h1>
                <p> Privacy Policy </p>
                <p> Terms of Service </p>
            </div>
        </div>
    );
}
