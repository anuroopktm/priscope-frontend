"use client";

// import { io, Socket } from "socket.io-client";
import { INTERNAL_API_BASE_PATH } from "../constants/app.constants";
import { logger } from "./logger";

let socket: WebSocket | null = null;
let isConnecting = false;

// Fetch access token from your API
async function fetchAccessToken(): Promise<string> {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_PATH}/token`);
    if (!res.ok) throw new Error(`Unauthorized: ${res.status}`);

    const data = await res.json();
    if (!data?.accessToken) throw new Error("No access token returned");

    return data.accessToken;
  } catch (err) {
    logger.error(`Failed to fetch access token: ${err}`);
    throw err;
  }
}

// Create and connect socket
async function createWebSocket(): Promise<WebSocket> {
  const token = await fetchAccessToken();

  const wsUrl = new URL(process.env.NEXT_PUBLIC_SOCKET_URL!);
  wsUrl.searchParams.append("token", token);

  const ws = new WebSocket(wsUrl.toString());

  ws.onopen = () => {
    logger.info("✅ WebSocket connected");
  };

  ws.onclose = (event) => {
    logger.warn(`WebSocket closed:${event.reason}`);
    // optional: implement auto-reconnect logic here
  };

  ws.onerror = (err) => {
    logger.error(`WebSocket error: ${err}`,);
  };

  return new Promise((resolve, reject) => {
    ws.onopen = () => resolve(ws);
    ws.onerror = (err) => reject(err);
  });
}

/**
 * Singleton getter for WebSocket connection
 */
export const getSocket = async (): Promise<WebSocket> => {
  if (socket && socket.readyState === WebSocket.OPEN) return socket;

  if (isConnecting) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          clearInterval(check);
          resolve(socket);
        }
      }, 50);
    });
  }

  isConnecting = true;
  try {
    socket = await createWebSocket();
    return socket;
  } finally {
    isConnecting = false;
  }
};

export function disconnectSocket() {
  if (socket) {
    logger.info("Closing WebSocket connection...");
    socket.close(1000, "User logout"); // 1000 = normal closure
    socket = null;
  }
}
