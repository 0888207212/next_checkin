"use client";

import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useLocation } from "@/hook/useLocation";
import { AppDispatch, useAppSelector } from "@/redux/store";
import apiCheckIn from "@/api/checkin";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateUserCheckin,
  updateUserCheckout,
} from "@/redux/features/auth-slice";
import { GetAllLocation } from "@/interfaces/location";
import { showToastMessage } from "@/utils/helper/index";
import apiLocation from "@/api/geo-location";
import Loading from "@/components/loading/index";
import Link from "next/link";
import GoogleMaps from "@/components/GoogleMap/GoogleMap";

// const Map = dynamic(() => import("@/components/map/map"), { ssr: false });

const Checkin = () => {
  const { lat, lng } = useLocation();
  const [date, setDate] = useState("");
  const [location, setLocation] = useState<GetAllLocation>();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector((state) => state.authReducer.value);

  let statusCheck: number = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    }, 1000);
    if (lat && lng) {
      getLocation();
    }

    return () => clearInterval(interval);
  }, [lat, lng]);

  const getLocation = async () => {
    const coordinates = {
      lat: lat,
      lng: lng,
    };
    try {
      setIsLoading(true);
      const res = await apiLocation.getLocation(coordinates);
      if (res.status === 200) {
        setLocation(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    const formCheckIn = {
      check: {
        user_id: user?.user?.id,
        check_in_time: date,
        check_in_lat: location?.lat,
        check_in_lng: location?.lon,
        check_in_location: location?.display_name,
      },
    };

    try {
      setIsLoading(true);
      const res = await apiCheckIn.checkIn(formCheckIn);
      if (res.status === 200) {
        statusCheck = res.data.status;
        if (statusCheck === 1) {
          dispatch(updateUserCheckout());
          showToastMessage("Checkout Success", "success");
        } else showToastMessage("Checkin Success", "success");
        dispatch(updateUserCheckin());
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative 2xl:min-h-[735px] max-h-full overflow-auto pt-8 pb-20 sm:py-12  dark:bg-gray-800 flex items-center">
      <div className="container mx-4 sm:mx-auto flex flex-row max-sm:flex-col justify-between items-start z-0">
        <div className="w-full mb-4 sm:w-full sm:mx-3">
          <GoogleMaps
            lat={location ? location?.lat : ""}
            lng={location ? location?.lon : ""}
            info={location ? location?.display_name : ""}
            style={
              "w-full h-[600px] sm:h-[600px] md:h-[400px] xl:h-[500px]  2xl:h-[600px] rounded-lg shadow-md z-0 relative"
            }
          />
          <div className="flex flex-col w-[80%] md:w-1/3 lg:w-1/3 2xl:w-1/4 absolute right-[10%] md:right-[35%] xl:right-[34%] 2xl:right-[38%] bottom-14 md:bottom-[3%] lg:bottom-[5%] 2xl:bottom-[5%] z-10 bg-[#FAFAFA] rounded-lg shadow-md p-3">
            <div className="flex flex-col px-2">
              <p className="font-bold text-[#F4511E] text-base sm:text-md mb-3 sm:mb-6 md:mb-3">
                CheckIn Now
              </p>
              <div className="flex flex-row items-center mb-2 sm:mb-5 md:mb-3 gap-3">
                <svg
                  className="w-5 h-5 sm:h-8 sm:w-8 md:w-6 md:h-6 text-[#F9A825]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <circle cx="12" cy="12" r="10" />{" "}
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="font-bold text-[#555540] text-sm sm:text-md">
                  {date ? date : ""}
                </span>
              </div>
              <div className="flex flex-row items-center gap-3">
                <div>
                  <svg
                    className="w-5 h-5 sm:h-8 sm:w-8 md:w-6 md:h-6 text-[#FF3D00]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-[#555540] text-sm sm:text-md">
                  {location
                    ? `${location?.display_name}`
                    : "Vị trí của bạn chưa được bật"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                style={!location ? { display: "none" } : {}}
                className={`linear flex flex-row items-center rounded-xl px-5 py-3 sm:px-8 sm:py-4 text-white transition duration-200 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 font-bold text-sm sm:text-md" ${
                  user?.user?.is_checkin_today && !user?.user?.is_checkout
                    ? "bg-[#FF5722] hover:bg-[#D84315] active:bg-[#FF3D00]"
                    : !user?.user?.is_checkin_today && !user?.user?.is_checkout
                    ? "bg-green-500  hover:bg-green-600 active:bg-green-700 dark:bg-green-400"
                    : user?.user?.is_checkin_today && user?.user?.is_checkout
                    ? "bg-green-500"
                    : ""
                }`}
                disabled={
                  user?.user?.is_checkin_today && user?.user?.is_checkout
                    ? true
                    : false
                }
                data-ripple-light
                onClick={() => handleCheckIn()}
              >
                {user?.user?.is_checkin_today && !user?.user?.is_checkout
                  ? "Check out"
                  : !user?.user?.is_checkin_today && !user?.user?.is_checkout
                  ? "Check in"
                  : user?.user?.is_checkin_today && user?.user?.is_checkout
                  ? "Bạn đã checkout hôm nay"
                  : ""}
              </button>

              <button
                style={location ? { display: "none" } : {}}
                className="linear flex flex-row items-center rounded-xl bg-[#F44336] text-white transition duration-200 hover:bg-[#C62828] active:bg-[#E53935] dark:text-white font-bold text-sm sm:text-md"
                data-ripple-light
              >
                <Link
                  className="px-5 py-3 sm:px-8 sm:py-4"
                  target="blank"
                  href="https://support.google.com/maps/answer/2839911?hl=vi&authuser=0&visit_id=638264773336626043-1974392544&co=GENIE.Platform%3DDesktop&oco=&p=browser_lp&rd=1#permission"
                >
                  Tìm hiểu thêm
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default Checkin;
