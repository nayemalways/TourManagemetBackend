import { Router } from 'express';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from '../user/user.interface';
import { divisionController } from './division.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  DivisionZodSchema,
  UpdateDivisionZodSchema,
} from './division.validation';
import {multerUpload} from "../../config/multer.config";

const router = Router();

router.post(
  '/create',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single('file'),
  validateRequest(DivisionZodSchema),
  divisionController.createDivision
);
router.get('/', divisionController.getDivision);
router.patch(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single('file'),
  validateRequest(UpdateDivisionZodSchema),
  divisionController.updateDivision
);
router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.deleteDivision
);

export const DivisionRouter = router;
