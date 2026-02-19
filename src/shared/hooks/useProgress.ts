"use client";

import { useEffect } from "react";
import { getSocket } from "../utils/socket.client";
import { useProgressStore } from "../store/progress.store";
import { ProgressEvent } from "../types/progress.types";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { logger } from "../utils/logger";

const REVALIDATE_CONFIGS = [
  {
    type: "upload_progress",
    status: "processed",
    action: "freight_rate",
    routePrefix: "/freight-rate-library",
    queries: ["listFreightRates"],
  },
  {
    type: "upload_progress",
    status: "processed",
    action: "tariff_rate",
    routePrefix: "/tariff-rate-library",
    queries: ["pagedData"],
  },
];

function handleRevalidate(
  data: ProgressEvent,
  queryClient: ReturnType<typeof useQueryClient>,
  pathname: string
) {
  for (const config of REVALIDATE_CONFIGS) {
    const matches =
      data.type === config.type &&
      data.status === config.status &&
      data.action === config.action &&
      pathname.includes(config.routePrefix);

    if (matches) {
      config.queries.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key], exact: false });
      });
    }
  }
}

export function useProgress() {
  const addEvent = useProgressStore((s) => s.addEvent);
  const queryClient = useQueryClient();
  const pathname = usePathname();

  useEffect(() => {
    let ws: WebSocket | null = null;
    let isMounted = true;

    const setupWebSocket = async () => {
      try {
        ws = await getSocket();

        ws.onmessage = (event) => {
          if (!isMounted) return;

          const data: ProgressEvent = JSON.parse(event.data);
          addEvent(data);
          handleRevalidate(data, queryClient, pathname);
        };
      } catch (err) {
        logger.error(`Failed to connect WebSocket: ${err}`);
      }
    };

    setupWebSocket();

    return () => {
      isMounted = false;
    };
  }, [addEvent, queryClient, pathname]);
}
