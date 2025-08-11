import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { complainResolveByOwner, getAllComplain } from "../redux/slice/propertySlice";
import FeedbackComponent from "./FeedbackComponent";
import GetComplains from "./GetComplains";
import CorosalPropertyImage from "./CorosalPropertyImg";


function ShowBuilding() {
    const {state}=useLocation()
  
    const [st,setSt]=useState(state)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    console.log(st);


  
  return (
    <>
      <div>
        <nav className="h-[85px] border-b-2"></nav>
        <div className="flex justify-center items-center relative">
          <div className="text-center text-2xl w-[250px] border-2 rounded-md bg-blue-600 text-white px-4 py-2">
            Building Name
          </div>
          <div>
            <a
             onClick={()=>navigate("/adduser" ,{state:{st}}) }
              
              className="absolute top-2 right-20 bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Add Tenants
            </a>
          </div>
        </div>
        <div className="flex justify-center items-center">
        <img src={st.cards.property_photos[0].secure_url } className="m-5 rounded-md w-[50%]" alt="" />
        </div>
         {/* <CorosalPropertyImage state={st} /> */}
        <div className="property_data flex flex-col items-center w-full h-min p-6">
          <h1 className="text-center font-semibold tracking-tighter text-2xl mb-2 ">
            Property Data
          </h1>
          <div className="flex w-[100%] flex-wrap justify-center gap-2 text-base bg-slate-200 p-4 text-black rounded-lg">
            <h4 className="shadow-lg w-1/2 bg-white rounded-lg h-10 px-4 py-2">
              <span className="tracking-tight font-semibold mr-2">Property Name:</span> {st.cards.name}
            </h4>
            <h4 className="shadow-lg w-1/2 bg-white rounded-lg h-10 px-4 py-2">
            <span className="tracking-tight font-semibold mr-2">Property Category:</span> {st.cards.category}
            </h4>
            <h4 className="shadow-lg w-1/2 bg-white rounded-lg h-10 px-4 py-2">
            <span className="tracking-tight font-semibold mr-2">Facilities:</span> {st.cards.facilities}
            </h4>
            <div className="w-1/2 flex justify-between">
              <h4 className="shadow-lg w-1/4 bg-white rounded-lg h-10 px-4 py-2">
              <span className="tracking-tight font-semibold mr-2">Description:</span> 
                
              </h4>
              <p className="shadow-lg w-[520px] p-2 h-24 bg-white rounded-md">{st.cards.discription}</p>
            </div>
            <h4 className="shadow-lg w-1/2 bg-white rounded-lg flex gap-5 h-10 px-4 py-2">
            <span className="tracking-tight font-semibold ">Address:</span> {st.cards.address}
            </h4>
            <h4 className="shadow-lg w-1/2 bg-white rounded-lg flex gap-5 h-10 px-4 py-2">
            <span className="tracking-tight font-semibold">State:</span> {st.cards.state}
            <span className="tracking-tight font-semibold">City:</span> {st.cards.city}
            </h4>
            <div>
              <FeedbackComponent propertyId={st.cards._id} />
            </div>
          </div>
        </div>
        <GetComplains propertyId={st.cards._id} />
      </div>
    </>
  );
}

export default ShowBuilding;