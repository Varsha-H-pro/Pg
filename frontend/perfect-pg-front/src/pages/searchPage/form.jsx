import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { calculateRating, searchPg } from '../../redux/slice/userSlice';
import axiosInstance from '../../helper/axiosInstance';
import { calcLength } from 'framer-motion';
import PropertyCard from './propertySheet';
import toast from 'react-hot-toast';


const FormComponent = () => {
  const dispatch=useDispatch()
  

  const [formData,setFormData]=useState({
    city:"",
    state:"",
    category:""
  })
  const [propertyData,setPropertyData]=useState([])
  const [printResult,setPrintResult]=useState("")
  const handleFormData = (e) => {
    
        const {name,value}=e.target 
        setFormData({
    
            ...formData,
        
            [name]:value
    })
  };


   const handleSubmit =async (e) => {
    e.preventDefault();
     

    const response=await dispatch(searchPg(formData))
    console.log(response);
    if(response?.payload?.data.length==0){
      toast.error("No result found")
   setPrintResult("No result found")
    }
    response?.payload?.data.sort((a, b) => b.rating - a.rating);
    // console.log(response);
     setPropertyData(response?.payload?.data)
    
   
  };
  console.log(propertyData);

  return (
    <div className='m-6'>
    <form onSubmit={handleSubmit} className="w-full flex gap-40 bg-slate-200 p-8 rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City:
        </label>
        <select
          id="city"
          value={formData.city}
          name="city"
          onChange={handleFormData}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select City</option>
          <option value="HOOGHLY">HOOGHLY</option>
          <option value="Bengaluru">Bengaluru</option>
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
          name="category"
          value={formData.category}
          onChange={handleFormData}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Category</option>
          <option value="Boy">Boy</option>
          <option value="Girl">Girl</option>
          <option value="Co">Co</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State:
        </label>
        <select
          id="state"
          value={formData.state}
          name="state"
          onChange={handleFormData}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select property For</option>
          <option value="KA">KA</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Other">Happy Pg-Co</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <button
        type="submit"
        onClick={()=>handleSubmit()}
        className=" bg-indigo-600 hover:bg-indigo-700 text-white w-40 font-bold   px-6 rounded-xl focus:outline-none focus:shadow-outline shadow-md shadow-blue-400"
      >
        Submit
      </button>
    </form>
   { propertyData.length!=0? <PropertyCard info={propertyData} />:<div className='m-2 mx-[50%]  text-center py-2 font-semibold w-36 h-10 rounded-lg'>{printResult}</div>}

    </div>
  );
};

export default FormComponent;