"use client";

import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { User } from "@/interfaces/user";
import Pagination from "./Pagination";
import Loading from "../loading";
import { SortDate } from "@/app/checkin-list/page";
import TableStatus from "./Status";
import ModalExplanation from "../modal/Explanation";
import ModalNote from "../modal/Note";

interface Props {
  attendances: AttendancesUser<User>[];
  isLoading: boolean;
  totalPage: number;
  currentPage: number;
  sortDate: SortDate;
  checkinListUser?: boolean;
  handleSortDate: () => void;
  changeCurrentPage: (currentPage: number) => void;
  handleDetailAttendances: (id: number) => void;
  handleExplanation?: () => void;
  handleNote?: () => void;
}

export interface AttendancesUser<T> {
  check_in_lat?: string;
  check_in_lng?: string;
  check_in_location?: string;
  check_in_time?: string;
  check_out_lat?: string;
  check_out_lng?: string;
  check_out_location?: string;
  check_out_time?: string;
  id: number;
  user: T;
  user_id: number;
  working_time?: string;
  cv_working_time: string;
  created_at: string;
  status: number;
  request_time_status: number;
}

const CHECKIN_CHECKOUT = 1;
const EIGHT_HOUR_TO_MINUTES = 8 * 60 * 60;

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

const TableAttendances = (props: Props) => {
  const {
    attendances,
    isLoading,
    totalPage,
    sortDate,
    checkinListUser,
    handleSortDate,
    changeCurrentPage,
    handleDetailAttendances,
    handleExplanation,
    handleNote,
  } = props;

  const [isShowModalExplanation, setIsShowModalExplanation] = useState(false);
  const [isShowModalNote, setIsShowModalNote] = useState(false);

  const [attendaceSelected, setAttendaceSelected] =
    useState<AttendancesUser<User> | null>(null);

  const convertDateTime = (date?: string, format?: string) => {
    if (!date) return "";

    return dayjs(date).format(format || "HH:mm:ss");
  };

  const onHandleDetailAttendances = (id: number) => {
    handleDetailAttendances(id);
  };

  const showExplanation = (e: any, item: AttendancesUser<User>) => {
    e.stopPropagation();
    setIsShowModalExplanation(true);
    setAttendaceSelected(item);
  };

  const showNote = (e: any, item: AttendancesUser<User>) => {
    e.stopPropagation();
    setIsShowModalNote(true);
    setAttendaceSelected(item);
  };

  const handleCloseModal = () => {
    setIsShowModalExplanation(false);
    setIsShowModalNote(false);
    setAttendaceSelected(null);
  };

  const timeKeepingError = (item: AttendancesUser<User>): boolean => {
    if (item.status !== CHECKIN_CHECKOUT) return true;

    if (Number(item.working_time) < EIGHT_HOUR_TO_MINUTES) return true;

    return false;
  };

  const requestTimeStatus = (
    item: AttendancesUser<User>
  ): RequestTimeStatus | null => {
    const requestTime = REQUEST_TIME_STATUS.find(
      (rqTime) => rqTime.value === item.request_time_status
    );
    if (!requestTime && timeKeepingError(item)) {
      return { value: 0, text: "Cần giải trình", bgColor: "bg-[#dc354580]" };
    }
    return requestTime || null;
  };

  return (
    <>
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
                Giờ vào
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Địa điểm vào
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Giờ ra
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Địa điểm ra
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Tổng giờ làm
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[80px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Trạng thái
              </th>
              {checkinListUser && (
                <th
                  scope="col"
                  className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  Explanation
                </th>
              )}
              {checkinListUser && (
                <th
                  scope="col"
                  className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  Note
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {attendances.length > 0 &&
              attendances.map((item) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                  key={item.id}
                  onClick={() => onHandleDetailAttendances(item.id)}
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
                    {convertDateTime(item.check_in_time, "")}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {item.check_in_location}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {convertDateTime(item.check_out_time, "")}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {item.check_out_location}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {item.cv_working_time}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    <TableStatus requestTimeStatus={requestTimeStatus(item)} />
                  </td>
                  {checkinListUser && (
                    <td className="px-3 py-2 sm:px-6 sm:py-4 text-[#4d778f]">
                      {requestTimeStatus(item)?.value === 0 && (
                        <div
                          className="flex gap-1 items-center pr-3"
                          onClick={(event) => showExplanation(event, item)}
                        >
                          <Image
                            src="/icon-edit1.png"
                            alt="icon-edit"
                            width="10"
                            height="10"
                            className="w-4 h-4"
                          />
                          <span className="whitespace-nowrap text-[13px]">
                            Giải trình
                          </span>
                        </div>
                      )}
                    </td>
                  )}
                  {checkinListUser && (
                    <td className="px-3 py-2 sm:px-6 sm:py-4 text-[#4d778f]">
                      <div
                        className="flex gap-1 items-center pr-3"
                        onClick={(event) => showNote(event, item)}
                      >
                        <Image
                          src="/icon-edit1.png"
                          alt="icon-edit"
                          width="10"
                          height="10"
                          className="w-4 h-4"
                        />
                        <span className="whitespace-nowrap text-[13px]">
                          Note
                        </span>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isLoading && <Loading />}
      <Pagination totalPage={totalPage} changeCurrentPage={changeCurrentPage} />
      <ModalExplanation
        isShowModal={isShowModalExplanation}
        attendaceSelected={attendaceSelected}
        handleCloseModal={handleCloseModal}
        handleExplanation={handleExplanation}
      />
      <ModalNote
        isShowModal={isShowModalNote}
        attendaceSelected={attendaceSelected}
        handleCloseModal={handleCloseModal}
        handleNote={handleNote}
      />
    </>
  );
};

export default TableAttendances;
