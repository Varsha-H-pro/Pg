import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { complainResolveByOwner, getAllComplain } from "../redux/slice/propertySlice";

const GetComplains=({propertyId})=>{
    const [complaintData,setComplaintData]=useState([])
    const dispatch=useDispatch()
    async function fetchComplaint(){
        const response=await dispatch(getAllComplain(propertyId))
        console.log(response);
        setComplaintData(response?.payload?.data)
    }
    async function handelresolve(complainId){
       const res= await dispatch(complainResolveByOwner(complainId))
       console.log(res);
       if(res?.payload?.sucess){
        fetchComplaint()
       }
    }
    useEffect(()=>{
        fetchComplaint()
    },[])
    const tdStyle = {
        borderBottom: "2px",
        borderColor: "#e2e8f0",
        padding: "2px",
        fontSize: "0.875rem",
      };
    return(
<div className="tenants_data p-6">
          <div class="header_fixed max-h-screen w-full overflow-auto border border-gray-300">
            <h1 className="text-center font-semibold tracking-tighter text-2xl mb-2">
              Complaints Data
            </h1>
            <table className="w-full border-collapse">
              <thead>
             
                <tr>
                  <th className="sticky top-0 bg-blue-600 text-gray-200 text-md p-2 pr-[35%] border-b border-gray-300">
                    S No.
                  </th>
                  <th className="sticky top-0 bg-blue-600 text-gray-200 text-md p-2 pr-[35%] border-b border-gray-300">
                  Title
                  </th>
                  <th className="sticky top-0 bg-blue-600 text-gray-200 text-md p-2 pr-[35%] border-b border-gray-300">
                  type
                  </th>
                  <th className="sticky top-0 bg-blue-600 text-gray-200 text-md p-2 pr-[35%] border-b border-gray-300">
                  Description
                  </th>
                  <th className="sticky top-0 bg-blue-600 text-gray-200 text-md p-2 pr-[35%] border-b border-gray-300">
                    Room No.
                  </th>
                  <th className="sticky top-0 bg-blue-600 text-gray-200 text-md p-2 pr-[35%] border-b border-gray-300">
                    {" "}
                    Complaint
                  </th>
                </tr>
              </thead>
              <tbody>
              {complaintData.length!=0 && complaintData.map((ele,idx)=>{
                return(
                <tr>
                  <td className="hover:bg-white border-b border-gray-300 p-2 text-sm">
                    {idx+1}
                  </td>
                  <td className="hover:bg-white border-b border-gray-300 p-2 text-sm">
                    {ele?.title}
                  </td>
                  <td className="hover:bg-white border-b border-gray-300 p-2 text-sm">
                    {ele.type}
                  </td>
                  <td className="hover:bg-white border-b border-gray-300 p-2 text-sm">
                    {ele.description}
                  </td>
                  <td className="hover:bg-white border-b border-gray-300 p-2 text-sm">
                    {ele.guest.room.roomNo}
                  </td>
                  <td className="hover:bg-white border-b border-gray-300 p-2 text-sm">
                    <button
                      className="border-none px-5 py-2 rounded-full bg-blue-600 text-gray-200"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      View Complaint
                    </button>
                    <button onClick={()=>handelresolve(ele._id)} className="ml-2 border-none px-5 py-2 rounded-full bg-blue-600 text-gray-200">
                      
                      Resolve
                    </button>
                    <dialog id="my_modal_1" className="modal">
                      <div className="w-[700px] h-[350px] modal-box px-4 py-3">
                        <h1 className="underline text-center font-bold text-2xl tracking-tighter mb-4">
                          Complaint!
                        </h1>
                        <h4 className="complaints text-xl font-semibold mb-4">{ele.title}</h4>
                        <p className="complaint_details text-base font-regular mb-4">
                          {ele.description}
                        </p>
                        <div className="images flex mb-4 gap-6">
                            {ele.photos.map((img)=>{
                                return(
                           <img className="w-[200px] h-[150px] rounded-lg object-center" src={img.secure_url} alt="" />
                                )
                            })}
                            
                        </div>
                        <div className="modal-action">
                          <form method="dialog">
                            <button className="btn bg-blue-600 px-4 py-2 text-white rounded-md">
                              Close
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </td>
                </tr>
                )
             })}
                
              </tbody>
            </table>
          </div>
        </div>
    )
}
export default GetComplains