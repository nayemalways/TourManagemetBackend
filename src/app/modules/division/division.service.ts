import AppError from '../../errorHelpers/AppError';
import { IDivision } from './division.interface';
import Division from './division.model';
import statusCode from 'http-status-codes';
import { deleteImageFromCLoudinary } from '../../config/cloudinary.config';

// CREATE DIVISION
const createDivision = async (payload: IDivision) => {
  //ex. If payload.name = Dhaka' make it Dhaka Division
  const divisionName = payload.name;
  const splitDivision = divisionName.split(' ');
  let isDivisionFlagIncluded; // Is added Division with name like "Barishal Division" or "Barishal"
  splitDivision.forEach((n) => {
    isDivisionFlagIncluded = n === 'Division';
  });

  if (!isDivisionFlagIncluded) {
    payload.name = `${payload.name} Division`; // If not included, Add "Division". Result ex: Barishal Division
  }

  return await Division.create(payload);
};

// READ ALL DIVISION
const getDivision = async () => await Division.find().lean();

// UPDATE DIVISION
const updateDivision = async (
  divisionId: string,
  payload: Partial<IDivision>
) => {
  const isDivision = await Division.findOne({ _id: divisionId });
  if (!isDivision) {
    throw new AppError(statusCode.BAD_REQUEST, 'Division not found!');
  }

  //ex. If payload.name = Dhaka' make it Dhaka Division
  if (payload?.name) {
    const divisionName = payload?.name as string;
    const splitDivision = divisionName.split(' ');
    let isDivisionFlagIncluded; // Is added Division with name like "Barishal Division" or "Barishal"
    splitDivision.forEach((n) => {
      isDivisionFlagIncluded = n === 'Division';
    });

    if (!isDivisionFlagIncluded) {
      payload.name = `${payload.name} Division`; // If not included, Add "Division". Result ex: Barishal Division
    }

    // DUPLICATE DIVISION CHECK
    const duplicateDivision = await Division.findOne({
      name: payload?.name,
      _id: { $ne: divisionId },
    });
    if (duplicateDivision) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        'Division already exist by this name'
      );
    }
  }

  if (payload?.thumbnail && isDivision?.thumbnail) {
    // delete existing images from cloudinar
    await deleteImageFromCLoudinary(isDivision?.thumbnail as string);
  }

  // UPDATE
  const division = await Division.findOneAndUpdate(
    { _id: divisionId },
    payload,
    { new: true, runValidators: true }
  );
  return division;
};

// DELETE DIVISION
const deleteDivision = async (divisionId: string) => {
  const isDivision = await Division.findOne({ _id: divisionId });
  if (!isDivision)
    return new AppError(statusCode.BAD_REQUEST, 'Division not exist!');

  // delete existing images from cloudinary
  if (isDivision?.thumbnail) {
    await deleteImageFromCLoudinary(isDivision?.thumbnail as string);
  }

  return Division.findOneAndDelete({ _id: divisionId });
};

// EXPORT ALL FUNCTION
export const divisionServices = {
  createDivision,
  getDivision,
  updateDivision,
  deleteDivision,
};
