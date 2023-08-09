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
import { Dropdown, Navbar } from "flowbite-react";

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
    <Navbar fluid rounded>
      <Navbar.Toggle />
      <Navbar.Brand>
        <Link href="/">
          <Image src="/vmo-logo.png" alt="logo-vmo" width="150" height="100" />
        </Link>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          inline
          label={
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
          }
        >
          <Dropdown.Item>
            <div className="max-md:hidden px-3 py-1">
              <strong>{user.user?.full_name || "Nguyễn Văn A"}</strong>
            </div>
          </Dropdown.Item>
          <Dropdown.Item>
            <div className="hover:bg-[#F5F5F5] px-3 py-1 cursor-pointer">
              Thông tin hồ sơ
            </div>
          </Dropdown.Item>
          <Dropdown.Item>
            <div
              className="hover:bg-[#F5F5F5] px-3 py-1 cursor-pointer"
              onClick={onHandleLogout}
            >
              Đăng xuất
            </div>
          </Dropdown.Item>
        </Dropdown>
      </div>
      <Navbar.Collapse>
        {renderNavLinks &&
          renderNavLinks.map((link) => {
            const isActive = pathname === link.url;
            return (
              <Link
                className={`text-sm sm:text-xl font-semibold hover:text-[#FBE9E7] sm:hover:text-[#FF3D00] max-md:hover:bg-[#607D8B] max-md:dark:text-black max-md:dark:hover:text-white max-md:dark:hover:bg-[#a3d69f] max-md:dark:bg-red px-8 py-2 max-md:dark:hover:text-white" ${
                  isActive
                    ? "text-[#FBE9E7] sm:text-[#FF3D00] !max-md:text-white max-md:bg-[#607D8B]"
                    : "text-black max-md:text-black max-md:bg-gray-100 "
                }`}
                href={link.url}
                key={link.url}
              >
                {link.label}
              </Link>
            );
          })}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
