import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/napravleniya/")({
  beforeLoad: () => {
    throw redirect({ to: "/poliklinika", replace: true });
  },
});
