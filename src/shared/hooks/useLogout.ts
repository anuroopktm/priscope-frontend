"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "@bprogress/next/app";
import useTranslation from "@/shared/hooks/useTranslation";
import { useLogout as useLogoutMutation } from "@/app/[lang]/(unprotected)/auth/services/authService";
import { logger } from "@/shared/utils/logger";
import { disconnectSocket } from "../utils/socket.client";
import { useProgressStore } from "../store/progress.store";

export default function useLogout() {
  const router = useRouter();
  const { lang } = useTranslation();
  const { mutateAsync: logoutMutation } = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutMutation();
    } catch (error) {
      logger.error(`Error while loggin out. ${error}`);
    }

     try {
      disconnectSocket();
      useProgressStore.getState().clearEvents();
    } catch (err) {
      logger.warn(`Failed to clean up socket or store: ${err}`);
    }

    await signOut({ redirect: false });
    router.push(`/${lang}/auth/signin`);
    router.refresh();
  };

  return { logout };
}
