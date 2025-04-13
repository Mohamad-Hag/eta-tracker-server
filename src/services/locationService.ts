import { calculateETA } from "../utils/calculateETA";
import checkTimingStatus from "../utils/checkTimingStatus";
import { parseLocationString } from "../utils/parseLocationString";
import SocketManager from "../utils/SocketManager";
import supabase from "../utils/supabaseClient";
import { getEvent } from "./eventService";

export const updateLocation = async (
  guestId: string,
  eventId: string,
  location: string,
  socketId: string
) => {
  try {
    const loc = parseLocationString(location);
    console.log("Location updated from client:", loc);

    const event = await getEvent(eventId);
    if (!event) throw new Error("Event not found");

    const eventLocation = parseLocationString(event.location);
    const eta = await calculateETA(loc, eventLocation);

    if (!eta || !eta.duration) {
      console.error(`Failed to calculate ETA for guest: ${guestId}`);
      return;
    }

    const { isLate, lateAmount, isEarly, earlyAmount } = checkTimingStatus(
      eta.duration,
      event.event_date,
      5 // Early threshold in minutes
    );

    // ✅ New status logic
    let status = "On Time";
    if (eta.duration === 0) status = "Arrived";
    else if (isLate) status = lateAmount > 15 ? "Very Late" : "Late";
    else if (isEarly) status = earlyAmount > 900 ? "Very Early" : "Early"; // 15 min

    const updatedJoiner = {
      eta: eta.duration,
      location,
      status,
    };

    // ✅ Fetch current status from DB
    const { data: currentJoiner, error } = await supabase
      .from("event_joiners")
      .select("*")
      .eq("event_id", eventId)
      .eq("guest_id", guestId);

    const joiner = currentJoiner?.[0];
    if (!joiner)
      throw new Error(`The guest ${guestId} is not in the event ${eventId}`);

    if (error) {
      console.error("Error fetching event_joiner:", error);
      throw new Error("Failed to fetch joiner data");
    }

    // ✅ Avoid unnecessary update
    if (
      joiner?.eta === eta.duration &&
      joiner?.location === location &&
      joiner?.status === status
    ) {
      console.log(`No changes detected for guest ${guestId}, skipping update.`);
      return;
    }

    const { error: updateError } = await supabase
      .from("event_joiners")
      .update(updatedJoiner)
      .eq("event_id", eventId)
      .eq("guest_id", guestId);

    if (updateError) {
      console.error("Error updating event_joiner:", updateError);
      throw new Error("Failed to update joiner data");
    }

    // ✅ Emit to WebSocket clients with full info
    SocketManager.emitToRoom(`event-${eventId}`, "etaUpdated", {
      guestId,
      location,
      eta: eta.duration,
      status,
      late: {
        isLate,
        amount: lateAmount,
      },
      early: {
        isEarly,
        amount: earlyAmount,
      },
    });

    console.log(`ETA updated for guest ${guestId} in event ${eventId}`);
    return {
      location,
      guest_id: guestId,
      event_id: eventId,
      eta,
    };
  } catch (error) {
    console.error("Error in updateLocation:", error);
    throw new Error("An error occurred while updating location.");
  }
};
