import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const App = () => {
 
  const [track,setTrack] = useState('Total Ranking')

  const userData = JSON.parse(localStorage.getItem('userData'))
  console.log(userData)

  const changeTable = (event) =>{
    const content = event.target.innerText
    setTrack(content)
    console.log(track)
  }

  return (
    <div className='h-screen w-screen bg-customGray px-6 py-12'>"
      <div className='h-12 w-[100%] md:w-[80%] bg-slate-900 mx-auto rounded-full flex items-center justify-center '>
        <div onClick={changeTable} className={`h-[90%] md:h-full w-[50%] ${track === "Total Ranking" ? "bg-customBlue rounded-md shadow-custom-large" : ""} cursor-pointer text-white text-center py-1 md:font-semibold text-xl md:text-2xl`}>
            Total Ranking
        </div>
        <div onClick={changeTable} className={`h-[90%] md:h-full w-[50%] ${track === "Weekly Ranking" ? "bg-customBlue rounded-md shadow-custom-large" : ""} cursor-pointer text-white text-center py-1 md:font-semibold text-xl md:text-2xl`}>
            Weekly Ranking
        </div>
      </div>
      {userData && <div className='h-80 md:w-[40%] bg-slate-900 rounded-lg my-12 mx-auto text-white'>
        i am personel content
      </div>}
      {!userData && <Link to={'/register'} className='flex items-center justify-center'>
        <button className="cursor-pointer relative group overflow-hidden border-2 px-8 py-2 border-customBlue mt-16 mb-2 rounded-sm">
          <span className="font-bold text-white text-xl relative z-10 group-hover:text-customBlue duration-500">Register Your Self</span>
          <span className="absolute top-0 left-0 w-full bg-customBlue duration-500 group-hover:-translate-x-full h-full"></span>
          <span className="absolute top-0 left-0 w-full bg-customBlue duration-500 group-hover:translate-x-full h-full"></span>
          
            <span className="absolute top-0 left-0 w-full bg-customBlue duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
          <span className="absolute delay-300 top-0 left-0 w-full bg-customBlue duration-500 group-hover:translate-y-full h-full"></span>
        </button>
      </Link>}
      <div className='h-[4px] w-full rounded-lg bg-slate-700 my-10'></div>
      <div className='h-fit w-[100%] md:w-[80%] bg-slate-900 mx-auto rounded-full flex items-center justify-center text-white p-3'>
        i am leaderboard
      </div>
    </div>
  )
}

export default App
