import AppError from "../helper/errorHandler.js"
import property from "../model/propertySchema.js";
import owner from "../model/ownerSchema.js"
import nodemailer from "nodemailer"
import guest from "../model/guestSchema.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"
import complaint from "../model/complainSchema.js"
import propertySchema from "../model/propertySchema.js";
import feedback from "../model/feedbackSchema.js";

const searchProperty=async (req,res,next)=>{
    const {city,state,category}=req.body 
    if(!city || !state ){
        return next(new AppError("All fildes are required",404)) 
    }
    try{ 
        const properties = await property.find({
            city: { $regex: new RegExp(city, 'i') },
            state: { $regex: new RegExp(state, 'i') },
            category:{$regex: new RegExp(category,"i")},
          });
          
          const result=properties.map(async (ele)=>{
            let ownerInfo=await owner.findById(ele.owner)
            
              const complaints = await complaint.find({ property: ele._id });
              console.log(complaints);
              const propertyInfo=await property.findById(ele._id)
              if (!complaints || complaints.length==0) {
                console.log('No complaints found for this property');
                //  res.status(200).json({ 
                //   sucess:false,
                //   message:"No complaints found for this property",
                  
                // });
              }
              
          else{
              let totalPoints = 100; 
              let totalComplaints = complaints.length;
          
              complaints.forEach((complaint) => {
                if (complaint.status === 'Pending') {
                  totalPoints -= 10;
                } else if (complaint.status === 'Resolved' && complaint.resolvedAt) {
                  const resolutionTime = (complaint.resolvedAt - complaint.createdAt) / (1000 * 60 * 60 * 24);
          
                  if (resolutionTime <= 1) {
                    totalPoints += 5; // Add full points for quick resolutions
                  } else if (resolutionTime <= 3) {
                    totalPoints += 3; // Add moderate points for resolutions within 2-3 days
                  } else if (resolutionTime <= 7) {
                    totalPoints += 1; // Add fewer points for resolutions within a week
                  } else {
                    totalPoints += 0.5; // Add minimal points for resolutions after a week
                  }
                }
              });
              
              const rating = Math.max(0, Math.min(5, totalPoints / 20)); // Normalize to a 5-star rating system
              console.log(rating);
              propertyInfo.rating=rating
        
              await propertyInfo.save()
            }
        
            return ({
                rating:propertyInfo.rating,
                propertyId:ele._id,
                ownerName:ownerInfo.name,
                ownerPhone:ownerInfo.phone,
                startingAmount:ele.startingAmount,
                name:ele.name,
                discription:ele.discription,
                category:ele.category,
                address:ele.address,
                city:ele.city,
                state:ele.state,
                zipCode:ele.zipCode,
                facilities:ele.facilities,
                property_photos:ele.property_photos,
                
                
            })
          })
          let Results = await Promise.all(result);
          return res.status(200).json({
            sucess:true,
            message:"All properties fetched sucessfully",
            data:Results
          })
    }
    catch(err){
        console.log("ERROR searching property",err);
        return next(new AppError(err.message,500))
    }
}

const showAllProperty=async (req,res,next)=>{
  try{
    const properties=await property.find()
    const result=properties.map(async (ele)=>{
      let ownerInfo=await owner.findById(ele.owner)
      // console.log(ele);
      return ({
         rating:ele.rating,
          propertyId:ele._id,
          ownerName:ownerInfo.name,
          ownerPhone:ownerInfo.phone,
          name:ele.name,
          startingAmount:ele.startingAmount,
          discription:ele.discription,
          category:ele.category,
          address:ele.address,
          city:ele.city,
          state:ele.state,
          zipCode:ele.zipCode,
          facilities:ele.facilities,
          property_photos:ele.property_photos,
        
          
      })
    })
    let Results = await Promise.all(result);
    return res.status(200).json({
      sucess:true,
      message:"All properties fetched sucessfully",
      data:Results
    })
}
catch(err){
  console.log("ERROR searching property",err);
  return next(new AppError(err.message,500))
}
}

