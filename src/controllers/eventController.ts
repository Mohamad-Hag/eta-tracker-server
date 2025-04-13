import {
  createEvent,
  getEvent,
  getEventJoiners,
  isGuestInEvent,
  joinEvent,
} from "../services/eventService";

export const createEventController = async (req: any, res: any) => {
  try {
    const { name, event_date, location, guest_id, guest_name, guest_avatar } =
      req.body;
    if (!guest_id)
      return res.status(400).json({ error: "Guest ID is required" });
    const newEvent = await createEvent(
      name,
      event_date,
      location,
      guest_avatar,
      guest_id,
      guest_name
    );
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
};

export const getEventJoinersController = async (req: any, res: any) => {
  try {
    const { eventId } = req.params;
    console.log("eventId", req.params);
    const joiners = await getEventJoiners(eventId);
    res.status(200).json(joiners);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event joiners" });
  }
};

export const joinEventController = async (req: any, res: any) => {
  try {
    const { eventId } = req.params;
    const { guest_id, socket_id } = req.body;
    const joiner = await joinEvent(eventId, guest_id, socket_id);
    res.status(201).json(joiner);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to join event" });
  }
};

export const getEventController = async (req: any, res: any) => {
  try {
    const { eventId } = req.params;
    const event = await getEvent(eventId);
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

export const isGuestInEventController = async (req: any, res: any) => {
  try {
    const { guestId } = req.params;
    const isGuestEvent = await isGuestInEvent(guestId);
    res.status(200).json({ isGuestInEvent: isGuestEvent });
  } catch (error) {
    res.status(500).json({ error: "Failed to check if guest is in event" });
  }
};
