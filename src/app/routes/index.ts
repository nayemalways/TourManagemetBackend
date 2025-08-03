import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { authRoutes } from "../auth/auth.route";

export const router = Router();


const moduleRoutes = [
    {
        path: '/user',
        route: UserRoute
    },
    {
        path: '/auth',
        route: authRoutes
    }
]


moduleRoutes.forEach((r) => {
    router.use(r.path, r.route)
});

