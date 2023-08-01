"use client";

import Image from "next/image";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

import { AppDispatch } from "@/redux/store";
import { logIn } from "@/redux/features/auth-slice";
import apiAuth from "@/api/auth";
import { showToastMessage } from "@/utils/helper";

const LoginUserPage = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (accessToken: string) => {
    try {
      const payload = {
        access_token: accessToken,
      };
      const response = await apiAuth.login(payload);
      if (response.status === 200) {
        showToastMessage("Đăng nhập thành công", "success");
        setCookie("access_token", response.data.token, {
          maxAge: 60 * 60 * 24 * 10,
        });
        dispatch(logIn(response.data.user));

        if (response?.data && response?.data?.user?.status === "Draft") {
          return router.push("/complete-profile");
        }
        return router.push("/");
      }
    } catch (error) {
      showToastMessage("Đăng nhập thất bại", "error");
      console.log("error", error);
    }
  };

  const onHandleLogin = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      handleLogin(credentialResponse.access_token);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  return (
    <div className="flex justify-center mt-20">
      <div className="px-16 py-10 w-[400px] text-center bg-white border">
        <Image
          src="/vmo-logo.png"
          alt="logo-vmo"
          width="200"
          height="100"
          className="mx-auto mb-5"
        />
        <div className="font-semibold">Đăng nhập để checkin</div>
        <div className="w-[100px] h-[100px] mx-auto mt-5">
          <Image
            src="/icon-google.svg"
            alt="icon-google"
            width="90"
            height="90"
            className="mx-auto cursor-pointer hover:w-[100px] hover:h-[100px] text-red-700"
            onClick={() => onHandleLogin()}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginUserPage;
