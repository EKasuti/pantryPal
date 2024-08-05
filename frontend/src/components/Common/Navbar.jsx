import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailModal from '../Waitlist/EmailModal';

function Navbar({ isWaitlist = false, activePage = 'home' }) {
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleWaitlistClick() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  const navItems = ['home', 'features', 'how-it-works', 'recipes'];

  const NavItems = () => (
    <>
      {navItems.map((item) => (
        <li key={item}>
          <a 
            href={`#${item}`}
            className={`pb-2 ${activePage === item ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </a>
        </li>
      ))}
    </>
  );

  const AuthButtons = () => (
    <>
      {isWaitlist ? (
        <li>
          <button 
            onClick={handleWaitlistClick}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800 w-full"
          >
            Join Waitlist
          </button>
        </li>
      ) : (
        <>
          <li>
            <button
              onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 w-full mb-2"
            >
              Sign Up
            </button>
          </li>
          <li>
            <button
              onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800 w-full"
            >
              Login
            </button>
          </li>
        </>
      )}
    </>
  );

  return (
    <nav className='fixed top-0 left-0 right-0 flex justify-between items-center px-4 sm:px-20 py-4 h-[80px] bg-white z-50 shadow-md'>
      <div className="font-bold text-xl">
        PantryPal
      </div>

      {/* Mobile menu button */}
      <button
        className="sm:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Desktop menu */}
      <ul className='hidden sm:flex items-center space-x-12'>
        <NavItems />
        <AuthButtons />
      </ul>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-[80px] left-0 right-0 bg-white shadow-md sm:hidden">
          <ul className='flex flex-col items-center space-y-4 py-4'>
            <NavItems />
            <AuthButtons />
          </ul>
        </div>
      )}

      <EmailModal isOpen={showModal} onClose={handleCloseModal} />
    </nav>    
  );
}

export default Navbar;