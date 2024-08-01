import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-12 rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 flex flex-col items-start">
    <div className="text-primary text-2xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-left">{description}</p>
  </div>
);

export default FeatureCard;