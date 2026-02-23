import { Suspense } from "react";
import { MatchClient } from "./match-client";
import { LoadingOverlay } from "../LoadingOverlay";

export default function MatchPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <MatchClient />
    </Suspense>
  );
}
