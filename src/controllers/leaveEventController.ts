import { leaveEvent } from "../services/eventService";

export const leaveEventController = async (req: any, res: any) => {
  try {
    const { eventId } = req.params;
    const { guest_id } = req.body;
    await leaveEvent(eventId, guest_id);
    res.status(200).json({ message: "Left event successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to leave event" });
  }
};
