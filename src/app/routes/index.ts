import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";

export const router = Router();


const moduleRoutes = [
    {
        path: '/user',
        route: UserRoute
    }
]


moduleRoutes.forEach((r) => {
    router.use(r.path, r.route)
});

