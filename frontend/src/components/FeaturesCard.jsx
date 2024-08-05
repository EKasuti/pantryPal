import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 flex flex-col items-start">
    <div className="text-primary text-xl sm:text-2xl mb-3 sm:mb-4">{icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm sm:text-base text-gray-600 text-left">{description}</p>
  </div>
);

export default FeatureCard;