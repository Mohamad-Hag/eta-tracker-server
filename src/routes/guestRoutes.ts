import { Router } from "express";
import { createGuestController } from "../controllers/guestController";

const router = Router();

router.post('/create', createGuestController);

export { router as guestRoutes };