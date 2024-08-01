import React from "react";
import Navbar from "../components/Navbar";

import { featuresData } from "../data/Features";
import FeatureCard from "../components/FeaturesCard";
import landingPageImage from "../images/landing_page_image.png";
import recipeImage from "../images/recipe.png";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Navbar */}
      <Navbar isWaitlist={true} />

      {/* HOME SECTION */}
      <section id="home" className="p-20 flex justify-between">
        <div className="w-1/2 flex flex-col items-start mt-40 ">
          {/* Header */}
          <h1 className="text-4xl font-bold mb-8 ">
            Effortlessly Track Your Pantry
          </h1>

          {/* Subheading */}
          <h2 className="text-3xl mb-8">
            <span className="text-primary font-bold">Organize</span> Your
            Kitchen with Ease.
          </h2>

          {/* Intro text */}
          <p className="mb-8 text-lg text-left">
            Keep track of your pantry items, reduce waste, and save money.{" "}
            <br />
            Get timely reminders for expiring items and generate custom shopping
            lists to avoid unnecessary purchases. <br />
            Stay organized and make the most of your pantry with Pantry Pal.
          </p>

          {/* Get Started Button */}
          <button className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800">
            Get Started
          </button>
        </div>

        {/* Image on the right */}
        <div className="w-2/5 flex justify-center">
          <img
            src={landingPageImage}
            alt="Pantry items"
            className="w-4/5 object-contain"
          />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="p-20">
        <div className="flex flex-col items-center mb-8">
          <div className="w-full h-[1px] bg-black opacity-20 mb-4"></div>
          <h2 className="text-4xl font-bold mb-4">Features</h2>

          {/* Features card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="p-20">
        <div className="flex flex-col items-center">
          <div className="w-full h-[1px] bg-black opacity-20 mb-8"></div>
          <h2 className="text-md font-bold mb-10 text-primary">How It Works</h2>
          <h2 className="text-4xl font-bold mb-12">It's easy as 1, 2, 3</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Add & Organize Your Items
              </h3>
              <p className="text-gray-600">
                Create an account and log in on any device. Easily add items to
                your pantry. Categorize and organize items efficiently.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Receive Reminders</h3>
              <p className="text-gray-600">
                Get notifications for expiring items to reduce waste. Generate
                custom shopping lists based on your pantry inventory to avoid
                duplicate purchases.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Discover Recipes</h3>
              <p className="text-gray-600">
                Find recipe suggestions using your pantry items and track your
                usage. Sync your pantry information across all devices for
                seamless access and management.
              </p>
            </div>
          </div>

          <div className="mt-8">
          <button className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-900">
            Join Waitlist
          </button>
          </div>
        </div>
      </section>

      {/* RECIPE SECTION */}
      <section id="recipes" className="p-20">
        <div className="flex flex-col items-center mb-8">
          <div className="w-full h-[1px] bg-black opacity-20 mb-4"></div>
          <h2 className="text-2xl font-bold text-primary">Recipe</h2>

          <div className="flex items-center justify-between w-full relative h-[600px]">
            {/* Left circular text box */}
            <div className="absolute left-0 top-0 w-64 h-64 p-6 bg-white rounded-full shadow-lg flex flex-col justify-center items-center text-center z-10">
              <h3 className="text-lg font-semibold mb-2">
                Pantry-Based Recipes
              </h3>
              <p className="text-sm">
                Find recipes based on what you already have in your pantry,
                reducing waste and simplifying meal planning.
              </p>
            </div>

            {/* Central image */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 flex justify-center">
              <img
                src={recipeImage}
                alt="Recipe book with ingredients"
                className="w-4/5 object-contain"
              />
            </div>

            {/* Right circular text box */}
            <div className="absolute right-0 bottom-0 w-64 h-64 p-6 bg-white rounded-full shadow-lg flex flex-col justify-center items-center text-center z-10">
              <h3 className="text-lg font-semibold mb-2">Quick & Easy</h3>
              <p className="text-sm">
                Browse simple and fast recipes that require minimal ingredients
                and time, perfect for busy days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer/>
    </div>
  );
};

export default LandingPage;
