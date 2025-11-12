import { UserControllers } from './user.controller';
import { UserUpdateZodSchema, UserZodSchema } from './user.validate';
import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from './user.interface';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the provided data
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - name
 *                - email
 *                - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nayem
 *               email:
 *                 type: string
 *                 example: nayem@example.com
 *               password:
 *                 type: string
 *                 example: E35#fvdf@
 *               phone:
 *                 type: string
 *                 example: +8801783000000
 *               address:
 *                 type: string
 *                 example: "Dhaka, Bangladesh"
 *
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post(
  '/register',
  validateRequest(UserZodSchema),
  UserControllers.createUser
);

/**
 * @swagger
 * /api/v1/user/get-users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 66b2e6f63a12
 *                   name:
 *                     type: string
 *                     example: Nayem
 */
router.get(
  '/get-users',
  checkAuth(...Object.values(Role)),
  UserControllers.allUsers
);

/**
 * @swagger
 * /api/v1/user/{userId}:
 *   patch:
 *     summary: Update a user
 *     description: Update user details by user ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.patch(
  '/:userId',
  validateRequest(UserUpdateZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

router.get('/', checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get(
  '/:userId',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getSingleUser
);

export const UserRoute = router;
