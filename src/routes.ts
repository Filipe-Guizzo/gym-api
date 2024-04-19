import { Router } from "express";
import Token from "./auth/token";
import UserController from "./controllers/UserController";
import GymController from "./controllers/GymController";
import CheckinController from "./controllers/CheckinController";

const router: Router = Router();

router.get('/users', Token.authenticateToken ,UserController.index);
router.post('/users', UserController.store);
router.get('/users/:id', UserController.show);
router.post('/login', UserController.login);

router.get('/gyms', Token.authenticateToken ,GymController.index);
router.post('/gyms', Token.authenticateToken ,GymController.store);
router.get('/gyms/search', Token.authenticateToken ,GymController.findByName);

router.post('/checkins', Token.authenticateToken ,CheckinController.store);
router.get('/checkins/user/:id', Token.authenticateToken ,CheckinController.findByIdUser);

export default router;