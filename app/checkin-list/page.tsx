"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import apiAttendences from "@/api/attendances";
import TableAttendances from "@/components/table/Attendances";

const CheckinList = () => {
  const [filterMonth, setFilterMonth] = useState(
    () => new Date().getMonth() + 1
  );
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    getListAttendencesUser();
  }, [filterMonth]);

  const getListAttendencesUser = async () => {
    try {
      const params: any = {
        month: filterMonth,
      };
      const response = await apiAttendences.getAttendencesUser(params);
      if (response.status === 200) {
        setAttendances(response.data.attendances || []);
      }
    } catch (error: any) {
      console.log("error", error.response);
    }
  };

  return (
    <>
      <div className="container mx-auto flex justify-end items-center gap-2 md:my-4 w-[90%] max-md:my-10">
        <label htmlFor="">Lọc theo tháng: </label>
        <input
          type="month"
          className="border"
          onChange={(e: any) =>
            setFilterMonth(new Date(e.target.value).getMonth() + 1)
          }
        />
      </div>
      <TableAttendances attendances={attendances} />
    </>
  );
};

export default CheckinList;
