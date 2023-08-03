"use client";

import { useEffect, useState } from "react";
import apiAttendences from "@/api/attendances";
import TableAttendances from "@/components/table/Attendances";

const CheckinManagement = () => {
  const [attendances, setAttendances] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getListAttendencesManagementForAdmin();
  }, [currentPage]);

  const getListAttendencesManagementForAdmin = async () => {
    try {
      setIsLoading(true);
      const response = await apiAttendences.getAttendencesManagementForAdmin();
      if (response.status === 200) {
        setAttendances(response.data.attendances || []);
        setTotalPage(response.data.meta.total_pages || 1);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log("error", error.response);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeCurrentPage = (currentPageValue: number) => {
    setCurrentPage(currentPageValue);
  };

  return (
    <div>
      <TableAttendances
        attendances={attendances}
        isLoading={isLoading}
        totalPage={totalPage}
        currentPage={currentPage}
        changeCurrentPage={handleChangeCurrentPage}
      />
    </div>
  );
};

export default CheckinManagement;
