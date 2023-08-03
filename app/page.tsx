"use client";

import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useAppSelector((state) => state.authReducer.value);

  const router = useRouter();

  if (user.user?.role === "Admin") {
    return router.push("/checkin-management");
  }
  router.push("/checkin");
}
