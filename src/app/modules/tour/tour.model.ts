import mongoose, { Schema } from 'mongoose';
import { ITour, ITourType } from './tour.interface';
import { createSlug } from '../../utils/slugGenerator';
import AppError from '../../errorHelpers/AppError';
import { StatusCodes } from 'http-status-codes';

// TOUR TYPE SCHEMA
const TourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const TourType = mongoose.model<ITourType>('TourType', TourTypeSchema);

//  TOUR SCHEMA
const TourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
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
      ref: 'division',
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: 'TourType',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// PRE HOOK
TourSchema.pre('save', async function (next) {
  if (!this.title) {
    throw new AppError(400, 'Tour title not found');
  }
  const slug = createSlug(this.title);
  const isTour = await Tour.findOne({ slug });
  if (isTour) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Tour already exist with this title, try different title!'
    );
  }

  this.slug = slug;
  next();
});

export const Tour = mongoose.model<ITour>('Tour', TourSchema);
