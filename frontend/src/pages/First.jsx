import React from 'react';

const First = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#d2e2d9] via-[#4c906a] to-[#1da358]">
      <div className="text-center text-[#000000] p-6 bg-opacity-75 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Welcome to Green Harvest
        </h1>
        <p className="text-xl sm:text-2xl mb-6">
        Join us in cultivating a greener future! Green Harvest is your gateway to sustainable farming, healthy living, and eco-friendly solutions. Together, let's nurture nature and grow a healthier tomorrow.
        </p>
        {/* <div className="flex justify-center mt-4">
          <button
            className="px-8 py-3 text-lg font-semibold bg-green-700 hover:bg-green-800 rounded-full transition-all ease-in-out duration-300"
            onClick={() => alert('Getting Started!')}
          >
            Let's Get Started
          </button> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default First;
