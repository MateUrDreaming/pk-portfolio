import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";

export const getServerSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});