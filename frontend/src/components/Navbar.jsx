import React from 'react'

function Navbar({isWaitlist = false}) {
  return (
    <nav className='fixed top-0 left-0 right-0 flex justify-between items-center px-20 py-4 h-[80px] bg-white z-50 shadow-md'>
      <div className="font-bold text-xl">
        PantryPal
      </div>

      <ul className='flex items-center space-x-12'>
      <li><a href="#home">Home</a></li>
        <li><a href="#features" >Features</a></li>
        <li><a href="#how-it-works">How it works</a></li>
        <li><a href="#recipes">Recipes</a></li>
        {isWaitlist ? (
          <li><button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800">Join Waitlist</button></li>
        ) : (
          <>
            <li><button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Sign Up</button></li>
            <li><button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800">Login</button></li>
          </>
        )}
       </ul>

    </nav>    
  )
}

export default Navbar
