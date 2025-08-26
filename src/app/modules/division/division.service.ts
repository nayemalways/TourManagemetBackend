import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import Division from "./division.model";
import  statusCode  from 'http-status-codes';


const createDivision = async (payload: IDivision) => {

    const isDivision = await Division.findOne({slug: payload.slug});
    if(isDivision){ 
        return new AppError(statusCode.BAD_REQUEST, "Division Already Exist!");
    }
    const division = await Division.create(payload);
    return division;
}


const getDivision = async () => {    
    const division = await Division.find().lean();
    return division;
}


const updateDivision = async (divisionId: string, payload: Partial<IDivision>) => {

    const isDivision = await Division.findOne({_id: divisionId});
    if(!isDivision) 
        return new AppError(statusCode.BAD_REQUEST, "Division not exist!");

    const division = await Division.findOneAndUpdate({_id: divisionId}, payload, {new: true, runValidators: true});
    return division;
}


const deleteDivision = async (divisionId: string) => {

    const isDivision = await Division.findOne({_id: divisionId});
    if(!isDivision) 
        return new AppError(statusCode.BAD_REQUEST, "Division not exist!");

    const division = await Division.findOneAndDelete({_id: divisionId});
    return division;
}


export const divisonServices = {
    createDivision,
    getDivision,
    updateDivision,
    deleteDivision
}