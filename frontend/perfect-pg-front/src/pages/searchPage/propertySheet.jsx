import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { FaStar } from 'react-icons/fa';
import Modal from './Modal'; 
import { useDispatch } from 'react-redux';
import { sendEmailToOwner } from '../../redux/slice/userSlice';

const PropertyCard = ({info}) => {
  console.log(info);
  const dispatch=useDispatch()
  const renderStars = (rating) => {
    const totalStars = 5;
    return (
      <div className="flex">
        {[...Array(totalStars)].map((star, index) => (
          <FaStar
            key={index}
            className="w-5 h-5 text-yellow-500"
            fill={index < rating ? "yellow" : "none"}
          />
        ))}
      </div>
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const openModal = (property) => {
    setSelectedProperty(property.propertyId);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const handleFormSubmit =async (formData) => {
    formData.propertyId=selectedProperty
  console.log(formData);
  const response=await dispatch(sendEmailToOwner(formData))
  console.log(response);
  
  }
  return(
<div className='flex flex-wrap'>
  
   { info.map((property,idx)=>{
    console.log(property.name);
      return(
       <div key={idx}  className="max-w-md mx-auto  bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-200 text-gray-700 text-center py-2">
        <div className="text-lg font-semibold">Property name: {property.name}</div>
        <div className="text-sm">Property Category: {property.category}</div>
      </div>
      <div className="mb-4">
          <div className="text-gray-900 font-bold">Property photos:</div>
          <Carousel showThumbs={false} dynamicHeight>
            {property.property_photos.map(photo => (
              <div key={photo._id}>
                <img src={photo.secure_url} alt="Property" className="rounded-lg" />
              </div>
            ))}
          </Carousel>
        </div>
      <div className="p-4" onClick={() => openModal(property)}>
        <div className="mb-4">
          <div className="text-gray-900 font-bold">Owner: {property.ownerName}</div>
          <div className="text-gray-600">Phone: {property.ownerPhone}</div>
        </div>
        <div className="mb-4">
          <div className="text-gray-900 font-bold">Address:</div>
          <div className="text-gray-600">{property.address}</div>
          <div className="text-gray-600">{property.city}, {property.state} - {property.zipCode}</div>
        </div>
        <div className="mb-4">
          <div className="text-gray-900 font-bold">Description:</div>
          <div className="text-gray-600">{property.description}</div>
        </div>
        <div className="mb-4">
          <div className="text-gray-900 font-bold">Facilities:</div>
          <div className="text-gray-600">{property.facilities}</div>
        </div>
        <div className="mb-4">
          <div className="text-gray-900 font-bold">Rating:</div>
          {renderStars(property.rating)}
        </div>
        <div className="mb-4">
          <div className="text-gray-900 font-bold">Starting Amount:</div>
          <div className="text-gray-600">₹{property.startingAmount}</div>
        </div>
       
       
      </div>
    </div>
      )
    }) }
     <Modal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} />
    </div>
  )
};

export default PropertyCard;