import React, { useState } from "react";
import Navbar from "../components/Common/Navbar";
import { featuresData } from "../data/Features";
import FeatureCard from "../components/FeaturesCard";
import landingPageImage from "../images/landing_page_image.png";
import recipeImage from "../images/recipe.png";
import Footer from "../components/Common/Footer";
import EmailModal from "../components/Waitlist/EmailModal";
import { API_BASE_URL } from '../config/api';

function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [activePage, setActivePage] = useState('home');

  function handleOpenModal() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage('Thank you! Your email has been added to our waitlist.');
        setEmail('');
        setTimeout(() => setSubmitMessage(''), 5000);
      } else if (response.status === 409) {
        setSubmitError(data.message);
      } else {
        throw new Error(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.message || 'Failed to submit email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCloseMessage() {
    setSubmitMessage('');
  }

  function handleScroll(event) {
    const sections = ['home', 'features', 'how-it-works', 'recipes'];
    const scrollPosition = window.scrollY;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section && scrollPosition >= section.offsetTop - 100) {
        setActivePage(sections[i]);
        break;
      }
    }
  }

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white">
      <Navbar isWaitlist={false} activePage={activePage}/>

      <section id="home" className="p-8 sm:p-8 md:p-20 flex flex-col md:flex-row justify-between items-center">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start mt-[120px] md:mt-40">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-8 text-center md:text-left">
            Effortlessly Track Your Pantry
          </h1>
          <h2 className="text-2xl md:text-3xl mb-4 md:mb-8 text-center md:text-left">
            <span className="text-primary font-bold">Organize</span> Your
            Kitchen with Ease.
          </h2>
          <p className="mb-6 md:mb-8 text-base md:text-lg text-center md:text-left">
            Keep track of your pantry items, reduce waste, and save money.
            Get timely reminders for expiring items and generate custom shopping
            lists to avoid unnecessary purchases.
            Stay organized and make the most of your pantry with Pantry Pal.
          </p>
          <button
            onClick={handleOpenModal}
            className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 w-full md:w-auto"
          >
            Get Started
          </button>
        </div>
        <div className="w-full md:w-2/5 flex justify-center mt-8 md:mt-0">
          <img
            src={landingPageImage}
            alt="Pantry items"
            className="w-4/5 md:w-full object-contain"
          />
        </div>
      </section>

      <section id="features" className="p-8 sm:p-8 md:p-20">
        <div className="flex flex-col items-center mb-8">
          <div className="w-full h-[1px] bg-black opacity-20 mb-4"></div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {featuresData.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="p-8 sm:p-8 md:p-20">
        <div className="flex flex-col items-center">
          <div className="w-full h-[1px] bg-black opacity-20 mb-4"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2 sm:mb-4 text-center">How it works</h2>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-12 text-center">It's easy as 1, 2, 3</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 text-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
                Add & Organize Your Items
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Create an account and log in on any device. Easily add items to
                your pantry. Categorize and organize items efficiently.
              </p>
            </div>
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Receive Reminders</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Get notifications for expiring items to reduce waste. Generate
                custom shopping lists based on your pantry inventory to avoid
                duplicate purchases.
              </p>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Discover Recipes</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Find recipe suggestions using your pantry items and track your
                usage. Sync your pantry information across all devices for
                seamless access and management.
              </p>
            </div>
          </div>
          <div className="w-full max-w-2xl mt-8">
            {submitMessage && (
              <div className="text-center p-4 bg-green-100 rounded-lg mb-4 relative">
                <p className="text-green-700 font-semibold">{submitMessage}</p>
                <button 
                  onClick={handleCloseMessage}
                  className="absolute top-1 right-2 text-green-700 hover:text-green-900"
                  aria-label="Close message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 rounded-l-full sm:rounded-l-full sm:rounded-r-none border-2 border-r-0 border-gray-300 focus:outline-none focus:border-primary mb-2 sm:mb-0"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-r-full sm:rounded-l-none font-semibold hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Get early access'}
              </button>
            </form>
            {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
          </div>
        </div>
      </section>

      <section id="recipes" className="p-8 sm:p-8 md:p-20">
        <div className="flex flex-col items-center mb-8">
          <div className="w-full h-[1px] bg-black opacity-20 mb-4"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 text-center">Recipe</h2>
          <div className="flex flex-col md:flex-row items-center justify-between w-full relative md:h-[600px]">
            <div className="w-full md:w-64 h-64 p-6 bg-white rounded-full shadow-lg flex flex-col justify-center items-center text-center z-10 mb-8 md:mb-0 md:absolute md:left-0 md:top-0">
              <h3 className="text-lg font-semibold mb-2">
                Pantry-Based Recipes
              </h3>
              <p className="text-sm">
                Find recipes based on what you already have in your pantry,
                reducing waste and simplifying meal planning.
              </p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0 md:absolute md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2">
              <img
                src={recipeImage}
                alt="Recipe book with ingredients"
                className="w-4/5 object-contain"
              />
            </div>
            <div className="w-full md:w-64 h-64 p-6 bg-white rounded-full shadow-lg flex flex-col justify-center items-center text-center z-10 md:absolute md:right-0 md:bottom-0">
              <h3 className="text-lg font-semibold mb-2">Quick & Easy</h3>
              <p className="text-sm">
                Browse simple and fast recipes that require minimal ingredients
                and time, perfect for busy days.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <EmailModal isOpen={showModal} onClose={handleCloseModal} onSubmit={handleSubmit} />
    </div>
  );
}

export default LandingPage;