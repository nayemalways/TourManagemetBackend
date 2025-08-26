import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { authRoutes } from "../auth/auth.route";
import { DivisionRouter } from "../modules/division/division.routes";

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
    }
]


moduleRoutes.forEach((r) => {
    router.use(r.path, r.route)
});

