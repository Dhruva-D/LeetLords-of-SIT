import React, { useState } from 'react'

const App = () => {
 
  const [track,setTrack] = useState('Total Ranking')

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
      <div className='h-80 md:w-[40%] bg-slate-900 rounded-lg my-12 mx-auto text-white'>
        i am personel content
      </div>
      <div className='h-[4px] w-full rounded-lg bg-slate-700 my-10'></div>
      <div className='h-fit w-[100%] md:w-[80%] bg-slate-900 mx-auto rounded-full flex items-center justify-center text-white p-3'>
        i am leaderboard
      </div>
    </div>
  )
}

export default App
