import { Router } from "express";
import { checkAuth } from "../../middlewares/auth.middleware";
import { Role } from "../user/user.interface";
import { divisionController } from "./division.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { DivisionZodSchema, UpdateDivisionZodSchema } from "./division.validation";


const router = Router();

router.post('/create', validateRequest(DivisionZodSchema), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionController.createDivision);
router.get('/', divisionController.getDivision);
router.patch('/:id', validateRequest(UpdateDivisionZodSchema), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionController.updateDivision);
router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionController.deleteDivision);


export const DivisionRouter = router;