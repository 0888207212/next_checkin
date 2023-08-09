"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";

export default function Home() {
  const user = useAppSelector((state) => state.authReducer.value);

  const router = useRouter();

  useEffect(() => {
    if (user.user?.role === "Admin") {
      return router.push("/checkin-management");
    }
    return router.push("/checkin");
  }, []);
}
