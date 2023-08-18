"use client";

import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { User } from "@/interfaces/user";
import Pagination from "./Pagination";
import Loading from "../loading";
import TableStatus from "./Status";
import { SortDate } from "@/app/checkin-list/page";
import { STATUS } from "@/utils/contants/index";
import apiAttendences from "@/api/attendances";
import { showToastMessage } from "@/utils/helper/index";

interface Props {
  requestTimes: RequestTimes<User>[];
  isLoading?: boolean;
  isShowSearchFilter?: boolean;
  totalPage: number;
  currentPage?: number;
  sortDate?: SortDate;
  handleSortDate?: () => void;
  changeCurrentPage: (currentPage: number) => void;
  handleExplanation?: () => void;
  changIsShowSearchFilter: (isShowSearchFilter: boolean) => void;
}

export interface RequestTimes<T> {
  id: number;
  user_id: number;
  attendance_id: number;
  request_type: number;
  status: number;
  note: string;
  manager_id: number;
  created_at: string;
  user: T;
}

interface RequestTimeStatus {
  value: number;
  text: string;
  bgColor: string;
}

const REQUEST_TIME_STATUS: RequestTimeStatus[] = [
  {
    value: 1,
    text: "Chờ phê duyệt",
    bgColor: "bg-[#e28743]",
  },
  {
    value: 2,
    text: "Đã phê duyệt",
    bgColor: "bg-[#28a74580]",
  },
  {
    value: 3,
    text: "Đã từ chối",
    bgColor: "bg-[#F4365A]",
  },
];

