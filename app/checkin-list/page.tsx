"use client";

import { useEffect, useState } from "react";
import apiAttendences from "@/api/attendances";
import TableAttendances from "@/components/table/Attendances";
import { showToastMessage } from "@/utils/helper";

const CheckinList = () => {
  const [filterMonth, setFilterMonth] = useState(
    () => new Date().getMonth() + 1
  );
  const [attendances, setAttendances] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getListAttendencesUser();
  }, [filterMonth, currentPage]);

  const getListAttendencesUser = async () => {
    try {
      const params: any = {
        month: filterMonth,
        page: currentPage,
        per_page: 5,
      };
      setIsLoading(true);
      const response = await apiAttendences.getAttendencesUser(params);
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

  const handleExport = async () => {
    try {
      const params: any = {
        month: "8",
        year: "2023",
        user_id: 20,
      };
      const response = await apiAttendences.exportExcel(params);
      if (response.status === 200) {
        // Create a temporary URL to the Blob data
        const url = URL.createObjectURL(response.data);

        // Create a temporary anchor element to trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = "Danh sách chấm công.xls"; // Change the filename as needed
        a.click();

        // Clean up the temporary objects
        URL.revokeObjectURL(url);

        showToastMessage("Download file thành công", "success");
      }
    } catch (error) {
      console.log("error", error);
      showToastMessage("Download file thất bại", "error");
    }
  };

  return (
    <>
      {/* <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleExport}
        >
          Export excel
        </button>
      </div> */}
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
      <TableAttendances
        attendances={attendances}
        isLoading={isLoading}
        totalPage={totalPage}
        currentPage={currentPage}
        changeCurrentPage={handleChangeCurrentPage}
      />
    </>
  );
};

export default CheckinList;
