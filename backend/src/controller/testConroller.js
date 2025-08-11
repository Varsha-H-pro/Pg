import AppError from '../helper/errorHandler.js';
import guest from '../model/guestSchema.js';

import Razorpay from 'razorpay';
import property from '../model/propertySchema.js';

const razorpay = new Razorpay({
    key_id: 'rzp_test_uNroaW9UQ2EFbd',
    key_secret: 'y0YO5EV9O4uvb5OrFK5xb7hD',
});
const createPayment = async (req, res,next) => {
    const {userId,amount}=req.body
        try {
        const userInfo=await guest.findById(userId)
        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: 'INR',
            receipt: `receipt_order_${Math.random() * 10000}`,
        };
        const order = await razorpay.orders.create(options);

        userInfo.subscription.amount=amount
        userInfo.subscription.lastPaymentDate=new Date()
        await userInfo.save()

       return res.status(200).json({ 
            sucess:true,
            message:"Subscribtion created sucessfully",
            data: order.id 
        });
    } catch (error) {
        return next(new AppError(error.message,500))
    }
};

// const setAmount=async (req,res,next)=>{
//     const {userId,amount}=req.body
//     try{
//         const userInfo=await guest.findById(userId)
//     }
// }

const checkPaymentStatus = async (req, res,next) => {
    const {userId}=req.params
    console.log(userId);
    try {
        const user=await guest.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const now = new Date();
        const lastPaymentDate = user.subscription.lastPaymentDate || new Date(0);
        const hasPaidThisMonth = lastPaymentDate.getMonth() === now.getMonth() &&
                                 lastPaymentDate.getFullYear() === now.getFullYear();

       return res.status(200).json({ hasPaidThisMonth });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRevenueData = async (req, res) => {
    const ownerId=req.owner.id
    try {
        const properties = await property.find({ owner: ownerId });

        // Step 2: Extract propertyIds from the found properties
        const propertyIds = properties.map(property => property._id.toString());
    
        // Step 3: Find guests with the extracted propertyIds
        const users = await guest.find({ propertyId: { $in: propertyIds } });
        const revenueData = users.reduce((acc, user) => {
            const month = user.subscription.paymentDate.getMonth() + 1;
            const year = user.subscription.paymentDate.getFullYear();
            const key = `${year}-${month}`;

            if (!acc[key]) {
                acc[key] = { totalAmount: 0, userCount: 0 };
            }

            acc[key].totalAmount += user.subscription.amount;
            acc[key].userCount += 1;

            return acc;
        }, {});
        console.log(revenueData);

      return  res.status(200).json(
      
        revenueData
    );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createDeposit = async (req, res,next) => {
    const {userId,amount}=req.body
    console.log(amount);

    try{
        const userInfo=await guest.findById(userId)
    const options = {
        amount: amount * 100, // amount in the smallest currency unit
        currency: 'INR',
        receipt: `receipt_order_${Math.random() * 10000}`,
    };
    const order = await razorpay.orders.create(options);

    userInfo.deposit.status=true
    await userInfo.save()

   return res.status(200).json({ 
        sucess:true,
        message:"Subscribtion created sucessfully",
        data: order.id 
    });
      }
      catch(err){
        return next(new AppError("Failed to subscribe",500))
      }
    } 

    const cheakDepositStatus=async (req,res,next)=>{
        const {userId}=req.params
        console.log();
        console.log(userId);
        try {
            const user=await guest.findById(userId)
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            let depositStatus;
            if(!user.deposit.status || user.deposit.status==false){
                depositStatus=false
            }
            else{
                depositStatus=user.deposit.status
            }
            return res.status(200).json({ depositStatus });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

export  {createPayment,checkPaymentStatus,getRevenueData,createDeposit,cheakDepositStatus}
