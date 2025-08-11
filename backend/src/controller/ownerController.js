import AppError from "../helper/errorHandler.js"
import owner from "../model/ownerSchema.js"
import cloudinary from "cloudinary"
import property from "../model/propertySchema.js"
import fs from "fs/promises"
import guest from "../model/guestSchema.js"
import crypto from "crypto"
// import CryptoJS from "crypto-js"
import nodemailer from "nodemailer"
import complaint from "../model/complainSchema.js"

import { instance } from "../../server.js"
import feedback from "../model/feedbackSchema.js";

const signUp=async (req,res,next)=>{
    const {name,email,password,phone}=req.body
    if(!name || !email || !password || !phone){
        return next(new AppError("All fildes are requires",404))
    }
    const findEmail=await owner.findOne({email})
    if(findEmail && findEmail.email==email){
        return next(new AppError("USer already exist with same email",404))
    }
    try{
        const ownerCreate=await owner.create({
            name,
            email,
            password,
            phone,
            role:"owner"
        })
        if(!ownerCreate){
            return next(new AppError("User registration failed",404))
        }
         owner.password=undefined 
         const cookieOption={
            maxAge:7*24*60*60*1000, //7days in expiry data
            httpOnly:true,
            secure:true
        }
         const ownerToken=await ownerCreate.jwtToken()
         res.cookie("ownerToken",ownerToken,cookieOption)

         return res.status(200).json({
            sucess:true,
            message:"Owner signup Sucessful",
            data:ownerCreate
        })
    }
    catch(err){
    console.log("ERROR in Signup",err);
    return next(new AppError(err.message,500))
    }
}
const logIn=async (req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password){
        return next(new AppError("All fildes are requires",404))
    }
    try{
        const ownerFind=await owner.findOne({email}).select("+password")
        if(!ownerFind || ownerFind.password!=password){
            return next(new AppError("Invalid credentials",404))
        }
        ownerFind.role="owner"
        await ownerFind.save()
        ownerFind.password=undefined
        
        const cookieOption={
            maxAge:7*24*60*60*1000, //7days in expiry data
            httpOnly:true,
            secure:true
        }
        const ownerToken=await ownerFind.jwtToken()
    
        res.cookie("ownerToken",ownerToken,cookieOption)

        return res.status(200).json({
            sucess:true,
            message:"Login sucessfully",
            data:ownerFind
        })
    }
    catch(err){
        console.log("ERROR in Login",err);
        return next(new AppError(err.message,500))
        }
}

const logOut=async (req,res,next)=>{
    try{
    res.cookie("ownerToken","null",{
        secure:true,
        maxAge:0,
        httpOnly:true
    })
    return res.status(200).json({
        sucess:true,
        message:"Log out sucessful"
    })
  }
  catch(err){
    console.log("ERROR in log out");
    return next(new AppError(err.message,500))
  }
  }
const getOwnerDetails=async (req,res,next)=>{
    try{
 const ownerId=req.owner.id
 const ownerFind=await owner.findById(ownerId)
 if(!ownerFind){
    return next(new AppError("Failed to fetch owner information",404))
}
return res.status(200).json({
    sucess:true,
    message:"Owner details found successfully",
    data:ownerFind
})
    }
    catch(err){
        console.log("ERROR is finding the owner details",err);
        return next(new AppError(err.message,500))
    }
}
const createProperty=async (req,res,next)=>{
    const ownerId=req.owner.id
    const {name,discription,category,address,city,state,zipCode,facilities,startingAmount}=req.body
    console.log(name);
    if(!name || !address || !city || !state || !zipCode || !category || !startingAmount){
        return next(new AppError("All fildes are requires",404))
    }
    let propertyPhotoResult;
    try{
    if(req.files){
        const files = req.files;
        console.log(files);
        let uploadPromises = files.map(async (file) => {
          return await cloudinary.v2.uploader.upload(file.path, {
            folder: 'uploads'
          });
        });
        let uploadResults = await Promise.all(uploadPromises);
         propertyPhotoResult=uploadResults.map((ele)=>{
            return {
            public_id: ele.public_id,
            secure_url: ele.secure_url
        }})
        // fs.rm(`uploads/${req.file.filename}`)
        req.files.map((file)=> fs.rm(`uploads/${file.filename}`))
        console.log(propertyPhotoResult);
    }
    const newProperty = new property({ owner: ownerId, name,discription, category, address, city, state, zipCode, facilities, property_photos: propertyPhotoResult,startingAmount });
    const savedProperty = await newProperty.save();
    await owner.findByIdAndUpdate(ownerId, { $push: { properties: savedProperty._id } });
    return res.status(200).json({
        sucess:true,
        message:"New property added successfully",
        data:savedProperty
    })
}
catch(err){
    console.log("ERROR is adding new property",err);
    return next(new AppError(err.message,500))
}
}

