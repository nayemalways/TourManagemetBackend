import AppError from "../../errorHelpers/AppError";
import { createSlug } from "../../utils/slugGenerator";
import { IDivision } from "./division.interface";
import Division from "./division.model";
import  statusCode  from 'http-status-codes';



const createDivision = async (payload: IDivision) => {
   
    const divisionName = payload.name;
    const splitDivision = divisionName.split(" ");
    let isDivisionFlagIncluded; // Is added Division with name like "Barishal Division" or "Barishal"
    splitDivision.forEach((n) => {
        isDivisionFlagIncluded = n === "Division";
    })

     if(!isDivisionFlagIncluded) {
        payload.name = `${payload.name} Division`; // If not included, Add "Division". Result ex: Barishal Division
     }


    const slug = createSlug(payload.name);
    const isDivision = await Division.findOne({slug});
    if(isDivision){ 
        return new AppError(statusCode.BAD_REQUEST, "Division Already Exist!");
    }

    payload.slug = slug;
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