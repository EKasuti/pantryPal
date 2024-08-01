import React, { useState } from 'react';
import EmailModal from './EmailModal';

function Navbar({ isWaitlist = false, activePage = 'home' }) {
  const [showModal, setShowModal] = useState(false);

  function handleWaitlistClick() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  const navItems = ['home', 'features', 'how-it-works', 'recipes'];

  return (
    <nav className='fixed top-0 left-0 right-0 flex justify-between items-center px-20 py-4 h-[80px] bg-white z-50 shadow-md'>
      <div className="font-bold text-xl">
        PantryPal
      </div>

      <ul className='flex items-center space-x-12'>
        {navItems.map((item) => (
          <li key={item}>
            <a 
              href={`#${item}`}
              className={`pb-2 ${activePage === item ? 'border-b-2 border-primary' : ''}`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </a>
          </li>
        ))}
        {isWaitlist ? (
          <li>
            <button 
              onClick={handleWaitlistClick}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Join Waitlist
            </button>
          </li>
        ) : (
          <>
            <li><button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Sign Up</button></li>
            <li><button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800">Login</button></li>
          </>
        )}
      </ul>

      <EmailModal isOpen={showModal} onClose={handleCloseModal} />
    </nav>    
  );
}

export default Navbar;