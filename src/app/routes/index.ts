import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { authRoutes } from "../auth/auth.route";
import { DivisionRouter } from "../modules/division/division.routes";
import { tourRouter } from "../modules/tour/tour.routes";

export const router = Router();


const moduleRoutes = [
    {
        path: '/user',
        route: UserRoute
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/division',
        route: DivisionRouter
    },
    {
        path: '/tour',
        route: tourRouter
    }
]


moduleRoutes.forEach((r) => {
    router.use(r.path, r.route)
});

