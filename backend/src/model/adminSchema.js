import mongoose from "mongoose";

const adminSchema=new mongoose.Schema({
    
    email:{
        type:String,
        require:[true,"Email is required"],
        unique:[true,"Email must be unique"],
        match: [
            /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            'Please fill in a valid email address',
          ],
    },


})
export default mongoose.model('admin', adminSchema);