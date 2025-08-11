import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'property', required: true },
    cleanliness:{
      noOfUser:{type:Number, default:0},
      feedbackSum:{type:Number, default:0},
      avg:{type:Number, default:0}
    },
    waterSupply:{
      noOfUser:{type:Number, default:0},
      feedbackSum:{type:Number, default:0},
      avg:{type:Number, default:0}
    },
    electrical:{
      noOfUser:{type:Number, default:0},
      feedbackSum:{type:Number, default:0},
      avg:{type:Number, default:0}
    },
    safety:{
      noOfUser:{type:Number, default:0},
      feedbackSum:{type:Number, default:0},
      avg:{type:Number, default:0}
    },
    internet:{
      noOfUser:{type:Number, default:0},
      feedbackSum:{type:Number, default:0},
      avg:{type:Number, default:0}
    },
    maintenance:{
      noOfUser:{type:Number, default:0},
      feedbackSum:{type:Number, default:0},
      avg:{type:Number, default:0}
    },
    security:{
      noOfUser:{type:Number, default:0},
      feedbackSum:{type:Number, default:0},
      avg:{type:Number, default:0}
    },
    bookingProcess:{
      noOfUser:{type:Number, default:0},
      feedbackSum:{type:Number, default:0},
      avg:{type:Number, default:0}
    },
    
  });
  
  export default mongoose.model('feedback', feedbackSchema);