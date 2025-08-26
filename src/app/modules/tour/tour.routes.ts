import { Router } from "express";
import { tourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/auth.middleware";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { TourTypesZodScehma } from "./tour.validate";

const router = Router();

router.post('/create-tour-type', validateRequest(TourTypesZodScehma), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.createTourType)
router.get('/tour-type', tourControllers.getTourType)
router.patch('/tour-type/:id', validateRequest(TourTypesZodScehma), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.updateTourType)
router.delete('/tour-type/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.deleteTourType)

export const tourRouter = router;