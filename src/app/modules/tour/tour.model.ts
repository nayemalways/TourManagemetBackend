import mongoose, { Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";
 

// TOUR TYPE SCHEMA
const TourTypeSchema = new Schema<ITourType>({
    name: {type:String, required: true, unique: true}
}, {
    timestamps: true,
    versionKey: false
})
export const TourType = mongoose.model<ITourType>("TourType", TourTypeSchema);




//  TOUR SCHEMA
const TourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: { 
        type: Schema.Types.ObjectId,
        ref: "division",
        required: true 
    },
    tourType: { 
        type: Schema.Types.ObjectId,
        ref: "TourType",
        required: true 
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
 
export const Tour = mongoose.model<ITour>("Tour", TourSchema);
