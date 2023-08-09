"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import apiAuth from "@/api/auth";
import { logIn } from "@/redux/features/auth-slice";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("../header"), { ssr: false });
const Footer = dynamic(() => import("../footer"), { ssr: false });

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const pathname = usePathname();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await apiAuth.getUser();
      if (response.status === 200) {
        dispatch(logIn(response.data.user));
        if (response.data.user.status === "Draft") {
          router.push("/complete-profile");
        }
        if (pathname === "/login") {
          router.push("/");
        }
      }
    } catch (error: any) {
      console.log("error", error);
      router.push("/login");
    }
  };

  return (
    <div>
      {pathname !== "/login" && <Header />}
      {children}
      {pathname !== "/login" && <Footer />}
    </div>
  );
}
