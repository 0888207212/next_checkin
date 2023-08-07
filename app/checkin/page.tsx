"use client";

import { useLocation } from "@/hook/useLocation";
import { useGetDateTime } from "@/hook/useCurrentDate";
import { AppDispatch, useAppSelector } from "@/redux/store";
import apiCheckIn from "@/api/checkin";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserCheckin } from "@/redux/features/auth-slice";
import { GetAllLocation } from "@/interfaces/location";
import { showToastMessage } from "@/utils/helper/index";
import apiLocation from "@/api/geo-location";
import Loading from "@/components/loading/index";
import Map from "@/components/map/map";
import bg from "@/public/map.png";
import Link from "next/link";

const Checkin = () => {
  const { lat, lng } = useLocation();
  const [date, setDate] = useState("");
  const [location, setLocation] = useState<GetAllLocation>();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector((state) => state.authReducer.value);

  let statusCheck: number = 0;

  useEffect(() => {
    setInterval(() => {
      const getDate = useGetDateTime(new Date());
      setDate(getDate);
    }, 1000);

    if (lat && lng) {
      getLocation();
    }
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
          showToastMessage("CheckOut Success", "success");
        } else showToastMessage("CheckIn Success", "success");
        dispatch(updateUserCheckin());
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full sm:h-[calc(100vh-231px)] py-12 dark:bg-gray-800 flex items-center">
      <div className="container mx-auto flex flex-row max-sm:flex-col justify-between items-start">
        <div className="w-full mb-3 sm:w-1/2 sm: mr-4">
          <Map
            iconSize={40}
            lat={location ? location?.lat : ""}
            lng={location ? location?.lon : ""}
            style={"w-full h-[200px] sm:h-[350px]"}
          />
        </div>

        <div className="flex flex-col w-full sm:w-1/2">
          <div
            className="flex flex-col border px-2 py-6 md:p-16 rounded-lg shadow-md bg-[#f3f6fd]"
            style={{ backgroundImage: `url(${bg.src})` }}
          >
            <p className="font-bold text-[#FF9800] text-xl sm:text-2xl mb-6">
              CheckIn Now
            </p>
            <div className="flex flex-row items-center mb-5 gap-3">
              <svg
                className="w-5 h-5 sm:h-8 sm:w-8 text-yellow-500"
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
              <span className="font-bold text-[#555540] text-md sm:text-xl">
                {date ? date : ""}
              </span>
            </div>
            <div className="flex flex-row items-center gap-3">
              <div>
                <svg
                  className="w-5 h-5 sm:h-8 sm:w-8 text-red-500"
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
              <span className="font-bold text-[#555540] text-md sm:text-xl">
                {location
                  ? `${location?.display_name}`
                  : "Vị trí của bạn chưa được bật"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              style={!location ? { display: "none" } : {}}
              className="linear flex flex-row items-center rounded-xl bg-green-500 px-6 py-4 sm:px-10 sm:py-6 text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 font-bold text-md sm:text-xl"
              data-ripple-light
              onClick={() => handleCheckIn()}
            >
              {user.user?.is_checkin_today ? "Check Out" : "Check In"}
            </button>

            <button
              style={location ? { display: "none" } : {}}
              className="linear flex flex-row items-center rounded-xl bg-[#F44336] text-white transition duration-200 hover:bg-[#C62828] active:bg-[#E53935] dark:text-white font-bold text-md sm:text-xl"
              data-ripple-light
            >
              <Link
                className=" px-6 py-4 sm:px-10 sm:py-6"
                target="blank"
                href="https://support.google.com/maps/answer/2839911?hl=vi&authuser=0&visit_id=638264773336626043-1974392544&co=GENIE.Platform%3DDesktop&oco=&p=browser_lp&rd=1#permission"
              >
                Hướng dẫn bật vị trí để checkin
              </Link>
            </button>
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default Checkin;
