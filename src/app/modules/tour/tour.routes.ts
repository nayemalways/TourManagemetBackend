import { Router } from "express";
import { tourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/auth.middleware";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { TourTypesZodScehma, TourZodScehma, UpdateTourZodScehma } from "./tour.validate";

const router = Router();

router.post('/create-tour-type', validateRequest(TourTypesZodScehma), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.createTourType);
router.get('/tour-type', tourControllers.getTourType);
router.patch('/tour-type/:id', validateRequest(TourTypesZodScehma), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.updateTourType);
router.delete('/tour-type/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.deleteTourType);
router.post('/create', validateRequest(TourZodScehma), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.createTour);
router.get('/',  tourControllers.retriveAllTours);
router.patch('/:id', validateRequest(UpdateTourZodScehma), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.updateTours);
router.delete('/:id',  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.deleteTours);



export const tourRouter = router;