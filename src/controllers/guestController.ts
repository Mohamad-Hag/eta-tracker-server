import { createGuest } from "../services/guestService";

export const createGuestController = async (req: any, res: any) => {
  try {
    const { guest_id, name, avatar } = req.body;
    const newGuest = await createGuest(guest_id, name, avatar);
    res.status(201).json(newGuest);
  } catch (error) {
    res.status(500).json({ error: "Failed to create guest" });
  }
};
