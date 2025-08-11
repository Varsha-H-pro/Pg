import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAccount } from "../redux/slice/authSlice";
import { logoutAccountUser } from "../redux/slice/userSlice";

const user = {
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "ADMIN",
  };
const Nav=()=>{
    const [isOpen, setIsOpen] = useState(false);
    const role1=useSelector((store)=>store.auth.role)
    const role2=useSelector((store)=>store.user.role)
    const navigate=useNavigate()
    console.log(role1);
    console.log(role2);
    const dispatch=useDispatch()
    const handleLogout =async () => {
      // Add your logout logic here
      if(role1!=undefined && role1=="owner"){
        const response=await dispatch(logoutAccount())
        console.log(response?.payload);
        if(response?.payload?.sucess){
            navigate("/homepage")
        }
       }
       else if(role2!=undefined && role2=="user"){
        const response=await dispatch(logoutAccountUser())
        console.log(response);
        if(response?.payload?.sucess){
            navigate("/homepage")
        }
       }
      setIsOpen(false);
    };
 
    async function handelDashboardButton(){
      if(role1=="owner"){
        navigate("/admindashboard")
      }
      else if(role2=="user"){
        navigate("/studentdashboard")
      }
    }
    return(
        <nav className="py-4 px-10 flex items-center gap-28">
            <div className="flex gap-16 text-xl font-bold tracking-tighter">
              <a className="text-blue-600 w-32" href="">PG PERFECT</a>
              <button onClick={()=>handelDashboardButton()} className="text-center rounded-lg text-sm font-semibold px-4 py-2 bg-blue-600 text-white">
                Dashboard
              </button>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="ml-auto relative">
                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center focus:outline-none">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <svg className="h-6 w-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      onClick={handleLogout}
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </nav>
    )
}
export default Nav