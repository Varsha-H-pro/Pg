import AppError from "../helper/errorHandler.js";
import complaint from "../model/complainSchema.js";
import property from "../model/propertySchema.js";


const getComplaintsSummary = async (req, res,next) => {
  console.log("fjjdbgf");
    const ownerId=req.owner.id
    console.log(ownerId);
    try {
      const comp = await complaint.find().populate('property');
      // console.log(comp);
      const complaints=comp.filter((ele)=>{
        // console.log(ele);
        return ele.property.owner==ownerId
    })
  // console.log(complaints);
      const summary = complaints.reduce(
        (acc, complaint) => {
          acc.total += 1;
          acc[complaint.type] += 1;
          return acc;
        },
        {
          total: 0,
          cleaning: 0,
          food: 0,
          maintenance: 0,
          noise: 0,
          other: 0,
        }
      );
       console.log(summary);

     return res.status(200).json({
        sucess:true,
        data:summary
      });
    } catch (error) {
      return next(new AppError(error.message,500))
    }
  };

  const getComplaintsSummaryByProperty = async (req, res,next) => {
    const ownerId=req.owner.id
    try {
      const prop = await property.find().populate('complaints');
      
      const properties=prop.filter((ele)=>ele.owner==ownerId)
      const summaryByProperty = properties.map((propertyInfo) => {
        const propertySummary = propertyInfo.complaints.reduce(
          (acc, complaint) => {
            acc.total += 1;
            acc[complaint.type] += 1;
            return acc;
          },
          {
            property: propertyInfo._id,
            name: propertyInfo.name,
            total: 0,
            cleaning: 0,
            food: 0,
            maintenance: 0,
            noise: 0,
            other: 0,
          }
        );
        return propertySummary;
      });
  
     return res.status(200).json({
        sucess:true,
        data:summaryByProperty
      });
    } catch (error) {
      return next(new AppError(error.message,500))
    }
  };

  const getComplaintsDetails = async (req, res,next) => {
    const { category } = req.query;
    const ownerId=req.owner.id
    try {
      const comp = await complaint.find({ type: category })
        .populate('property')
        .populate('guest', 'name room');
  
        const complaints=comp.filter((ele)=>{
            return ele.property.owner==ownerId
        })
      return res.status(200).json(complaints);
    } catch (error) {
      return next(new AppError(error.message,500))
    }
  };

  const calculateRating=async (req,res,next)=>{
    const { propertyId } = req.params;
    console.log(propertyId);
    try {
      const complaints = await complaint.find({ property: propertyId });
      console.log(complaints);
      const propertyInfo=await property.findById(propertyId)
      if (!complaints || complaints.length==0) {
        console.log('No complaints found for this property');
        return res.status(200).json({ 
          sucess:false,
          message:"No complaints found for this property",
          
        });
      }
  
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
     return res.status(200).json({ 
        sucess:true,
        message:"Rating calculated sucessfully",
        data:{propertyId, rating, totalComplaints }
      });
    } catch (error) {
     return next(new AppError(error.message,500))
    }
  };
  
  export {getComplaintsSummary,getComplaintsSummaryByProperty,getComplaintsDetails
    ,calculateRating
  }