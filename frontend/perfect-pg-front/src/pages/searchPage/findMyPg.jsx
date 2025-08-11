import React, { useEffect, useState } from 'react';

import PropertyCard from './propertySheet';
import FormComponent from './form';
import Navbar from '../HomePage/Navbar';
import { useDispatch } from 'react-redux';
import { showAllProperty } from '../../redux/slice/userSlice.js';
import App from './App.jsx';



const FindMyPG = () => {
    
    const dispatch=useDispatch()
    const [propertyInfo,setPropertyInfo]=useState([])
    
    async function load(){
        const response=await dispatch(showAllProperty())
        setPropertyInfo(response?.payload?.data)
        console.log(response);
    }
    const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeInOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
  };

  const [open, setOpen] = useState(null);

  const handleToggle = (index) => {
    setOpen(open === index ? null : index);
  };
    useEffect(()=>{
      load()
    },[])
    return (
        // <div className='about-page w-full'>
        //     <Navbar />
        //     <div className='about-page w-full bg-white text-black'>
        //         <div className="font-bold text-[30px] bg-cover bg-center flex items-center px-20 h-20 " style={{ backgroundImage: `url('/bg2.jpg')` }}>
        //             Property/PG list
        //         </div>

        //         <div className='flex  h-full'>
        //             <div className='flex h-full py-4 w-full'>
        //                 <div className='flex  justify-center space-around w-full'>
        //                     <div class="flex-1   p-2 m-2 w-1/2 ">
        //                     <FormComponent />
        //                     </div>
        //                     <div class="flex-1  p-2 m-2 full">
        //                     <PropertyCard info={propertyInfo}/>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>

        //     </div>
        // </div>

        <div className="main">
<Navbar />
            <div className="search">
            <FormComponent />
            </div>

            <div className="property_data">
            <PropertyCard info={propertyInfo}/>

            </div>
        </div>

    );
}

export default FindMyPG;