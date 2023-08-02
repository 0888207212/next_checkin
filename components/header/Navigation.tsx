"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { deleteCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import styles from "./styles.module.css";
import apiAuth from "@/api/auth";
import { logOut } from "@/redux/features/auth-slice";

const Navigation = () => {
  const user = useAppSelector((state) => state.authReducer.value);

  const [navLinks] = useState([
    {
      label: "Chấm công",
      url: "/checkin",
      role: "User",
    },
    {
      label: "Danh sách chấm công",
      url: "/checkin-list",
      role: "User",
    },
    {
      label: "Quản lí chấm công",
      url: "/checkin-management",
      role: "Admin",
    },
  ]);

  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const pathname = usePathname();

  const renderNavLinks = useMemo(() => {
    if (!user.isAuth) return;
    const roleUser = "User";

    if (user.user?.role === roleUser) {
      return navLinks.filter((nav) => {
        if (nav.role === roleUser) {
          return { ...nav };
        }
      });
    }

    return navLinks;
  }, [user, navLinks]);

  const [showMenu, setShowMenu] = useState(false);

  const onHandleLogout = async () => {
    try {
      const response = await apiAuth.logout();
      if (response.status === 200) {
        dispatch(logOut());
        deleteCookie("access_token");
        router.push("/login");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <nav>
      <div className="flex flex-wrap items-center justify-between mx-auto h-32">
        <Link href="/">
          <Image src="/vmo-logo.png" alt="logo-vmo" width="150" height="100" />
        </Link>
        <div className="">
          <div className=" w-full" id="navbar-hamburger">
            <ul className="flex md:gap-28 max-md:hidden">
              {renderNavLinks &&
                renderNavLinks.map((link) => {
                  const isActive = pathname === link.url;

                  return (
                    <Link
                      className={`text-xl font-semibold hover:text-[#fe4f18] ${
                        isActive ? "text-[#fe4f18]" : "text-black"
                      }`}
                      href={link.url}
                      key={link.url}
                    >
                      {link.label}
                    </Link>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className={styles.info_user}>
          <Image
            src={
              user.user?.avatar_url ||
              "https://phongchongluadao.vn/images/avatar.png"
            }
            alt="avatar-user"
            width="50"
            height="50"
            className="rounded-full"
          />
          <span>{user.user?.full_name || "Nguyễn Văn A"}</span>
          <div className={styles.dropdown_info_user}>
            <div className="hover:bg-[#F5F5F5] px-3 py-1">Thông tin hồ sơ</div>
            <div
              className="hover:bg-[#F5F5F5] px-3 py-1"
              onClick={onHandleLogout}
            >
              Đăng xuất
            </div>
          </div>
        </div>
        <button onClick={() => setShowMenu(!showMenu)} data-collapse-toggle="navbar-hamburger" type="button" className="md:hidden inline-flex items-center justify-center p-2 w-10 h-10 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-hamburger" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
        {showMenu && (
        <div className="w-full" id="navbar-hamburger">
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50">
            {renderNavLinks &&
              renderNavLinks.map((link) => {
                const isActive = pathname === link.url;

                return (
                  <Link
                    className={`hover:bg-[#1C64F2] dark:text-black dark:hover:text-white dark:hover:bg-[#a3d69f] dark:bg-red px-8 py-2 dark:hover:text-white" ${
                      isActive ? "!text-white bg-[#1C64F2]" : "text-black bg-gray-100 " 
                    }`}
                    href={link.url}
                    key={link.url}
                  >
                    {link.label}
                  </Link>
                );
              })}
          </ul>
        </div>
        )}
      </div>
    </nav>

  );
};

export default Navigation;
