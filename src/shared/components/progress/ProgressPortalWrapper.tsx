"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ProgressPortal from "./ProgressPortal";
import { useProgress } from "@/shared/hooks/useProgress";

export default function ProgressPortalWrapper() {
  const [mounted, setMounted] = useState(false);
  useProgress();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(<ProgressPortal />, document.body);
}