const updateProperty=async (req,res,next)=>{
    const propertyId=req.params.propertyId;
    if(!propertyId){
                 return next(new AppError("Can not fetch propertyId",404))
             }
    try{
           const propertyInfo=await property.findByIdAndUpdate(propertyId,
            {
                $set:req.body
            },
            {
                runValidators:true    //Validates your req.body info from your Schema
            })
           if(!propertyInfo){
            return next(new AppError("No such property exist",404))
           }
           
           if(req.files){
            let files=req.files
            propertyInfo.property_photos.map((file)=>cloudinary.v2.uploader.destroy(file.public_id))

            let uploadPromises = files.map(async (file) => {
                return await cloudinary.v2.uploader.upload(file.path, {
                  folder: 'uploads'
                });
              });
              let uploadResults = await Promise.all(uploadPromises);
              let propertyPhotoResult=uploadResults.map((ele)=>{
                  return {
                  public_id: ele.public_id,
                  secure_url: ele.secure_url
              }})

              req.files.map((file)=> fs.rm(`uploads/${file.filename}`))
              console.log(propertyPhotoResult);
              await property.findByIdAndUpdate(propertyId,{property_photos: propertyPhotoResult})
          }
          return res.status(200).json({
            sucess:true,
            message:"Property information update sucessfull",
            data:propertyInfo
           })
        }
        catch(err){
            console.log("ERROR in updating property information",err);
            return next(new AppError(err.message,500))
        }
}
const deleteProperty=async (req,res,next)=>{
    const propertyId=req.params.propertyId;
    const ownerId=req.owner.id
    try {
        await property.findByIdAndDelete(propertyId);
        await owner.findByIdAndUpdate(ownerId, { $pull: { properties: propertyId } });
        return res.status(200).json({
            sucess:true,
            message:"Property deleted sucessfully"
        });
      } 
      catch(err){
        console.log("ERROR in deleting property",err);
        return next(new AppError(err.message,500))
    }
}
const getPropertyById=async (req,res,next)=>{
    const { propertyId } = req.params;
    try{
        // const propertyInfo = await property.findById(propertyId).populate('ratings feedbacks rooms');
        const propertyInfo = await property.findById(propertyId)
        if(!propertyInfo){
            return next(new AppError("Failed to find property",404))
        } 
        res.status(200).json({
            sucess:true,
            message:"Property fetched sucessfully",
            data:propertyInfo
        });
    }
    catch(err){
        console.log("ERROR in finding property",err);
        return next(new AppError(err.message,500))
    }
}
const getAllProperty=async (req,res,next)=>{
    const ownerId=req.owner.id
    try {
        // const properties = await property.find({ owner: req.ownerId }).populate('ratings feedbacks rooms');
        const properties = await property.find({ owner: ownerId })
        res.status(200).json({
            sucess:true,
            message:"Property fetched sucessfully",
            data:properties
        });
      }     
      catch(err){
        console.log("ERROR in finding property",err);
        return next(new AppError(err.message,500))
    }
    };


      const addGuest=async (req,res,next)=>{
        const {name,phone,email,roomType,roomNo,amount,propertyId,deposit}=req.body
        console.log(propertyId);
        if(!name || !phone || !email || !roomType || !roomNo || !propertyId){
            return next(new AppError("All fildes are required",404))
        } 
        try{
            const room={roomShearing:roomType,roomNo:roomNo}
             const guestInfo=await guest.create({
                propertyId,
                name,
                email,
                phone,
                room,
             })

             const hash = crypto.createHash('sha256');
             hash.update(email);
             const uniqueId = hash.digest('hex');
             guestInfo.loginId=email
             guestInfo.loginPassword=uniqueId
             guestInfo.subscription.amount=amount
             guestInfo.deposit.amount=deposit
             guestInfo.save()
 

             const roomSchema={roomNo:roomNo,guestId:guestInfo._id}
             const propertyInfo=await property.findById(propertyId)
             console.log(propertyInfo);
             propertyInfo.rooms[roomType].push(roomSchema)
             console.log(propertyInfo.rooms[roomType]); 
             await propertyInfo.save()
             
             return res.status(200).json({
                sucess:true,
                message:"Guest add to database sucessfully",
                data:guestInfo
             })
        }
        catch(err){
            console.log("ERROR adding guest",err);
            return next(new AppError(err.message,500))
        }
      }

      const sendLoginIdToGuest=async (req,res,next)=>{
        const ownerId=req.owner.id
        const guestId=req.params.guestId

        try{
            const guestInfo=await guest.findById(guestId)
            const ownerInfo=await owner.findById(ownerId)
            const transporter = nodemailer.createTransport({
                service:"gmail",
                port: 465,
                secure:true,
                auth: {
                   user:process.env.GMAIL_APP_ID,
                   pass:process.env.GMAIL_APP_PASSWORD
                }
            });
            const info = await transporter.sendMail({
                from: ownerInfo.email , // sender address
                to: guestInfo.email, // list of receivers
                subject: "Login detailes", // Subject line
                text: "Please login and subscribe to access the user dashboard", // plain text body
                html: `Login using id <b>${guestInfo.loginId}</b> and password <b>${guestInfo.loginPassword}</b> to login and subscribe to pay rent of ${guestInfo.subscription.amount} monthly for 1 year by clicking on this link --> ${guestInfo.subscription.link} or subscribe through dashboard </br>`, // html body
            });
            return res.status(200).json({
                sucess:true,
                message:"Message send sucessfully",
             })
        }
        catch(err){
            console.log("ERROR in sending the message",err);
            return next(new AppError(err.message,500))
        }
      }

      const getAllComplains=async (req,res,next)=>{
        const { propertyId } = req.params;
        console.log(propertyId);
        try{
            const complaints = await complaint.find({ property: propertyId })
            .populate('guest')
            .populate('property')
            .maxTimeMS(30000); // Increase timeout  

            console.log(complaints);
            const complaintData=complaints.filter((ele)=>ele.status=="Pending")
            return res.status(200).json({
                sucess:true, 
                message:"Fetched all complaint sucessfully",
                data:complaintData
             })
        }
        catch(err){
            console.log("ERROR in fetching complaints",err);
            return next(new AppError(err.message,500))
        }
      }

      const getComplainById=async (req,res,next)=>{
        const complainId=req.params.complainId
        try{
            const complaintInfo = await complaint.findById(complainId)
            .populate('guest')
            .populate('property')
             
            return res.status(200).json({
                sucess:true,
                message:"Fetched complaint sucessfully",
                data:complaintInfo
             })
        }
        catch(err){
            console.log("ERROR in fetching complaints",err);
            return next(new AppError(err.message,500))
        }
      }

      const resolveComplainByOwner=async (req,res,next)=>{
        const { complainId} = req.params;
        const ownerEmail=req.owner.email
        try{
            const complainInfo=await complaint.findById(complainId)
            console.log(complainInfo);
            const updatedGuest = await guest.findByIdAndUpdate(
                complainInfo.guest._id,
                { $pull: { complaints: complainId } },
                { new: true }   
              );
            const updatedComplaint = await complaint.findByIdAndUpdate(
                complainId,
                {resolvedByOwner:true ,status:"Resolved",resolvedAt:new Date()},
                { new: true }
              );

              const transporter = nodemailer.createTransport({
                service:"gmail",
                port: 465,
                secure:true,
                auth: {
                   user:process.env.GMAIL_APP_ID,
                   pass:process.env.GMAIL_APP_PASSWORD
                }
            });
            const info = await transporter.sendMail({
                from: ownerEmail , // sender address
                to: updatedGuest.email, // list of receivers
                subject: "Complain resolved", // Subject line
                text: "Please cheack if your problem is resolved or not.", // plain text body
                // html: ``, // html body
            });

              return res.status(200).json({
                sucess:true,
                message:"Complaint resolved by owner sucessfully",
                data:updatedComplaint
             })
        }
         catch(err){
            console.log("ERROR in resolving complaint",err);
            return next(new AppError(err.message,500))
        }
      }
    //   const complainResolve=async (req,res,next)=>{
    //     const { complaintId } = req.params;
    //     try{
    //     const complainInfo=await complaint.findById(complaintId) 
    //     if(complainInfo.resolvedByOwner && complainInfo.approvedByGuest){
    //         complainInfo.status="Resolved"
    //         complainInfo.resolvedAt=new Date()
    //         return res.status(200).json({
    //             sucess:true,
    //             message:"Complaint resolved sucessfully",
    //          })
    //     }
    //     else{
    //         return res.status(404).json({
    //             sucess:flase,
    //             message:"complain not resolved by owner or not approved by guest",
    //          })
    //     }
    //     }
    //     catch(err){
    //         console.log("ERROR in resolving complaint",err);
    //         return next(new AppError(err.message,500))
    //     }
    //   }
   
    

   const createSubscription = async (req, res,next) => {
    const {userId,amount}=req.body

    try{
        const userInfo=await guest.findById(userId)
        
        const planOptions = {
          period: 'monthly',
          interval: 1,
          item: {
            name: 'Monthly Rent',
            amount: amount * 100, // amount in paise
            currency: 'INR',
          },
        };
      
        const plan = await instance.plans.create(planOptions);
        // console.log(plan);
        const subscriptionOptions = {
          plan_id: plan.id,
          customer_notify: 1,
          total_count: 12, // Example: 12 months
        };
      
        const subscription = await instance.subscriptions.create(subscriptionOptions);
        console.log(subscription);
        userInfo.subscription.id=subscription.id
        userInfo.subscription.status=subscription.status
        userInfo.subscription.link=subscription.short_url
        userInfo.subscription.amount=amount
        await userInfo.save()
        
        return res.status(200).json({ 
            sucess:true,
            message:"User subscribed sucessfully",
            data:subscription
        })
      }
      catch(err){
        return next(new AppError("Failed to subscribe",500))
      }
    } 

    const varifySubscribtion=async (req,res,next)=>{
        const userId=req.guest.id
    
        const {razorpay_payment_id , razorpay_signature ,  razorpay_subscription_id }=req.body
        try{ 
            const user=await guest.findById(userId)
            if(!user){
                return next(new AppError("User does not exist please login",404))
            }
   
    const generatedSignature =await crypto
    .createHmac("sha256",process.env.RAZORPAY_SECRET_KEY)
    .update(razorpay_payment_id + "|" + razorpay_subscription_id)
    .digest("hex"); 
           
    
            if(generatedSignature!=razorpay_signature){
                return next(new AppError("Payment not varified please try again",404))
            }
    
            user.subscription.status="active"
            await user.save()
    
            return res.status(200).json({
                sucess:true,
                message:"Subscription varified"
            })
    
    }
    catch(err){
        return next(new AppError(err.message,500))
    
    }
}
    const getPaymentApiKey1=async (req,res,next)=>{
        try{  
            return res.status(200).json({
                sucess:true,
                message:"Payment Api Key",
                data:process.env.RAZORPAY_KEY_ID
            })
        }
        catch(err){
            return next(new AppError(err.message || "Failed to get payment api key",500))
        }
    }
    
    const getAllSubscription=async (req,res,next)=>{
        const userId=req.owner.id
        const count=req.query //In postman we will get params there we have to provide the count info
        try{
            const user=await owner.findById(userId)
            if(!user){
                return next(new AppError("User does not exist please login",404))
            }
            // if(req.user.role==="USER"){
            //     return next(new AppError("Usew can not get subscription detailes",404))
            // }
            const subscriptionDetails=await instance.subscriptions.all({count:count || 10})
            const monthNumber=[
                "January",
                "February",
               "March",
                "April",
                "May",
                "June",
                'July',
                "August",
                "September",
                "October",
                'November',
                "December"
            ]
            const finalMonths={
            January:0,
            February:0,
            March:0,
            April:0,
            May:0,
            June:0,
            July:0,
            August:0,
            September:0,
            October:0,
            November:0,
            December:0
            }
            let months=[]
            let i=0;
            const dateSeconds=subscriptionDetails.items.forEach((ele)=>{
                const date=new Date(ele.start_at * 1000)
                months[i++]=date.getMonth()
              
            })
            months.forEach((ele,index)=>{
                const month=monthNumber[ele]
                const extValue=finalMonths[month]
                finalMonths[month]=extValue+1
            })
            const monthlySalesRecord=[]
            i=0;
            Object.values(finalMonths).forEach((ele)=>{
                monthlySalesRecord[i++]=ele
            })
    
            return res.status(200).json({
                sucess:true,
                message:"Succesfully got all subscription",
                result: {subscriptionDetails , finalMonths ,monthlySalesRecord}
            })
        }
            
        catch(err){
            return next(new AppError(err.message,500))
        }
    }

    const getAllFeedback=async (req,res,next)=>{
        const { propertyId } = req.params;
    
        try {
          const feedbackInfo = await feedback.findOne({ property: propertyId });
      
          if (!feedbackInfo) {
            return  res.status(200).json({
                sucess:false,
                message:"There is no feedback for this property"});          }
      
          const averages = {
            cleanliness: feedbackInfo.cleanliness.avg,
            waterSupply: feedbackInfo.waterSupply.avg,
            electrical: feedbackInfo.electrical.avg,
            safety: feedbackInfo.safety.avg,
            internet: feedbackInfo.internet.avg,
            maintenance: feedbackInfo.maintenance.avg,
            security: feedbackInfo.security.avg,
            bookingProcess: feedbackInfo.bookingProcess.avg,
          };
      
        return  res.status(200).json({
            sucess:true,
            data: averages });
        } catch (err) {
          return next(new AppError(err.message,404))
        }
      }
export {signUp,logIn,logOut,getOwnerDetails,createProperty,updateProperty,deleteProperty,
    getPropertyById,getAllProperty,addGuest,sendLoginIdToGuest,getAllComplains,
     getComplainById,resolveComplainByOwner,createSubscription,
     varifySubscribtion,getAllSubscription,getPaymentApiKey1,getAllFeedback}