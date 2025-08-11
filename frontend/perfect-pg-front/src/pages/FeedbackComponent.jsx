import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { getAllFeedback } from '../redux/slice/ownerSlice';

const FeedbackComponent = ({propertyId}) => {
  const [averages, setAverages] = useState(null);
  const dispatch=useDispatch()
  useEffect(() => {
    const fetchFeedbackAverages = async () => {
      try {
        console.log(propertyId);
        const response = await dispatch(getAllFeedback(propertyId))
        console.log(response);
        setAverages(response.payload.data);
      } catch (error) {
        console.error('Error fetching feedback averages:', error);
      }
    };

    fetchFeedbackAverages();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <FaStar key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'} />
      );
    }
    return stars;
  };

  if (!averages) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Feedback Averages</h2>
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        {Object.entries(averages).map(([category, average]) => (
          <div key={category} className="mb-4">
            <h3 className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1')}</h3>
            <div className="flex">{renderStars(average)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackComponent;
