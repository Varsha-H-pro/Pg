import { useDispatch, useSelector } from "react-redux"
import pay1 from "../pages/HomePage/images/pay1.png"
import { buySubscription, getRazorpayId, varifySubscribtion } from "../redux/slice/paymentSlice"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { addComplain } from "../redux/slice/userSlice"
import axiosInstance from "../helper/axiosInstance"
import { checkDepositStatus, checkPaymentStatus, createDeposit, createSubscription } from "../redux/slice/ownerSlice.js"

const StudentDashboard=()=>{
    const userData=useSelector((store)=>store.user.data)
    const dispatch=useDispatch()
    const navigate=useNavigate()


    const [hasPaidThisMonth, setHasPaidThisMonth] = useState(true);
    const [amount, setAmount] = useState(userData.subscription.amount);
    const [deposit,setDeposit]=useState(userData.deposit.amount)
    
    async function load(){
     
      try {
        const data={userId:userData._id}
        const response=await dispatch(checkPaymentStatus(userData._id))
        setHasPaidThisMonth(response?.payload?.hasPaidThisMonth);
      } catch (error) {
        console.error('Error checking payment status', error);
      }
    };
    useEffect(()=>{
        load()
    },[])

    // console.log(key);
    async function handelSubscribe(e){
   
        console.log(hasPaidThisMonth);
        if(hasPaidThisMonth){
          alert("Rent already payed for this month!")
        }
        else{
          console.log(userData._id);
          const sendData={userId:userData._id,amount:amount}
          const responseSub=await dispatch(createSubscription(sendData))
          console.log(responseSub);
          if(responseSub?.payload?.sucess){
          const options = {
            key: 'rzp_test_uNroaW9UQ2EFbd',
            amount: amount * 100,
            currency: 'INR',
            name: 'Payment System',
            description: 'Test Transaction',
            order_id: responseSub?.payload?.data,
            handler: async (response) => {
              alert('Payment successful');
            },
            prefill: {
              name:userData.name,
              email:userData.email
            },
            theme: {
              color: '#3399cc'
            }
          };
          const razorpay = new window.Razorpay(options);
          razorpay.open();
          load()
        }
        }
    }

    async function handelDeposit(e){

      const depositStatus=await dispatch(checkDepositStatus(userData._id))
      console.log(depositStatus);
      if(depositStatus?.payload?.depositStatus==true){
        alert("Deposit already payed!")
      }
      else{
        console.log(userData._id);
        const sendData={userId:userData._id,amount:deposit}

        const response=await dispatch(createDeposit(sendData))
        console.log(response);
        if(response?.payload?.sucess){
        const options = {
          key: 'rzp_test_uNroaW9UQ2EFbd',
          amount: amount * 100,
          currency: 'INR',
          name: 'Payment System',
          description: 'Test Transaction',
          order_id: response?.payload?.data,
          handler: async (response) => {
            alert('Payment successful');
          },
          prefill: {
            name:userData.name,
            email:userData.email
          },
          theme: {
            color: '#3399cc'
          }
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
      }
  }


    const [complainData,setComplainData]=useState({
        type:"",
        title:"",
        description:"",
        photos:[]
    })
    const [selectedImages, setSelectedImages] = useState([]);

    const handleImageChange = (e) => {
        console.log(e.target.files);
      if (e.target.files) {
        const filesArray = Array.from(e.target.files);
        
        setSelectedImages((prevImages) => prevImages.concat(filesArray));
      }
    };
    function handelComplainData(e){
        const {name,value}=e.target 
        setComplainData({
            
            ...complainData,
            
            [name]:value,
        })
    }
    async function onSubmit(e){
        e.preventDefault()
      
        if(!complainData.type || !complainData.title  || !complainData.description){
            toast.error("Please fill all the details")
            return
        }
       
        const formData=new FormData()
       formData.append("type",complainData.type)
       formData.append("title",complainData.title)
       formData.append("description",complainData.description)
      
      selectedImages.forEach((image) => {
        formData.append('photos', image);
      });

      const response=await dispatch(addComplain(formData))
      console.log(response?.payload);
      if(response?.payload?.sucess){
        setComplainData({
            type:"",
            title:"",
            description:"",
            photos:[]
        })
        setSelectedImages([])
      }
    }
    return(
        <div className="w-[100%] h-[100%]">
        <div className="w-[100%] h-[25%]">
          <nav className="h-[0px] border-b-2"></nav>

          <header className="bg-slate-200 shadow">
            <div className="w-full py-4 px-10 flex justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Welcome, {userData.name}!
              </h1>
              <Link to={"/addfeedback"}><button className="text-center rounded-lg text-sm font-semibold px-4 py-2 bg-blue-600 text-white">Add Feedback</button></Link>
            </div>
          </header>
        </div>
        <main className="flex  items-center gap-6 w-[100%] h-[590px] px-10 py-6">
          <div className=" bg-slate-200 flex flex-col justify-center items-center w-[25%]] h-[100%] border-2 rounded-lg shadow-lg px-4 py-6">
            <h1 className="font-semibold mb-4 text-blue-600">
              Having an issue? No problem we will fix it !{" "}
            </h1>

            <div className="flex flex-col justify-center w-[80%]">
                <form onSubmit={onSubmit} >
               <div className="mb-5 flex flex-col">
      <label htmlFor="type" className="block font-medium">
        Type of Complaint *
      </label>
      <div className="flex flex-col space-y-2">
        {['cleaning', 'food', 'maintenance', 'noise', 'other'].map((type) => (
          <label key={type} className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value={type}
              onChange={handelComplainData}
              required={true}
              checked={complainData.type === type}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </label>
        ))}
      </div>
    </div>
              <div className="mb-5 flex flex-col ">
                <label for="name" className=" block font-medium">
                  Title: *
                </label>
                <input
                  type="text"
                  name="title"
                  id="name"
                  onChange={handelComplainData}
                  required={true} 
                  value={complainData.title}
                  placeholder="Type of complaint"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-black outline-none focus:border-blue-600 focus:shadow-md"
                />
              </div>
              <div className="mb-5 flex flex-col ">
                <label for="name" className=" block font-medium">
                  Description: *
                </label>
                <input
                  type="text"
                  name="description"
                  id="name"
                  onChange={handelComplainData}
                  required={true} 
                  value={complainData.description}
                  placeholder="Description"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-black outline-none focus:border-blue-600 focus:shadow-md"
                />
              </div>
              <div className="mb-5 flex flex-col">
                <label for="property_photos" className=" block font-medium">
                  Photos
                </label>
                <input
                  type="file"
                  name="photos"
                  onChange={handleImageChange}
                  id="property_photos"
                  multiple
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-black outline-none focus:border-blue-600 focus:shadow-md"
                />
              </div>
              <button type="submit" className="text-center mr-16 rounded-2xl bg-blue-600 text-white px-6 py-3 font-semibold uppercase transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-lg hover:shadow-lg hover:shadow-slate-600 active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none w-[350px]">
              Lodge a complaint
            </button>
              </form>
            </div>
            
          </div>
            
          <div className="flex gap-8 w-[75%] h-[100%] border-[2px] rounded-lg shadow-lg px-4 py-6">
            <div className="w-1/2 flex flex-col justify-center rounded-lg bg-slate-200">
              <h1 className="p-4 text-2xl text-center tracking-tighter text-white bg-blue-600 rounded-lg">
                Rent
              </h1>
              <div className="w-full h-[180px] overflow-hidden">
                <img
                  className="w-full h-full object-center"
                  src={pay1}
                  alt=""
                />
              </div>
              <p className="p-4 text-base font-regular">
              Notice: Kindly remit your PG rent by first week of every month to ensure continuity of services. Thank you for your prompt cooperation.
              </p>
              <h2 className="p-4 text-center text"></h2>
              <h4 className="p-4 text-center font-light text-sm">
                * Terms and conditions applied *
              </h4>
              <button onClick={()=>handelSubscribe()} className="w-full bg-blue-600 rounded-md text-white p-4 text-lg">
                Pay Now
              </button>
            </div>
            <div className="w-1/2 flex flex-col justify-center rounded-lg bg-slate-200">
            <h1  className="p-4 text-2xl text-center tracking-tighter text-white bg-blue-600 rounded-lg">
                Deposit
              </h1>
              <div className="w-full h-[180px] overflow-hidden">
                <img
                  className="w-full h-full object-center"
                  src={pay1}
                  alt=""
                />
              </div>
              <p className="p-4 text-base font-regular">
              Notice: Kindly submit your deposit for the PG accommodation to secure your room. Thank you for your cooperation.







              </p>
              <h2 className="p-4 text-center text"></h2>
              <h4 className="p-4 text-center font-light text-sm">
                * Terms and conditions applied *
              </h4>
              <button onClick={()=>handelDeposit()} className="w-full bg-blue-600 rounded-md text-white p-4 text-lg">
                Pay Now
              </button></div>
          </div>
        </main>
      </div>
    )
}
export default StudentDashboard