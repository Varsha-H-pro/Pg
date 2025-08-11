import React from 'react';

const PropertyCard = () => {
  return (
    <div className="property-inner border border-gray-200 rounded-lg overflow-hidden shadow-lg">
      <div className="image">
        <img src="" alt="property" />
      </div>
      <div className="content p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="left">
            <h3 className="title text-xl font-bold mb-2"><a href="/">Zuhause PG</a></h3>
            <span className="location flex items-center"><img src="" alt="marker" className="mr-1" />65, Karol Bagh</span>
            <div className="rating_class">
              <input className="rating" max="5" readOnly step="0.01" style={{ marginBottom: '24px', '--fill': '#faa603', '--value': 4 }} type="range" value="4" />
            </div>
          </div>
          <div className="right">
            <div className="type-wrap">
              <span className="price whitespace-nowrap text-lg font-semibold">₹ 15,000</span>
              <span className="type ml-2">Starting</span>
            </div>
          </div>
        </div>
        <div className="desc">
          <ul className="preference">
            <li><img width="25" src="icons/bed.png" alt="bed" className="mr-1" />Single Occupancy, Double Occupancy, Triple Occupancy, 3+ Occupancy</li>
            <li><img width="20" src="/image.png" alt="user" className="mr-1" />Co-Living</li>
            <li><img width="25" src="/image.png" alt="user" className="mr-1" />Student, Working Professional</li>
          </ul>
        </div>
        <a href="/" className="read-more bg-blue-500 text-white px-4 py-2 rounded mt-2 inline-block hover:bg-blue-600">I'm Interested</a>
      </div>
    </div>
  );
};

export default PropertyCard;
