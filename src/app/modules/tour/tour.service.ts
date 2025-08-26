import  StatusCodes  from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ITourType } from "./tour.interface";
import { TourType } from "./tour.model";

 

const createTourType = async (payload: ITourType) => {
    const TourTypes = await TourType.create(payload);
    return TourTypes;
}

const getTourType = async () => {
    const TourTypes = await TourType.find().lean();
    return TourTypes;
}


const updateTourType = async (tourTypeId: string, payload: ITourType) => { 
    const isTourType = await TourType.findOne({_id: tourTypeId});
    if(!isTourType) 
        return new AppError(StatusCodes.BAD_REQUEST, "Tour Type Doesn't Exist!");

    Object.assign(isTourType, payload);
    const update = await isTourType.save();
    return update;
}


const deleteTourType = async (tourTypeId: string) => { 
    const isTourType = await TourType.findOne({_id: tourTypeId});
    if(!isTourType) 
        return new AppError(StatusCodes.BAD_REQUEST, "Tour Type Doesn't Exist!");
 
    const tourTypes = await TourType.findOneAndDelete({_id: tourTypeId})
    return tourTypes;
}


export const tourTypeServices = {
    createTourType,
    getTourType,
    updateTourType,
    deleteTourType
}