import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';

export default function Home() {

  const [perksVisible, setPerksVisible] = useState(false);

  useEffect(() => {
    setPerksVisible(true);
  }, []);


  const opacityList = [{num: 1}, {num: 0.8}, {num: 0.6}, {num: 0.4}, {num: 0.2}];

  const perks = [
    { number: "100+", description: "Subjects to learn from" },
    { number: "1-On-1", description: "Tutoring Available" },
    { number: "$50/hr", description: "Rate for personalized tutoring!" },
  ];


  return (
    <div className="bg-yellow-150 flex flex-col justify-center items-center overflow-hidden relative w-full min-h-screen">
      {opacityList.map((opac, index) => (
        <div key={index} className="text-blue-400" style={{opacity: opac.num}}>
          <h1 className = "text-4xl">Tutoring Reinvented.</h1>
        </div>
      ))}
      <div className="h-20"></div>
      <div className="text-blue-400">
      _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
      </div>
      <div className="h-10"></div>
      <div className={`text-blue-400 text-4xl font-bold animate-fade-in delay-250 duration-1000 ${perksVisible ? 'opacity-100' : 'opacity-0'}`}>
        TutorHive
      </div><div className={`text-blue-400 text-4xl animate-fade-in delay-250 duration-1000 ${perksVisible ? 'opacity-100' : 'opacity-0'}`}>
        Offers:
      </div>
      <div className="h-10"></div>
      <div className="flex flex-col md:flex-row md:space-x-16 lg:space-x-64 w-full px-8 md:px-16 lg:px-32 items-center justify-center">
        <div className={`flex text-blue-400 flex-col space-y-2 pt-3 items-center md:items-start animate-fade-in delay-750 duration-1000 ${perksVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-2xl">{perks[0].number}</h1>
          <p>{perks[0].description}</p>
        </div>
        <div className={`flex text-blue-400 flex-col space-y-2 pt-3 items-center md:items-start animate-fade-in delay-500 duration-1000 ${perksVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-2xl">{perks[1].number}</h1>
          <p>{perks[1].description}</p>
        </div>
        <div className={`flex text-blue-400 flex-col space-y-2 pt-3 items-center md:items-start animate-fade-in delay-1000 duration-1000 ${perksVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-2xl">{perks[2].number}</h1>
          <p>{perks[2].description}</p>
        </div>
      </div>
    </div>
  );
}
