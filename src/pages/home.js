import { React, useEffect, useState } from 'react';

export default function Home() {

  // const [perksVisible, setPerksVisible] = useState(false);
  const [school, setSchool] = useState('');

  // useEffect(() => {
  //   setPerksVisible(true);
  // }, []);


  // const opacityList = [{num: 1}, {num: 0.8}, {num: 0.6}, {num: 0.4}, {num: 0.2}];

  // const perks = [
  //   { number: "100+", description: "Subjects to learn from" },
  //   { number: "1-On-1", description: "Tutoring Available" },
  //   { number: "$50/hr", description: "Rate for personalized tutoring!" },
  // ];


  return (
    <div className="bg-gray-950 flex flex-col space-y-4 justify-between items-center w-full h-screen text-white font-bold py-20">

      {/* {opacityList.map((opac, index) => (
        <div key={index} className="text-blue-400" style={{opacity: opac.num}}>
          <h1 className = "text-4xl"> Off-Campus SuiteMate Finding Reinvented. </h1>
        </div>
      ))} */}

      <div className='text-4xl flex flex-col space-y-6'>
        <h1 className=''> Say goodbye to scouring old Facebook threads. </h1>
        <h1 className=''> Say hello to quickly <span className='text-red-500'> matching </span> into apartments. </h1>
      </div>

      <div className='flex justify-end bg-white h-12 w-3/5 rounded-2xl'>
        <input 
          onChange={(e) => setSchool(e.target.value)} 
          className={`h-full w-5/6 rounded-l-2xl px-4 text-black outline-none ${school === '' ? 'text-gray-400' : ''}`} 
          placeholder="Ex: Carnegie Mellon University"
        />
        <button onClick={() => setSchool()} className='bg-red-500 h-full w-1/6 rounded-r-2xl'> Find Homes! </button>
      </div>

      <div></div>

    </div>
  );
}
