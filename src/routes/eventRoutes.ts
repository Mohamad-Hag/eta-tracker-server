import { Router } from "express";
import {
  createEventController,
  getEventController,
  getEventJoinersController,
  isGuestInEventController,
  joinEventController,
} from "../controllers/eventController";
import { leaveEventController } from "../controllers/leaveEventController";

const router = Router();

router.post("/create", createEventController);
router.post("/join/:eventId", joinEventController);
router.post("/leave/:eventId", leaveEventController);
router.get("/joiners/:eventId", getEventJoinersController);
router.get("/:eventId", getEventController);
router.get("/isGuestInEvent/:guestId", isGuestInEventController);

export { router as eventRoutes };
