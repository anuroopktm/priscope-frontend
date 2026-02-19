import { create } from "zustand";
import { ProgressEvent } from "../types/progress.types";

type ProgressState = {
  events: ProgressEvent[];
  addEvent: (event: ProgressEvent, ttl?: number) => void;
  removeEvent: (id: string) => void;
  clearEvents: () => void;
};

function scheduleRemoval(
  id: string,
  ttl: number,
  removeEvent: (id: string) => void
) {
  return setTimeout(() => removeEvent(id), ttl);
}

function getEventId(event: ProgressEvent): string {
  return event.upload_id || event.export_id || "";
}


export const useProgressStore = create<ProgressState>((set, get) => {
  const timers = new Map<string, NodeJS.Timeout>();

  const removeEvent = (id: string) => {
    if (timers.has(id)) {
      clearTimeout(timers.get(id));
      timers.delete(id);
    }
    set((state) => ({
      events: state.events.filter((e) => getEventId(e) !== id),
    }));
  };

  return {
    events: [],

    addEvent: (event, ttl = 5000) => {
      // clear old timer if re-added

      const id = getEventId(event);

      if (timers.has(id)) {
        clearTimeout(timers.get(id));
        timers.delete(id);
      }

      set((state) => ({
        events: [...state.events.filter((e) => getEventId(e) !== id), event],
      }));

      // schedule removal
      if (event.status === "processed" || event.status === "processed_failed") {
        const timer = scheduleRemoval(id, ttl, removeEvent);
        timers.set(id, timer);
      }
    },

    removeEvent,

    clearEvents: () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
      set({ events: [] });
    },
  };
});