const sendEmailToOwner=async (req,res,next)=>{
  const {name,phone,email,message}=req.body
  const propertyId=req.params.propertyId
  console.log(propertyId);
  if(!name || !phone || !email || !message){
    return next(new AppError("All fildes are required",404))
  }
  try{
    const propertyInfo=await property.findById(propertyId)
    const ownerInfo=await owner.findById(propertyInfo.owner)

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
      from: email, // sender address
      to: ownerInfo.email, // list of receivers
      subject: "Buy room", // Subject line
      text: message, // plain text body
      html: `name: <b>${name}</b> , phone number: <b>${phone}</b> , email: <b>${email}</b>`, // html body
  });
  return res.status(200).json({
      sucess:true,
      message:"Thanks for choosing us... Message send sucessfully.... Owner will contact you soon",
   })
  }
  catch(err){
    console.log("ERROR in sending message",err);
  return next(new AppError(err.message,500))
  }
}

const loginDashboard=async (req,res,next)=>{
  const {loginId,loginPassword}=req.body
  try{
    const findGuest=await guest.findOne({loginId})
    if(!findGuest || findGuest.loginPassword!=loginPassword){
      return next(new AppError("You entered wrong credentials",404))
    }
    const cookieOption={
      maxAge:7*24*60*60*1000, //7days in expiry data
      httpOnly:true,
      secure:true
  }
  findGuest.role="user"
  await findGuest.save()
  const userToken=await findGuest.jwtToken()

  res.cookie("userToken",userToken,cookieOption)

  return res.status(200).json({
      sucess:true,
      message:"Login sucessfully",
      data:findGuest
  })
  }
  catch(err){
    console.log("ERROR in login",err);
  return next(new AppError(err.message,500))
  }
}

const updateLogin=async (req,res,next)=>{
  const {loginId,loginPassword}=req.body
  const userId=req.user.id
  try{
    const updateInfo=await guest.findByIdAndUpdate(userId,{loginId:loginId,loginPassword:loginPassword})

    
    const cookieOption={
      maxAge:7*24*60*60*1000, //7days in expiry data
      httpOnly:true,
      secure:true
  }
  const userToken=await updateInfo.jwtToken()

  res.cookie("userToken",userToken,cookieOption)
    return res.status(200).json({
      sucess:true,
      message:"Update sucessfully",
      data:updateInfo
  })
  }
  catch(err){
    console.log("ERROR in update",err);
  return next(new AppError(err.message,500))
  }
}

