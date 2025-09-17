import AppError from '../errorHelpers/AppError';
import httpStatus from 'http-status-codes';

export const createSlug = (title: string) => {
  if (!title) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Title not found in Slug Generator'
    );
  }

  const slug = title.toLowerCase().split(' ').join('-');
  return slug;
};
