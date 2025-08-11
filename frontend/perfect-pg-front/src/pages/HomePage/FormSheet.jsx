import React, { useState } from 'react';

const FormComponent = () => {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [property, setProperty] = useState('');

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handlePropertyChange = (e) => {
    setProperty(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission here, e.g., send data to server or process locally
    console.log({ city, category, property });
    // Reset form fields if needed
    setCity('');
    setCategory('');
    setproperty('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City:
        </label>
        <select
          id="city"
          value={city}
          onChange={handleCityChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select City</option>
          <option value="New York">New York</option>
          <option value="London">London</option>
          <option value="Tokyo">Tokyo</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category:
        </label>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Category</option>
          <option value="Technology">Male</option>
          <option value="Food">Female</option>
          <option value="Sports">Co-livig</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="property" className="block text-sm font-medium text-gray-700">
          propertyFor:
        </label>
        <select
          id="property"
          value={property}
          onChange={handlePropertyChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select property For</option>
          <option value="Male">Unique Pg-Boys</option>
          <option value="Female">Unique Pg-Girls</option>
          <option value="Other">Happy Pg-Co</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default FormComponent;
