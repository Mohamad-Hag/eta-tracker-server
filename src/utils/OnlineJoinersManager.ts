import { leaveEvent } from "../services/eventService";

class OnlineJoinersManager {
  private onlineJoinersPerEvent: Map<string, Set<string>> = new Map();
  private disconnectTimers = new Map<string, NodeJS.Timeout>(); // key: eventId-guestId

  constructor() {
    this.onlineJoinersPerEvent = new Map();
  }

  addJoiner(eventId: string, guestId: string) {
    if (!this.onlineJoinersPerEvent.has(eventId))
      this.onlineJoinersPerEvent.set(eventId, new Set());
    this.onlineJoinersPerEvent.get(eventId)!.add(guestId);

    // If guest is already in the event, and reconnecting again, clear the disconnect timer related to him.
    const key = `${eventId}-${guestId}`;
    if (this.disconnectTimers.get(key)) {
      clearTimeout(this.disconnectTimers.get(key));
      this.disconnectTimers.delete(key);
      console.log(`Timeout cleared for ${guestId} in event ${eventId}`);
    }
  }

  scheduleRemoveGuest(eventId: string, guestId: string, delay = 15000) {
    const key = `${eventId}-${guestId}`;

    // Prevent duplicate timers
    if (this.disconnectTimers.has(key)) return;

    const timeout = setTimeout(async () => {
      try {
        // Remove from in-memory store
        this.removeJoiner(eventId, guestId);

        // Remove from DB
        await leaveEvent(eventId, guestId);
      } catch (err) {
        console.error(
          `[AutoRemove][${eventId}] Failed to remove guest ${guestId}:`,
          err
        );
      } finally {
        // Cleanup timer reference
        this.disconnectTimers.delete(key);
      }
    }, delay);

    // Store the timer for future reference
    this.disconnectTimers.set(key, timeout);
  }

  removeJoiner(eventId: string, guestId: string) {
    if (this.onlineJoinersPerEvent.has(eventId)) {
      const guests = this.onlineJoinersPerEvent.get(eventId)!;
      guests.delete(guestId);
      if (guests.size === 0) this.onlineJoinersPerEvent.delete(eventId);
    }

    const key = `${eventId}-${guestId}`;
    if (this.disconnectTimers.has(key)) {
      clearTimeout(this.disconnectTimers.get(key)!);
      this.disconnectTimers.delete(key);
    }
  }

  isJoinerOnline(eventId: string, guestId: string): boolean {
    return (
      this.onlineJoinersPerEvent.has(eventId) &&
      this.onlineJoinersPerEvent.get(eventId)!.has(guestId)
    );
  }

  getOnlineJoiners(eventId: string): string[] {
    return Array.from(this.onlineJoinersPerEvent.get(eventId) || []);
  }

  removeAllJoinersFromEvent(eventId: string) {
    const joinerIds = this.onlineJoinersPerEvent.get(eventId);

    if (joinerIds) {
      for (const guestId of joinerIds) {
        const key = `${eventId}-${guestId}`;
        if (this.disconnectTimers.has(key)) {
          clearTimeout(this.disconnectTimers.get(key)!);
          this.disconnectTimers.delete(key);
        }
      }
    }

    this.onlineJoinersPerEvent.delete(eventId);
  }
}

const onlineJoinersManager = new OnlineJoinersManager();
export default onlineJoinersManager;
