/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { CatchAsync } from '../../utils/CatchAsync';
import { tourTypeServices } from './tour.service';
import { SendResponse } from '../../utils/SendResponse';
import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';

// CREATE TOUR TYPE
const createTourType = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypes = await tourTypeServices.createTourType(req.body);

    SendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Tour type created!',
      data: tourTypes,
    });
  }
);

// READ ALL TOUR TYPE
const getTourType = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypes = await tourTypeServices.getTourType();

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tour type retried successful!',
      data: tourTypes,
    });
  }
);

// UPDATE TOUR TYPE
const updateTourType = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id;
    const tourTypes = await tourTypeServices.updateTourType(
      tourTypeId,
      req.body
    );
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tour type updated!',
      data: tourTypes,
    });
  }
);

// DELETE TOUR TYPE
const deleteTourType = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id;
    const tourTypes = await tourTypeServices.deleteTourType(tourTypeId);
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tour type deleted!',
      data: tourTypes,
    });
  }
);

// CREATE TOUR
const createTour = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.tourType) {
      throw new AppError(404, 'Tour type must required');
    }
    if (!req.body?.division) {
      throw new AppError(404, 'Tour division must required');
    }

    const payload = {
      ...req.body,
      images: ((req.files as Express.Multer.File[]) || []).map(
        (file) => file.path
      ),
    };

    const tour = await tourTypeServices.createTour(payload);

    SendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Tour created successful!',
      data: tour,
    });
  }
);

// READ ALL TOUR
const retriveAllTours = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const tour = await tourTypeServices.retriveAllTours(
      query as Record<string, string>
    );

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tour Retrieve successful!',
      data: tour?.data,
      meta: {
        ...tour?.meta,
      },
    });
  }
);

// UPDATE TOUR
const updateTours = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map((file) => file.path),
    };

    const tour = await tourTypeServices.updateTours(id, payload);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tour update successful!',
      data: tour,
    });
  }
);

// DELETE TOUR
const deleteTours = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await tourTypeServices.deleteTours(req.params.id);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tour delete successful!',
      data: tour,
    });
  }
);

export const tourControllers = {
  createTourType,
  getTourType,
  updateTourType,
  deleteTourType,
  createTour,
  retriveAllTours,
  updateTours,
  deleteTours,
};
