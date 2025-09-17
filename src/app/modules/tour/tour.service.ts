import StatusCodes from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { ITour, ITourType } from './tour.interface';
import { Tour, TourType } from './tour.model';
import { createSlug } from '../../utils/slugGenerator';
import { searchField } from './tour.constant';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { deleteCloudinaryImage } from '../../config/cloudinary.config';

//============TOUR TYPE SERVICE
// CREATE TOUR TYPE
const createTourType = async (payload: ITourType) => {
  const TourTypes = await TourType.create(payload);
  return TourTypes;
};

// READ ALL TOUR TYPES
const getTourType = async () => {
  const TourTypes = await TourType.find().lean();
  return TourTypes;
};

// UPDATE A TOUR TYPE
const updateTourType = async (tourTypeId: string, payload: ITourType) => {
  const isTourType = await TourType.findOne({ _id: tourTypeId });
  if (!isTourType)
    return new AppError(StatusCodes.BAD_REQUEST, "Tour Type Doesn't Exist!");

  Object.assign(isTourType, payload);
  const update = await isTourType.save();
  return update;
};

// DELETE A TOUR TYPE
const deleteTourType = async (tourTypeId: string) => {
  const isTourType = await TourType.findOne({ _id: tourTypeId });
  if (!isTourType)
    return new AppError(StatusCodes.BAD_REQUEST, "Tour Type Doesn't Exist!");

  const tourTypes = await TourType.findOneAndDelete({ _id: tourTypeId });
  return tourTypes;
};

//================TOUR SERVICE=======================
// CREATE TOUR
const createTour = async (payload: ITour) => {
  const tour = await Tour.create(payload);
  return tour;
};

const retriveAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tour = await queryBuilder
    .filter()
    .search(searchField)
    .select()
    .sort()
    .pagiate()
    .join()
    .build();

  const meta = await queryBuilder.getMeta();

  return { data: tour, meta };
};

/*
//GET ALL TOUR
const retriveAllTours = async (query: Record<string, string>) => {
    const filter = {...query};
    const searchTerm = query.searchTerm || ""; // Ensure not undefined by blank string
    const sort = query.sort || "-createdAt";
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip =  (page - 1) * limit;
 

    // Field filtering
    const fields = query.fields ? query?.fields.split(",").join(" ") : "";

    
    // Remove excluded fields
    for (const field of excludeField) {
         // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
         delete filter[field];
    }

    // Search Query
    const searchQuery = {
        $or: searchField.map(field => (
            {[field]: { $regex: searchTerm, $options: "i" }} // map returns an array
        ))
    }

    // Database Qeury
    const tour = await Tour
                            .find(filter) // case-sensitive filter
                            .find(searchQuery) // Searching
                            .sort(sort) // dynamic sort by field
                            .skip(skip) // Pagination: skip
                            .limit(limit) // Pagination: limit
                            .select(fields) // field filtering
                            .lean() // avoid unnecessary method
                            .populate({path: "division", select: "name slug"}) // Join Division
                            .populate({path: "tourType", select: "name"}); // Join Tour Type

    const totalTour = await Tour.countDocuments();
    const totalPage = Math.ceil(totalTour / limit);
    const meta = {
        total: totalTour,
        page,
        limit,
        totalPage
    }
    return {
        data: tour,
        meta
    };
} 

*/

// UPDATE TOUR
const updateTours = async (tourId: string, payload: Partial<ITour>) => {
  const isTour = await Tour.findOne({ _id: tourId });
  if (!isTour) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Tour not found!');
  }

  if (payload.title) {
    const updateSlug = createSlug(payload.title);
    payload.slug = updateSlug;
  }

  if (
    payload.images &&
    payload.images.length > 0 &&
    isTour.images &&
    isTour.images.length > 0
  ) {
    payload.images = [...new Set([...payload.images, ...isTour.images])];
  }

  if (
    payload.deletedImages &&
    payload.deletedImages.length > 0 &&
    isTour.images &&
    isTour.images.length > 0
  ) {
    const restDbImage = isTour?.images.filter(
      (image) => !payload.images?.includes(image)
    );

    const updatePayloadImages = (payload?.images || []).filter(
      (image) => !payload.deletedImages?.includes(image)
    );

    payload.images = [...new Set([...restDbImage, ...updatePayloadImages])];
  }

  const update = await Tour.findByIdAndUpdate(tourId, payload, {
    new: true,
    runValidators: true,
  });

  if (
    payload?.deletedImages &&
    payload?.deletedImages.length > 0 &&
    isTour?.images &&
    isTour?.images.length > 0
  ) {
    await Promise.all(
      payload?.deletedImages.map((url) => deleteCloudinaryImage(url))
    );
  }
  return update;
};

// DELETE A TOUR
const deleteTours = async (tourId: string) => {
  const isTour = await Tour.findOne({ _id: tourId });
  if (!isTour) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Tour doesn't exist!");
  }

  const updateTour = await Tour.findOneAndDelete({ _id: tourId });
  return updateTour;
};

export const tourTypeServices = {
  createTourType,
  getTourType,
  updateTourType,
  deleteTourType,
  createTour,
  retriveAllTours,
  updateTours,
  deleteTours,
};