const logOut=async (req,res,next)=>{
  try{
  res.cookie("userToken","null",{
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

const addComplain=async (req,res,next)=>{
  const guestId=req.user.id
  const {type, title, description } = req.body;
  if(!type || !title || !description){
    return next (new AppError("All Fildes are required",404))
  }
  try{
    const guestInfo=await guest.findById(guestId)
    const propertyInfo=await property.findById(guestInfo.propertyId)
    const ownerInfo=await owner.findById(propertyInfo.owner)
    let complainPhotoResult;
    if(req.files){
      const files = req.files;
      console.log(files);
      let uploadPromises = files.map(async (file) => {
        return await cloudinary.v2.uploader.upload(file.path, {
          folder: 'uploads'
        });
      });
      let uploadResults = await Promise.all(uploadPromises);
       complainPhotoResult=uploadResults.map((ele)=>{
          return {
          public_id: ele.public_id,
          secure_url: ele.secure_url
      }})
     
      req.files.map((file)=> fs.rm(`uploads/${file.filename}`))
      console.log(complainPhotoResult);
    }
    const validTypes = ['cleaning', 'food', 'maintenance', 'noise', 'other'];
    if (!validTypes.includes(type.toLowerCase())) {
      return next(new AppError("Invalid type",404))
    }

    const complainInfo=await complaint.create({
      guest:guestId,
      property:guestInfo.propertyId,
      title,
      type,
      description,
      photos:complainPhotoResult
    })

    await propertySchema.findByIdAndUpdate(
      guestInfo.propertyId,
      { $push: { complaints: complainInfo._id } },
      { new: true }
    );
    if(complainInfo){
      try{
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
          from:guestInfo.email  , // sender address
          to:ownerInfo.email , // list of receivers
          subject: `Complain: ${title}`, // Subject line
          text: `${description}`, // plain text body
          html: `Guest name: <b>${guestInfo.name}</b>, room: <b>${guestInfo.room.roomNo}</b> <br/> has a complain for ${type} <br/> ${title}:${description} <br/> Complain details: ${complainInfo}`, // html body
      });
      }
      catch(err){
        console.log("ERROR in sending the message",err);
        return next(new AppError(err.message,500))
    }
    }
    await guest.findByIdAndUpdate(guestId, { $push: { complaints: complainInfo._id } });
    return res.status(200).json({
      sucess:true,
      message:"New complain added successfully",
      data:complainInfo
  })
  }
  catch(err){
    console.log("ERROR is adding complain",err);
    return next(new AppError(err.message,500))
}
}

const contactAdmin=async (req,res,next)=>{
  const {name,email,phone,message}=req.body
  if(!name || !email || !phone || !message){
    return next (new AppError("All Fildes are required",404))
  }
  try{
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
      from: email, // sender address
      to:"mandanmishra11@gmail.com" , // list of receivers
      subject: "Complaint", // Subject line
      text: message, // plain text body
      
  });
  return res.status(200).json({
    sucess:true,
    message:"New complain added successfully",
})
  }
  catch(err){
    console.log("ERROR is adding complain",err);
    return next(new AppError(err.message,500))
}
}
// const approveProblemResolved=async (req,res,next)=>{
//   const userId=req.user.id
//   const complainId=req.params.complainId
//   try{
//     const complainInfo=await complaint.findById(complainId)
//     complainInfo.approvedByGuest=true
//     complainInfo.save()

//     const updatedGuest = await guest.findByIdAndUpdate(
//       userId,
//       { $pull: { complaints: complainId } },
//       { new: true }   
//     );
//     return res.status(200).json({
//       sucess:true,
//       message:"Problem resoved successfully",
//   })
//   }
//   catch(err){
//     console.log("ERROR in approving problem",err);
//     return next(new AppError(err.message,500))
// }
// }

   const addFeedback=async (req,res,next)=>{
    try {
      const guestId=req.user.id
      const feedbackData  = req.body.feedback;
      console.log(feedbackData);
      if (!guestId || !feedbackData) {
        return next(new AppError('Guest ID and feedback are required.',404))
            }

        const guestInfo=await guest.findById(guestId)
        let feedbackDoc = await feedback.findOne({ property: guestInfo.propertyId });
        const propertyInfo = await property.findById(guestInfo.propertyId );
      if (!feedbackDoc) {
        feedbackDoc = await feedback.create({ property: guestInfo.propertyId  });
        propertyInfo.feedbacks.push(feedbackDoc._id);
        await propertyInfo.save();
      }

      const categories = [
        'cleanliness', 'waterSupply', 'electrical', 'safety', 'internet', 'maintenance', 'security', 'bookingProcess'
      ];

      for (const category of categories) {
        if (feedbackData[category] !== undefined) {
          const value = feedbackData[category];
          feedbackDoc[category].feedbackSum += value;
          feedbackDoc[category].noOfUser += 1;
          feedbackDoc[category].avg = feedbackDoc[category].feedbackSum / feedbackDoc[category].noOfUser;
        }
      }
      await feedbackDoc.save();

      return res.status(200).json(
        { 
          sucess:true,
          message: 'Feedback added successfully.', 
          data: feedbackDoc 
        });
    } catch (err) {
      console.error('Error adding feedback:', err);
      return next(new AppError(err.message,404))
    }
  };   



export  {searchProperty,showAllProperty,sendEmailToOwner,loginDashboard,updateLogin,
  logOut,addComplain,contactAdmin,addFeedback}