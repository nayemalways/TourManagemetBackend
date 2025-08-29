import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import Division from "./division.model";
import  statusCode  from 'http-status-codes';



const createDivision = async (payload: IDivision) => {
   
    //ex. If payload.name = Dhaka' make it Dhaka Division
    const divisionName = payload.name;
    const splitDivision = divisionName.split(" ");
    let isDivisionFlagIncluded; // Is added Division with name like "Barishal Division" or "Barishal"
    splitDivision.forEach((n) => {
        isDivisionFlagIncluded = n === "Division";
    })

     if(!isDivisionFlagIncluded) {
        payload.name = `${payload.name} Division`; // If not included, Add "Division". Result ex: Barishal Division
     }

    const division = await Division.create(payload);
    return division;
}


const getDivision = async () => {    
    const division = await Division.find().lean();
    return division;
}


const updateDivision = async (divisionId: string, payload: Partial<IDivision>) => {

     //ex. If payload.name = Dhaka' make it Dhaka Division
    const divisionName = payload.name as string;
    const splitDivision = divisionName.split(" ");
    let isDivisionFlagIncluded; // Is added Division with name like "Barishal Division" or "Barishal"
    splitDivision.forEach((n) => {
        isDivisionFlagIncluded = n === "Division";
    })

     if(!isDivisionFlagIncluded) {
        payload.name = `${payload.name} Division`; // If not included, Add "Division". Result ex: Barishal Division
     }

    const isDivision = await Division.findOne({_id: divisionId});
    if(!isDivision) {
        throw new AppError(statusCode.BAD_REQUEST, "Division not found!");
    }
    // DUPLICATE DIVISIN CHECK
    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id: {$ne: divisionId}
    })
    if(duplicateDivision) {
        throw new AppError(statusCode.BAD_REQUEST, "Division already exist by this name");
    }


    // UPDATE
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