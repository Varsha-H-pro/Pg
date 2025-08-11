import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SignupPage from './pages/signupPage.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { Toaster } from 'react-hot-toast'
import LogInpage from './pages/loginPage.jsx'
import TenantForm from './pages/AddUsers.jsx'
import AddBuilding from './pages/AddBuilding.jsx'
import ListBuilding from './pages/ListBuilding.jsx'
import ShowBuilding from './pages/ShowBuilding.jsx'
import UserLogInpage from './pages/LogInUser.jsx'
import UpdateUserLogin from './pages/updateUserLogin.jsx'
import ContactUs from './pages/ContactUsPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import HomePage from './pages/HomePage.jsx'
import About from './pages/AboutUsPage.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import AddFeedback from './pages/AddFeedback.jsx'
import FindMyPG from './pages/searchPage/findMyPg.jsx'

const appRouter=createBrowserRouter([
  {
    path:"/homepage",
    element:
    <HomePage />
   },
   {
    path:"/aboutuspage",
    element:<About />
   },
   {
    path:"/contactus",
    element:
    <Provider store={store} >
    <ContactUs />
    <Toaster />
    </Provider>
   },
   {
    path:"/findpg",
    element:
    <Provider store={store} >
    <FindMyPG />
    <Toaster />
    </Provider>
   },
   {
    path:"/signup",
    element:
    <Provider store={store} >
    <SignupPage />
    <Toaster />
    </Provider>
   },
   {
    path:"/userlogin",
    element:
    <Provider store={store} >
    <UserLogInpage />
    <Toaster />
    </Provider>
   },
   {
    path:"/login",
    element:
    <Provider store={store} >
    <LogInpage />
    <Toaster />
    </Provider>
   },
     {
      
      path:"/",
      element:
      <Provider store={store} >
      <>
      <App />
      <Toaster />
      </>
      </Provider>,
      children:[
        
     {
      path:"/adduser",
      element:<TenantForm />
     },
     {
      path:"/addbuilding",
      element:<AddBuilding />
     },
     {
      path:"/listbuilding",
      element:<ListBuilding />
     },
     {
      path:"/showbuilding",
      element:<ShowBuilding />
     },
     
     {
      path:"/updateuserlogin",
      element:<UpdateUserLogin />
     },
     
     {
      path:"/admindashboard",
      element:<AdminDashboard />
     },
     
    
     {
      path:"/studentdashboard",
      element:<StudentDashboard />
     },
     {
      path:"/addfeedback",
      element:<AddFeedback />
     },
    
    ]
     }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={appRouter} />
)
