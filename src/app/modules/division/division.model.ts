import mongoose, { Schema } from 'mongoose';
import { IDivision } from './division.interface';
import AppError from '../../errorHelpers/AppError';
import { createSlug } from '../../utils/slugGenerator';
import statusCode from 'http-status-codes';

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// PRE HOOK
divisionSchema.pre('save', async function (next) {
  if (!this.name) {
    throw new AppError(400, 'Division name not found');
  }

  const slug = createSlug(this.name);
  const isDivision = await Division.findOne({ slug });
  if (isDivision) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      'Division already exist with this name!'
    );
  }

  this.slug = slug;
  next();
});

divisionSchema.pre('findOneAndUpdate', async function (next) {
  const division = this.getUpdate() as Partial<IDivision>;
  // console.log(division);
  const slug = createSlug(division.name as string);
  division.slug = slug;
  next();
});

const Division = mongoose.model('division', divisionSchema);

export default Division;
