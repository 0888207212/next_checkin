"use client";

import { useEffect, useState } from "react";
import Detail from "@/components/Detail/Detail";
import apiAttendences from "@/api/attendances";
import Loading from "@/components/loading/index";
import { UserDetail } from "@/interfaces/user";
import { useRouter } from "next/navigation";

const DetailUser = ({ params }: { params: { slug: number } }) => {
  const { slug } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [userAttendance, setUserAttendance] = useState<UserDetail[]>();
  const router = useRouter();

  useEffect(() => {
    getDetailAttendencesUser();
  }, []);

  const getDetailAttendencesUser = async () => {
    try {
      setIsLoading(true);
      const res = await apiAttendences.getDetailAttendencesAdmin(slug);
      if (res.status === 200) {
        setUserAttendance(res.data.attendance);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackCheckin = () => {
    return router.push("/checkin-management");
  };

  return (
    <div>
      <button
        className="container flex items-center justify-center border rounded w-[50px] p-1 my-4 mx-[16px] sm:mx-[11%] shadow-sm text-[#757575]  bg-[#ECEFF1] transition duration-200 hover:bg-[#CFD8DC] active:bg-[#CFD8DC] dark:text-white"
        onClick={() => handleBackCheckin()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 sm:w-6 h-4 sm:h-6 "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>{" "}
      </button>

      <div className="flex flex-col items-center justify-between p-4 sm:p-12 h-auto sm:h-[calc(100vh-231px)]">
        {userAttendance && <Detail userAttendance={userAttendance} />}

        {isLoading && <Loading />}
      </div>
    </div>
  );
};

export default DetailUser;