const TableRequestTime = (props: Props) => {
  const {
    requestTimes,
    isLoading,
    totalPage,
    sortDate,
    handleSortDate,
    changeCurrentPage,
    handleExplanation,
    changIsShowSearchFilter,
  } = props;

  const [showDetail, setShowDetail] = useState(false);
  const [userDetail, setUserDetail] = useState<RequestTimes<User>>();
  const [loading, setLoading] = useState(false);
  const convertDateTime = (date?: string, format?: string) => {
    if (!date) return "";

    return dayjs(date).format(format || "HH:mm:ss");
  };

  const onHandleDetailRequestTime = (item: RequestTimes<User>) => {
    setUserDetail(item);
    setShowDetail(true);
    changIsShowSearchFilter(true);
  };

  const handleRequestTime = (type: number) => {
    if (type === 1) {
      return "Xin nghỉ";
    } else if (type === 2) {
      return "Quên chấm công";
    } else {
      return "Không làm đủ 8h";
    }
  };

  const handleRequestStatus = (status: number) => {
    if (status === STATUS.pending) {
      return "Pending";
    } else if (status === STATUS.approved) {
      return "Approved";
    } else {
      return "Rejected";
    }
  };

  const requestTimeStatus = (
    item: RequestTimes<User>
  ): RequestTimeStatus | null => {
    const requestTime = REQUEST_TIME_STATUS.find(
      (rqTime) => rqTime.value === item.status
    );
    return requestTime || null;
  };

  const handleBack = () => {
    setShowDetail(false);
    changIsShowSearchFilter(false);
  };

  const handleAccept = async (id: number) => {
    const payload: any = {
      status: 2,
    };
    try {
      setLoading(true);
      const res = await apiAttendences.putRequestTime(id, payload);
      if (res.status === 200) {
        showToastMessage("Approved Success", "success");
        handleExplanation && handleExplanation();
        setShowDetail(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    const payload: any = {
      status: 3,
    };
    try {
      setLoading(true);
      const res = await apiAttendences.putRequestTime(id, payload);
      if (res.status === 200) {
        showToastMessage("Rejected Success", "success");
        handleExplanation && handleExplanation();
        setShowDetail(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!showDetail && (
        <div className="mx-auto mb-10 relative min-h-[600px] max-h-[600px] overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  <div className="flex items-center gap-2">
                    Ngày
                    <Image
                      src="/sort-date.png"
                      alt="icon-sort"
                      width="10"
                      height="10"
                      className={`cursor-ns-resize ${
                        sortDate === "ASC" && "transform rotate-180"
                      }`}
                      onClick={handleSortDate}
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  Tên nhân viên
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 sm:px-6 sm:py-3 w-[120px] whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  ID nhân viên
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  Loại giải trình
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 sm:px-6 sm:py-3 w-[80px] whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {requestTimes.length > 0 &&
                requestTimes.map((item) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                    key={item.id}
                    onClick={() => onHandleDetailRequestTime(item)}
                  >
                    <td className="px-3 py-2 sm:px-6 sm:py-4">
                      {convertDateTime(item.created_at, "DD/MM/YYYY")}
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4">
                      {item.user?.full_name}
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4">
                      {item.user?.code}
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4">
                      {handleRequestTime(item.request_type)}
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4">
                      <TableStatus
                        requestTimeStatus={requestTimeStatus(item)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {showDetail && userDetail && (
        <div className="2xl:min-h-[700px] 2xl:max-h-[700px] 2xl:mt-10">
          <div className="flex flex-row items-center">
            <button
              className="flex items-center justify-center border rounded w-[50px] my-4 p-1 shadow-sm text-[#757575]  bg-[#ECEFF1] transition duration-200 hover:bg-[#CFD8DC] active:bg-[#CFD8DC] dark:text-white"
              onClick={() => handleBack()}
            >
              {" "}
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
            <span className="font-medium ml-5 text-xs sm:text-base">{`Giải trình ngày ${convertDateTime(
              userDetail?.created_at || "",
              "DD/MM/YYYY"
            )} - ${userDetail?.user?.full_name}`}</span>
          </div>

          <div className="flex flex-col border rounded-md shadow-md mx-full mb-10 ">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-center text-xs sm:text-base font-light">
                    <tbody>
                      <tr>
                        <td className="flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                          Nhân viên
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 float-left font-normal">
                          {userDetail?.user?.full_name}
                        </td>
                      </tr>
                      <tr>
                        <td className="flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                          Bộ phận
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 float-left font-normal">
                          {userDetail?.user?.center}
                        </td>
                      </tr>
                      <tr>
                        <td className="flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                          ID nhân viên
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 float-left font-normal">
                          {userDetail?.user?.code}
                        </td>
                      </tr>
                      <tr>
                        <td className="flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                          Loại giải trình
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 float-left font-normal">
                          {handleRequestTime(userDetail.request_type)}
                        </td>
                      </tr>
                      <tr>
                        <td className="flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                          Lý do
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 float-left font-normal">
                          {userDetail.note || ""}
                        </td>
                      </tr>
                      <tr className="flex flex-row">
                        <td className="whitespace-nowrap flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                          Trạng thái
                        </td>
                        <td className=" px-6 py-4 float-left font-normal">
                          {handleRequestStatus(userDetail.status)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  className={`flex-row justify-center sm:justify-end gap-4 mt-4 ${
                    userDetail.status === 1 ? "flex" : "hidden"
                  }`}
                >
                  <button
                    className="px-5 py-3 sm:px-8 sm:py-4  linear flex flex-row items-center rounded-xl bg-green-500 text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white font-bold text-sm sm:text-md"
                    data-ripple-light
                    onClick={() => handleAccept(userDetail.id)}
                  >
                    Chấp nhận
                  </button>
                  <button
                    className="px-5 py-3 sm:px-8 sm:py-4 mr-4 linear flex flex-row items-center rounded-xl bg-[#F44336] text-white transition duration-200 hover:bg-[#C62828] active:bg-[#E53935] dark:text-white font-bold text-sm sm:text-md"
                    data-ripple-light
                    onClick={() => handleReject(userDetail.id)}
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoading && <Loading />}
      {loading && <Loading />}
      {!showDetail && (
        <Pagination
          totalPage={totalPage}
          changeCurrentPage={changeCurrentPage}
        />
      )}
    </>
  );
};

export default TableRequestTime;
