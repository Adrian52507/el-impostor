import { Suspense } from "react";
import { PlayClient } from "./play-client";
import { LoadingOverlay } from "../LoadingOverlay";

export default function PlayPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <PlayClient />
    </Suspense>
  );
}
