"use client";

import { useEffect, useState } from "react";
import Detail from "@/components/Detail/Detail";
import apiAttendences from "@/api/attendances";
import Loading from "@/components/loading/index";
import { UserDetail } from "@/interfaces/user";

const DetailUser = ({ params }: { params: { slug: number } }) => {
  const { slug } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [userAttendance, setUserAttendance] = useState<UserDetail[]>();

  useEffect(() => {
    getDetailAttendencesUser();
  }, []);

  const getDetailAttendencesUser = async () => {
    try {
      setIsLoading(true);
      const res = await apiAttendences.getDetailAttendences(slug);
      if (res.status === 200) {
        setUserAttendance(res.data.attendance);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between p-4 sm:p-12 h-auto sm:h-[calc(100vh-231px)]">
      {userAttendance && (
        <Detail userAttendance={userAttendance} backRouter="/checkin-list" />
      )}

      {isLoading && <Loading />}
    </div>
  );
};

export default DetailUser;
