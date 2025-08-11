import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addFeedback } from '../redux/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReactStars from 'react-rating-stars-component';

const AddFeedback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    cleanliness: 0,
    waterSupply: 0,
    electrical: 0,
    safety: 0,
    internet: 0,
    maintenance: 0,
    security: 0,
    bookingProcess: 0
  });

  const handleRatingChange = (name, value) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feed = { feedback };
    const res = await dispatch(addFeedback(feed));
    if (res?.payload?.success) {
      setFeedback({
        cleanliness: 0,
        waterSupply: 0,
        electrical: 0,
        safety: 0,
        internet: 0,
        maintenance: 0,
        security: 0,
        bookingProcess: 0
      });
      navigate(-1);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className='w-1/2 flex justify-center items-center bg-blue-600 h-screen rounded-xl m-10'>
        <div className='text-5xl font-semibold text-white'>
          Feedback
        </div>
      </div>
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
        <h1 className='text-gray-500 font-semibold'>Please give a rating from 0-10</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Cleanliness', name: 'cleanliness' },
            { label: 'Water Supply', name: 'waterSupply' },
            { label: 'Electrical', name: 'electrical' },
            { label: 'Safety', name: 'safety' },
            { label: 'Internet', name: 'internet' },
            { label: 'Maintenance', name: 'maintenance' },
            { label: 'Security', name: 'security' },
          ].map(({ label, name }) => (
            <div key={name} className="form-control">
              <label htmlFor={name} className="label font-medium">{label}</label>
              <ReactStars
                count={10}
                onChange={(newRating) => handleRatingChange(name, newRating)}
                size={24}
                activeColor="#ffd700"
                value={feedback[name]}
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary w-full">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default AddFeedback;