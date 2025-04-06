import SocketManager from "../utils/SocketManager";
import supabase from "../utils/supabaseClient";
import { createGuest } from "./guestService";

export const createEvent = async (
  name: string,
  eventDate: string,
  location: string,
  guestId: string,
  guestName: string
) => {
  // Create guest if not already exists
  await createGuest(guestId, guestName);
  // Check if guest is already in an event
  const isGuestEvent = await isGuestInEvent(guestId);
  if (isGuestEvent)
    throw new Error(
      "You are already in an event, leave from the current event first"
    );

  // Create event with guest
  const { data, error } = await supabase
    .from("events")
    .insert([{ name, location, event_date: eventDate, created_by: guestId }])
    .select("*")
    .single();
  console.log("error", error);

  if (error) throw new Error(error.message);
  return data;
};

export const getEventJoiners = async (eventId: string) => {
  const { data, error } = await supabase
    .from("event_joiners")
    .select("*")
    .eq("event_id", eventId);

  if (error) throw new Error(error.message);
  for await (const joiner of data) {
    const { data: guest, error: guestError } = await supabase
      .from("guests")
      .select("*")
      .eq("id", joiner.guest_id)
      .single();

    if (guestError) throw new Error(guestError.message);

    joiner.guest = guest;
  }

  return data;
};

export const joinEvent = async (
  eventId: string,
  guestId: string,
  socketId: string
) => {
  const { data, error } = await supabase
    .from("event_joiners")
    .upsert([{ event_id: eventId, guest_id: guestId }], {
      onConflict: "event_id,guest_id",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  const guest = await supabase
    .from("guests")
    .select("*")
    .eq("id", guestId)
    .single();

  // Join event room & notify other users
  SocketManager.joinRoom(socketId, `event-${eventId}`);
  SocketManager.emitToRoom(`event-${eventId}`, "userJoined", {
    guest: guest.data,
    eventId,
  });
  console.log(`Socket ${socketId} joined event ${eventId}`);

  return { guestId, eventId };
};

export const leaveEvent = async (eventId: string, guestId: string) => {
  const { data, error } = await supabase
    .from("event_joiners")
    .delete()
    .eq("event_id", eventId)
    .eq("guest_id", guestId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  const { data: leftGuest, error: leftGuestError } = await supabase
    .from("guests")
    .select("*")
    .eq("id", guestId)
    .single();
  if (leftGuestError) throw new Error(leftGuestError.message);

  SocketManager.emitToRoom(`event-${eventId}`, "userLeft", {
    guest: leftGuest,
  });
  console.log("[Current Rooms]", SocketManager.getIO().sockets.adapter.sids);

  return data;
};

export const getEvent = async (eventId: string) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const isGuestInEvent = async (guestId: string) => {
  const { data, error } = await supabase
    .from("event_joiners")
    .select("*")
    .eq("guest_id", guestId);

  if (error) throw new Error(error.message);

  const isGuestInEvent = data.length > 0;
  return isGuestInEvent;
};
