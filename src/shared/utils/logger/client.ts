// utils/logger/client.ts
import type { LoggerInterface } from "../../types/logger";
import { INTERNAL_API_BASE_PATH } from "@/shared/constants/app.constants";

const createClientLogger = (): LoggerInterface => {
  const send = (level: string, msg: any) => {
    try {
      const blob = new Blob([JSON.stringify({ msg, level })], {
        type: "application/json",
      });
      navigator.sendBeacon(`${INTERNAL_API_BASE_PATH}/log`, blob);
    } catch (error) {
      console.error("Failed to send log to server:", error);
      switch (level) {
        case "info": console.info(msg); break;
        case "debug": console.debug(msg); break;
        case "warn": console.warn(msg); break;
        case "error": console.error(msg); break;
        default: console.log(msg);
      }
    }
  };

  return {
    info: (msg: any) => send("info", msg),
    debug: (msg: any) => send("debug", msg),
    warn: (msg: any) => send("warn", msg),
    error: (msg: any) => send("error", msg),
  };
};

export const logger = createClientLogger();
