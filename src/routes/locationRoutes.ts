import { Router } from "express";
import { updateLocationController } from "../controllers/locationController";

const router = Router();

router.post("/update", updateLocationController);

export { router as locationRoutes };
