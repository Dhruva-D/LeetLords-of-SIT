import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom';


const Register = () => {

  const navigate = useNavigate()

  const username = useRef(null)
  const linkedIn = useRef(null)
  const git = useRef(null)

  const handleClick = (e) =>{

    if(!username.current.value || !linkedIn.current.value || !git.current.value){
      //react toastify barutte
      return
    }

    e.preventDefault()

    const userData = username.current.value

    localStorage.setItem('userData', JSON.stringify(userData));

    const data = JSON.parse(localStorage.getItem('userData'));
    console.log(data);

    navigate('/')
  }

  return (
    <div className='bg-customGray min-h-screen w-screen py-16 px-1 md:p-16'>
      <form className='text-slate-200 w-[90%] rounded-lg px-4 md:w-1/2 bg-slate-900 mx-auto md:px-10 md:py-4'>
        <h1 className='text-5xl font-bold underline underline-offset-4 text-center'>Register</h1>
        <div className='mt-10 flex flex-col items-start gap-3'>
          <label htmlFor='username' className='font-2xl font-semibold'>UserName:</label>
          <input ref={username} type='text' name='username' placeholder='Enter your username' className='p-2 rounded-xl text-black w-[90%]' required/>
        </div>
        <div className='mt-10 flex flex-col items-start gap-3'>
          <label htmlFor='linkedIn' className='font-2xl font-semibold'>LinkedIn Id:</label>
          <input ref={linkedIn} type='text' name='linkedIn' placeholder='Enter your LinkedIn Id' className='p-2 rounded-xl text-black w-[90%]' required/>
        </div>
        <div className='mt-10 flex flex-col items-start gap-3'>
          <label htmlFor='githubId' className='font-2xl font-semibold'>GitHub Id:</label>
          <input ref={git} type='text' name='githubId' placeholder='Enter your github Id' className='p-2 rounded-xl text-black w-[90%]' required/>
        </div>
        <button onClick={handleClick} className="cursor-pointer relative group overflow-hidden border-2 px-8 py-2 border-customBlue mx-[35%] mt-16 mb-2 rounded-sm">
          <span className="font-bold text-white text-xl relative z-10 group-hover:text-customBlue duration-500">Submit</span>
          <span className="absolute top-0 left-0 w-full bg-customBlue duration-500 group-hover:-translate-x-full h-full"></span>
          <span className="absolute top-0 left-0 w-full bg-customBlue duration-500 group-hover:translate-x-full h-full"></span>
          
            <span className="absolute top-0 left-0 w-full bg-customBlue duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
          <span className="absolute delay-300 top-0 left-0 w-full bg-customBlue duration-500 group-hover:translate-y-full h-full"></span>
        </button>
      </form>
    </div>
  )
}

export default Register
