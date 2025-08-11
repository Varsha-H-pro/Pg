import express from "express"
import { calculateRating, getComplaintsDetails, getComplaintsSummary, getComplaintsSummaryByProperty } from "../controller/helperController.js"
import jwtAuth from "../middleware/ownerMiddleware.js"

const helperRouter=express.Router()

helperRouter.get("/complainSummery",jwtAuth,getComplaintsSummary)
helperRouter.get("/complainSummeryByProperty",jwtAuth,getComplaintsSummaryByProperty)
helperRouter.get("/getAllComplainsDetailes/:category",jwtAuth,getComplaintsDetails)
helperRouter.post("/rating/:propertyId",calculateRating)
export default helperRouter