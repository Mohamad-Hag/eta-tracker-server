import { updateLocation } from "../services/locationService";

export const updateLocationController = async (req: any, res: any) => {
  try {
    const { location, guest_id, event_id, socket_id, transport_mode } =
      req.body;
    const updatedLocation = await updateLocation(
      guest_id,
      event_id,
      location,
      socket_id,
      transport_mode
    );
    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(500).json({ error: "Failed to update location" });
  }
};
